import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { ChapterCreateSchema } from "@/schemas/course.schema";

export async function POST(req: Request, props: { params : Promise<{ courseId : string }> }) {
    const params = await props.params;
    try {

        const session = await auth();
        if ( !session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized attempt", {status: 401});
        }
        // The title went straight into the insert, so a missing one crashed
        // with a 500 and any length was accepted.
        const parsed = ChapterCreateSchema.safeParse(await req.json());
        if (!parsed.success) {
            return new NextResponse(parsed.error.issues[0]?.message || "Chapter title is required", {status: 400});
        }
        const { title } = parsed.data;

        const courseTutor = await db.course.findUnique({
            where : {
                id : params.courseId,
                tutorId : session.user.id
            }
        });

        if ( !courseTutor ) {
            return new NextResponse("Course not found", {status: 404});
        }

        const chapter = await db.chapter.create({
            data : {
                title,
                courseId : params.courseId
            }
        });

        return NextResponse.json(chapter);

        
    } catch (error) {
        console.error("CHAPTERS POST API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}