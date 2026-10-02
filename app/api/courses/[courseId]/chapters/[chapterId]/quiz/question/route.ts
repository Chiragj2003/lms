import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(
    req: Request,
    props: { params : Promise<{ courseId : string, chapterId: string }> }
) {
    const params = await props.params;
    try {
        const session = await auth();
        if ( !session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized attempt", {status: 401});
        }

        const courseTutor = await db.course.findUnique({
            where : {
                id : params.courseId,
                tutorId : session.user.id
            },
            select :{ 
                id : true
            }
        });

        if ( !courseTutor ) {
            return new NextResponse("Unauthorized attempt", {status: 401});
        }

        // The quiz must belong to a chapter of the owned course.
        const quiz = await db.quiz.findFirst({
            where : {
                chapterId : params.chapterId,
                chapter : { courseId : params.courseId }
            },
            select : {
                id: true
            }
        });

        if (!quiz) {
            return new NextResponse("Quiz not found", {status: 404});
        }

        const question = await db.quizQuestion.create({
            data : {
                question : "",
                quizId : quiz.id,
            },
            include : {
                options : true
            }
        });
        
        return NextResponse.json(question);
        
    } catch (error) {
        console.error("QUIZ QUESTION POST API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}


export async function PATCH(
    req: Request,
    props: { params : Promise<{ courseId : string, chapterId: string }> }
) {
    const params = await props.params;
    try {
        const session = await auth();
        if ( !session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized attempt", {status: 401});
        }

        const { items } : { items : {id: string, position: number}[] } = await req.json();

        const courseTutor = await db.course.findUnique({
            where : {
                id : params.courseId,
                tutorId : session.user.id
            },
            select :{ 
                id : true
            }
        });

        if ( !courseTutor ) {
            return new NextResponse("Unauthorized attempt", {status: 401});
        }


        if (!Array.isArray(items) || items.some((item)=>typeof item?.id !== "string" || !Number.isInteger(item?.position))) {
            return new NextResponse("Invalid question order", {status: 400});
        }

        // Scoped to this chapter's quiz in the owned course, so ids from
        // another tutor's quiz match nothing.
        await db.$transaction(items.map((item)=>(
            db.quizQuestion.updateMany({
                where : {
                    id : item.id,
                    quiz : { chapterId : params.chapterId, chapter : { courseId : params.courseId } }
                },
                data : {
                    position : item.position
                }
            })
        )));
        
        return NextResponse.json({success : true});
        
    } catch (error) {
        console.error("QUIZ QUESTION POST API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}