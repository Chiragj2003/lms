import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, props: { params : Promise<{ courseId : string }> }) {
    const params = await props.params;
    try {

        const session = await auth();
        if ( !session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized attempt", {status: 401});
        }
        const body = await req.json();

        const course = await db.course.update({
            where : {
                id : params.courseId,
                tutorId : session.user.id
            },
            data : {
                ...body
            }
        });

        return NextResponse.json({success : true});

        
    } catch (error) {
        console.error("COURSES POST API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}


export async function DELETE(req: Request, props: { params : Promise<{ courseId : string }> }) {
    const params = await props.params;
    try {

        const session = await auth();
        if ( !session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized attempt", {status: 401});
        }

        await db.course.delete({
            where : {
                id : params.courseId,
                tutorId : session.user.id
            },
        });

        return NextResponse.json({success : true});

        
    } catch (error) {
        console.error("COURSES DELETE API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}