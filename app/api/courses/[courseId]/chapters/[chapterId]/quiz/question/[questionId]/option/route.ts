import { auth } from "@/auth";
import { db } from "@/lib/db";
import { OptionSchema } from "@/schemas/option.schema";
import { NextResponse } from "next/server";
import { isRecordNotFound } from "@/lib/prisma-errors";

// Options are only reachable through this chapter's quiz in the course from
// the URL (whose ownership is checked below). Matching on the option or
// question id alone let a tutor change which answer is correct on any quiz.
const ownedQuestionScope = (params : { courseId : string, chapterId : string }) => ({
    quiz : { chapterId : params.chapterId, chapter : { courseId : params.courseId } }
});


export async function POST(
    req: Request,
    props: { params : Promise<{ courseId : string, chapterId: string, questionId: string }> }
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

        const question = await db.quizQuestion.findFirst({
            where : { id : params.questionId, ...ownedQuestionScope(params) },
            select : { id : true }
        });

        if (!question) {
            return new NextResponse("Question not found", {status: 404});
        }

        const option = await db.option.create({
            data : {
                answer : "",
                questionId : question.id
            }
        });

        return NextResponse.json(option);
        
    } catch (error) {
        if (isRecordNotFound(error)) {
            return new NextResponse("Option not found", {status: 404});
        }
        console.error("QUIZ OPTION API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}


export async function PATCH(
    req: Request,
    props: { params : Promise<{ courseId : string, chapterId: string, questionId: string }> }
) {
    const params = await props.params;
    try {

        const session = await auth();
        if ( !session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized attempt", {status: 401});
        }

        const {searchParams} = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return new NextResponse("Id required", {status: 401});
        }

        const body = await req.json();
        const validatedData = await OptionSchema.safeParseAsync(body);

        if (!validatedData.success) {
            return new NextResponse("Invalid fields", {status: 401});
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

        const option = await db.option.update({
            where : {
                id,
                question : { id : params.questionId, ...ownedQuestionScope(params) }
            },
            data : validatedData.data
        });

        return NextResponse.json(option);
        
    } catch (error) {
        if (isRecordNotFound(error)) {
            return new NextResponse("Option not found", {status: 404});
        }
        console.error("QUIZ OPTION API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}


export async function DELETE(
    req: Request,
    props: { params : Promise<{ courseId : string, chapterId: string, questionId: string }> }
) {
    const params = await props.params;
    try {

        const session = await auth();
        if ( !session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized attempt", {status: 401});
        }

        const {searchParams} = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return new NextResponse("Id required", {status: 401});
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


        await db.option.delete({
            where : {
                id,
                question : { id : params.questionId, ...ownedQuestionScope(params) }
            }
        });
        
        return NextResponse.json({success: true});
        
    } catch (error) {
        if (isRecordNotFound(error)) {
            return new NextResponse("Option not found", {status: 404});
        }
        console.error("QUIZ OPTION DELETE API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}