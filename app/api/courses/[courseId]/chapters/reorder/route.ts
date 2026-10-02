import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req : Request, props: {params : Promise<{ courseId: string}>}) {
    const params = await props.params;
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized attempt", {status: 401});
        }
        const { list } : {list : {id: string, position: number}[]} = await req.json();

        const courseTutor = await db.course.findUnique({
            where : {
                id : params.courseId,
                tutorId : session.user.id
            }
        });

        if ( !courseTutor ) {
            return new NextResponse("Course not found", {status: 404});
        }

        if (!Array.isArray(list) || list.some((item)=>typeof item?.id !== "string" || !Number.isInteger(item?.position))) {
            return new NextResponse("Invalid chapter order", {status: 400});
        }

        // updateMany scoped to the owned course: an id from another course
        // matches nothing instead of reordering someone else's chapters.
        await db.$transaction(list.map((item)=>db.chapter.updateMany({
            where : { id: item.id, courseId: params.courseId },
            data : { position: item.position }
        })));

        return NextResponse.json({success: true});

    } catch (error) {
        console.error("CHAPTER REORDER API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}