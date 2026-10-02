import { NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { purchaseCourses } from "@/lib/cart";
import { isDemoCheckoutEnabled } from "@/lib/razorpay";

/**
 * Completes a purchase made through the mock payment gateway.
 *
 * Only runs when the demo gateway is explicitly enabled (DEMO_CHECKOUT=true)
 * and Razorpay is unconfigured. Otherwise it would grant any course for free.
 */
export async function POST(req: Request, props: { params : Promise<{ courseId : string }> }) {
    const params = await props.params;

    try {
        if (!isDemoCheckoutEnabled()) {
            return new NextResponse("Demo checkout is turned off", {status: 403});
        }

        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if (!(await rateLimit(`checkout:${session.user.id}`, 10, 60))) {
            return tooManyRequests(60);
        }

        if (session.user.role === "TUTOR") {
            return new NextResponse("Tutors cannot purchase courses", {status: 403});
        }

        const course = await db.course.findUnique({
            where : { id : params.courseId, isPublished : true },
            select : { id : true }
        });

        if (!course) {
            return new NextResponse("Course not found", {status: 404});
        }

        // Idempotent, so a double submit can't fail on the unique constraint.
        await purchaseCourses(session.user.id, [course.id]);

        return NextResponse.json({ success : true });

    } catch (error) {
        console.error("MOCK CHECKOUT CONFIRM ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}
