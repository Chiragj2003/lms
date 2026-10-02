import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isRecordNotFound } from "@/lib/prisma-errors";
import { ChapterUpdateSchema } from "@/schemas/chapter-update.schema";
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

        // Only the fields the chapter forms edit; the body used to be spread
        // into the update, so any column or nested relation was writable.
        const parsed = ChapterUpdateSchema.safeParse(await req.json());
        if (!parsed.success) {
            return new NextResponse("Invalid chapter fields", {status: 400});
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

        // Scoped to the owned course: matching on chapterId alone let a tutor
        // edit any chapter on the platform by pairing it with their own course.
        const chapter = await db.chapter.update({
            where : {
                id : params.chapterId,
                courseId : params.courseId
            },
            data : parsed.data
        });

        return NextResponse.json(chapter);

    } catch (error) {
        if (isRecordNotFound(error)) {
            return new NextResponse("Chapter not found", {status: 404});
        }
        console.error("CHAPTER PATCH API ERROR", error);
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
            return new NextResponse("Course not found", {status: 404});
        }

        await db.chapter.delete({
            where : {
                id : params.chapterId,
                courseId : params.courseId
            }
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where : {
                courseId : params.courseId,
                isPublished : true
            }
        });

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where : {
                    id: params.courseId
                },
                data : {
                    isPublished : false
                }
            });
        }

        return NextResponse.json({success: true});

    } catch (error) {
        if (isRecordNotFound(error)) {
            return new NextResponse("Chapter not found", {status: 404});
        }
        console.error("CHAPTER DELETE API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}
