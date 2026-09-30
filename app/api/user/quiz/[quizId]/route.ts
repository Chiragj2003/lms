import { auth } from "@/auth";
import { db } from "@/lib/db";
import { QuizResponseSchema } from "@/schemas/quiz-response.schema";
import { NextResponse } from "next/server";

export async function POST(req : Request, props: { params : Promise<{ quizId: string }> }) {
    const params = await props.params;
    try {
        
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", {status: 400});
        }

        const body = await req.json();
        const validatedData = await QuizResponseSchema.safeParseAsync(body);

        if ( !validatedData.success ) {
            return new NextResponse("Invalid quiz details", {status: 400});
        }

        const data = validatedData.data;

        const quiz = await db.quiz.findFirst({
            where : {
                id : params.quizId,
                isPublished : true,
                chapter : { isPublished : true }
            },
            select : { chapter : { select : { courseId : true } } }
        });

        if (!quiz) {
            return new NextResponse("Quiz not found", {status: 404});
        }

        // Only learners who bought the course can submit its quiz.
        const purchase = await db.purchase.findUnique({
            where : {
                userId_courseId : {
                    userId : session.user.id,
                    courseId : quiz.chapter.courseId
                }
            }
        });

        if (!purchase) {
            return new NextResponse("Course is not purchased", {status: 403});
        }

        // One attempt per learner (QuizResult is unique per user and quiz); a
        // second submit used to crash on that constraint with a 500.
        const existing = await db.quizResult.findUnique({
            where : {
                userId_quizId : {
                    userId : session.user.id,
                    quizId : params.quizId
                }
            },
            select : { id : true }
        });

        if (existing) {
            return new NextResponse("You've already submitted this quiz", {status: 409});
        }

        const quizQuestions = await db.quizQuestion.findMany({
            where : {
                quizId : params.quizId
            },
            include : {
                options : {
                    where : {
                        isCorrect : true
                    }
                }
            }
        });

        const correctQuestions : string[] = [];
        const inCorrectQuestions : string[] = [];

        quizQuestions.forEach((question)=>{
            const formOption = data.response.find((answer)=>answer.questionId===question.id)?.optionId
            const questionOption = question.options[0]?.id
            if ( formOption === questionOption ) {
                correctQuestions.push(question.id);
            } else {
                inCorrectQuestions.push(question.id);
            }
        });

        await db.quizResult.create({
            data : {
                userId : session.user.id,
                correctQuestions,
                inCorrectQuestions,
                quizId : params.quizId
            }
        });

        return NextResponse.json({success: true});

    } catch (error) {
        console.error("USER QUIZ POST API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}