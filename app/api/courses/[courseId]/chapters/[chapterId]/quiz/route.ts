import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isRecordNotFound } from "@/lib/prisma-errors";
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
            }
        });

        if ( !courseTutor ) {
            return new NextResponse("Unauthorized attempt", {status: 401});
        }

        // The chapter must belong to the owned course, or a tutor could attach
        // a quiz to any chapter on the platform.
        const chapter = await db.chapter.findFirst({
            where : { id : params.chapterId, courseId : params.courseId },
            select : { id : true }
        });

        if (!chapter) {
            return new NextResponse("Chapter not found", {status: 404});
        }

        await db.quiz.create({
            data : {
                chapterId : chapter.id
            }
        });

        return NextResponse.json({success : true});
        
    } catch (error) {
        console.error("CHAPTER QUIZ POST API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}


export async function DELETE(
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
            }
        });

        if ( !courseTutor ) {
            return new NextResponse("Unauthorized attempt", {status: 401});
        }

        await db.quiz.delete({
            where : {
                chapterId : params.chapterId,
                chapter : { courseId : params.courseId }
            }
        });

        return NextResponse.json({success : true});
        
    } catch (error) {
        if (isRecordNotFound(error)) {
            return new NextResponse("Quiz not found", {status: 404});
        }
        console.error("CHAPTER QUIZ DELETE API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}