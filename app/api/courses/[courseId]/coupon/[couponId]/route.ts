import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { isRecordNotFound } from "@/lib/prisma-errors";

export async function DELETE(
    req: Request,
    props: { params : Promise<{ courseId: string, couponId: string }> }
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

        await db.coupon.delete({
            where : {
                id : params.couponId,
                courseId: params.courseId
            }
        })

        return NextResponse.json({success: true});

    } catch (error) {
        if (isRecordNotFound(error)) {
            return new NextResponse("Coupon not found", { status: 404 });
        }
        console.error("COUPON DELETE API ERROR", error);
        return new NextResponse("Internal server error", { status: 500});
    }
}