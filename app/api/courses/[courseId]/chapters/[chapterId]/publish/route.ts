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
            return new NextResponse("Unauthorized attempt", {status: 401});
        }

        const chapter = await db.chapter.update({
            where : {
                id : params.chapterId,
                courseId : params.courseId
            },
            data : {
                isPublished : true
            }
        });

        return NextResponse.json(chapter);

    } catch (error) {
        if (isRecordNotFound(error)) {
            return new NextResponse("Chapter not found", {status: 404});
        }
        console.error("CHAPTER PUBLISH PATCH API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}