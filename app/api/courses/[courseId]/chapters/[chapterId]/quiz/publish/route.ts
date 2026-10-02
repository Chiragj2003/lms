import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isRecordNotFound } from "@/lib/prisma-errors";
import { missingForQuiz, notReadyMessage } from "@/lib/publish-readiness";
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

        const owned = await db.quiz.findFirst({
            where : { chapterId : params.chapterId, chapter : { courseId : params.courseId } },
            select : { id : true }
        });

        if (!owned) {
            return new NextResponse("Quiz not found", {status: 404});
        }

        const missing = await missingForQuiz(params.chapterId);
        if (missing.length > 0) {
            return new NextResponse(notReadyMessage(missing), {status: 400});
        }

        await db.quiz.update({
            where : {
                chapterId : params.chapterId,
                chapter : { courseId : params.courseId }
            },
            data : {
                isPublished : true
            }
        });

        return NextResponse.json({success : true});
        
    } catch (error) {
        if (isRecordNotFound(error)) {
            return new NextResponse("Quiz not found", {status: 404});
        }
        console.error("CHAPTER QUIZ PUBLISH API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}