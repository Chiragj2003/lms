import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


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

        const { question } : { question: string } = await req.json();
        if (!question) {
            return new NextResponse("Question required", {status: 401});
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


        await db.quizQuestion.update({
            where : {
                id : params.questionId
            },
            data : {
                question
            }
        });
        
        return NextResponse.json({success: true});
        
    } catch (error) {
        console.error("QUIZ QUESTION DELETE API ERROR", error);
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


        await db.quizQuestion.delete({
            where : {
                id : params.questionId
            }
        });
        
        return NextResponse.json({success: true});
        
    } catch (error) {
        console.error("QUIZ QUESTION DELETE API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}