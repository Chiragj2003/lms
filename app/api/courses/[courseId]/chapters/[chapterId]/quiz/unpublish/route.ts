import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isRecordNotFound } from "@/lib/prisma-errors";
import { NextResponse } from "next/server";


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

        const courseTutor = await db.course.findUnique({
            where : {
                id : params.courseId,
                tutorId : session.user.id
            }
        });

        if ( !courseTutor ) {
            return new NextResponse("Course not found", {status: 404});
        }

        await db.quiz.update({
            where : {
                chapterId : params.chapterId,
                chapter : { courseId : params.courseId }
            },
            data : {
                isPublished : false
            }
        });

        return NextResponse.json({success : true});

    } catch (error) {
        if (isRecordNotFound(error)) {
            return new NextResponse("Quiz not found", {status: 404});
        }
        console.error("CHAPTER QUIZ UNPUBLISH API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}