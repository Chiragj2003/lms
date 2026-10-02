import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CouponSchema } from "@/schemas/coupon.schema";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: Request, props: { params : Promise<{ courseId: string }> }) {
    const params = await props.params;
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized attempt", {status: 401});
        }

        const body = await req.json();
        const validatedData = await CouponSchema.safeParseAsync(body); 

        if (!validatedData.success) {
            return new NextResponse(validatedData.error.issues[0]?.message || "Invalid fields", {status: 400});
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

        const data = validatedData.data;

        const coupon = await db.coupon.create({
            data : {
                coupon : data.coupon,
                courseId : params.courseId,
                discount : data.discount,
                expires : new Date(data.expires)
            }
        });


        return NextResponse.json(coupon);

    } catch (error) {
        // Codes are unique per course; a repeat used to surface as a 500.
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return new NextResponse("This course already has a coupon with that code", { status: 409 });
        }
        console.error("COUPON POST API ERROR", error);
        return new NextResponse("Internal server error", { status: 500});
    }
}