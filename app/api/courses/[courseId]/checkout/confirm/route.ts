import { NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { purchaseCourses } from "@/lib/cart";

/**
 * Completes a purchase made through the mock payment gateway.
 *
 * Only reachable while Razorpay is unconfigured — the same condition under
 * which the checkout route falls back to the mock. Once real keys are set,
 * Razorpay verification owns purchase creation and this route refuses to run,
 * so it can't be used to grant a course for free alongside real payments.
 */
export async function POST(req: Request, props: { params : Promise<{ courseId : string }> }) {
    const params = await props.params;

    try {
        if (process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_SECRET) {
            return new NextResponse("Mock checkout is disabled when Razorpay is configured", {status: 403});
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
