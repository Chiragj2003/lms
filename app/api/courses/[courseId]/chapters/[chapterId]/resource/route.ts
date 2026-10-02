import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isRecordNotFound } from "@/lib/prisma-errors";
import { NextResponse } from "next/server";
import { deleteUnusedUploads } from "@/lib/storage-cleanup";
import * as z from "zod";

const ResourceSchema = z.object({
    name : z.string().trim().min(1).max(200),
    url : z.string().url().max(2048),
});

// The chapter must sit in a course the signed-in tutor owns. Previously only
// the course in the URL was checked, so a tutor could attach files to — or
// rewrite resources on — any chapter on the platform.
const findOwnedChapter = (courseId: string, chapterId: string, tutorId: string) =>
    db.chapter.findFirst({
        where : { id : chapterId, courseId, course : { tutorId } },
        select : { id : true }
    });

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

        const parsed = ResourceSchema.safeParse(await req.json());
        if (!parsed.success) {
            return new NextResponse("Name and URL required", {status: 400});
        }

        const chapter = await findOwnedChapter(params.courseId, params.chapterId, session.user.id);
        if ( !chapter ) {
            return new NextResponse("Chapter not found", {status: 404});
        }

        const resource = await db.attachment.create({
            data : {
                chapterId : chapter.id,
                name : parsed.data.name,
                url : parsed.data.url
            }
        })

        return NextResponse.json(resource);

    } catch (error) {
        console.error("CHAPTER RESOURCE POST API ERROR", error);
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

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return new NextResponse("Resource Id required", {status: 400});
        }

        const parsed = ResourceSchema.safeParse(await req.json());
        if (!parsed.success) {
            return new NextResponse("Name and URL required", {status: 400});
        }

        const chapter = await findOwnedChapter(params.courseId, params.chapterId, session.user.id);
        if ( !chapter ) {
            return new NextResponse("Chapter not found", {status: 404});
        }

        const previous = await db.attachment.findFirst({
            where : { id, chapterId : chapter.id },
            select : { url : true }
        });

        const resource = await db.attachment.update({
            where : {
                id,
                chapterId : chapter.id
            },
            data : parsed.data
        });

        if (previous && previous.url !== resource.url) {
            await deleteUnusedUploads([previous.url]);
        }

        return NextResponse.json(resource);

    } catch (error) {
        if (isRecordNotFound(error)) {
            return new NextResponse("Resource not found", {status: 404});
        }
        console.error("CHAPTER RESOURCE PATCH API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}
