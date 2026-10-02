import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NoteUpdateSchema, NotesSchema } from "@/schemas/notes.schema";
import { canAccessChapter } from "@/lib/chapter-access";
import { isRecordNotFound } from "@/lib/prisma-errors";
import { NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";

export async function POST(
    req: Request,
    props: { params : Promise<{ courseId: string, chapterId: string }> }
) {
    const params = await props.params;
    try {

        const session = await auth();
        if (!session || !session.user.id) {
            return new NextResponse("Unauthorized Access", {status:401});
        }

        if (!(await rateLimit(`notes:${session.user.id}`, 30, 60))) {
            return tooManyRequests(60);
        }

        const body = await req.json();
        const validatedData = await NotesSchema.safeParseAsync(body);

        if (!validatedData.success){
            return new NextResponse("Invalid note", {status:400});
        }

        const data = validatedData.data;

        // Notes were accepted for any chapter id, including chapters the user
        // can't watch (and an unknown id crashed with a 500).
        const chapter = await db.chapter.findFirst({
            where : { id : params.chapterId, courseId : params.courseId },
            select : { id : true }
        });
        if (!chapter || !(await canAccessChapter(session.user.id, params.chapterId))) {
            return new NextResponse("You don't have access to this chapter", {status: 403});
        }

        const note = await db.note.create({
            data : {
                chapterId : params.chapterId,
                note : data.note,
                time : data.time,
                userId : session.user.id,
            }
        });

        return NextResponse.json(note);

    } catch (error) {
        console.error("NOTES POST API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}


export async function PATCH(
    req: Request
) {
    try {

        const session = await auth();
        if (!session || !session.user.id) {
            return new NextResponse("Unauthorized Access", {status:401});
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return new NextResponse("Note id is missing", {status: 400});
        }

        const parsed = NoteUpdateSchema.safeParse(await req.json());
        if (!parsed.success) {
            return new NextResponse(parsed.error.issues[0]?.message || "Invalid note", {status: 400});
        }

        const upDatedNote = await db.note.update({
            where : {
                id : id,
                userId : session.user.id
            },
            data : {
                note : parsed.data.note
            }
        });

        return NextResponse.json(upDatedNote);

    } catch (error) {
        // Someone else's note, or one already deleted.
        if (isRecordNotFound(error)) {
            return new NextResponse("Note not found", {status: 404});
        }
        console.error("NOTES PATCH API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}


export async function DELETE(
    req: Request,
) {
    try {

        const session = await auth();
        if (!session || !session.user.id) {
            return new NextResponse("Unauthorized Access", {status:401});
        }

        const { searchParams } = new URL(req.url);

        const id = searchParams.get("id");
        if (!id ) {
            return new NextResponse("Note Id is required", {status: 400});
        }

        await db.note.delete({
            where : {
                id,
                userId : session.user.id
            }
        });

        return NextResponse.json({success: true});

    } catch (error) {
        if (isRecordNotFound(error)) {
            return new NextResponse("Note not found", {status: 404});
        }
        console.error("NOTES DELETE API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}
