import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";

export async function GET(req: Request, props: { params : Promise<{ courseId : string }> }) {
    const params = await props.params;

    try {

        // Unauthenticated and answers "valid/invalid", so without a limit
        // coupon codes could be guessed by brute force.
        if (!(await rateLimit(`coupon:${await clientIp()}`, 10, 60))) {
            return tooManyRequests(60);
        }

        const { searchParams } = new URL(req.url);
        const coupon = searchParams.get("coupon");

        if (!coupon) {
            return new NextResponse("Coupon Code is required", { status: 400 });
        }

        const existedCoupon = await db.coupon.findUnique({
            where : {
                courseId_coupon : {
                    courseId : params.courseId,
                    coupon
                }
            }
        });

        if ( !existedCoupon ) {
            return new NextResponse('Coupon is invalid', { status: 404 }); 
        }

        if ( existedCoupon.expires < new Date() ) {
            return new NextResponse('Coupon is expired', { status: 404 }); 
        }

        return NextResponse.json({
            coupon,
            courseId: existedCoupon.courseId,
            discount: existedCoupon.discount 
        });

    } catch (error) {
        console.log("CHECKOUT COUPON GET API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}