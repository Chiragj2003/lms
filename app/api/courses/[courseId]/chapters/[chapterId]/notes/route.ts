import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NotesSchema } from "@/schemas/notes.schema";
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
            return new NextResponse("Invalid values", {status:401});
        }

        const data = validatedData.data;

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
        console.log("NOTES POST API ERROR", error);
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

        const { note } : { note: string } = await req.json();
        const { searchParams } = new URL(req.url);

        const id = searchParams.get("id");
        if (!id || !note) {
            return new NextResponse("Note or Note Id is missing", {status: 400});
        }

        const upDatedNote = await db.note.update({
            where : {
                id : id,
                userId : session.user.id
            },
            data : {
                note
            }
        });

        return NextResponse.json(upDatedNote);
        
    } catch (error) {
        console.log("NOTES POST API ERROR", error);
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
        console.log("NOTES POST API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}