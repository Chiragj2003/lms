import { NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";

import { auth } from "@/auth";
import { getCartCourseIds, purchaseCourses } from "@/lib/cart";

/**
 * Completes a cart purchase through the demo gateway. Refuses to run once
 * Razorpay is configured, same as the single-course demo confirm route.
 */
export async function POST() {
    try {
        if (process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_SECRET) {
            return new NextResponse("Mock checkout is disabled when Razorpay is configured", { status: 403 });
        }

        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!(await rateLimit(`checkout:${session.user.id}`, 10, 60))) {
            return tooManyRequests(60);
        }

        if (session.user.role === "TUTOR") {
            return new NextResponse("Tutors cannot purchase courses", { status: 403 });
        }

        const courseIds = await getCartCourseIds(session.user.id);
        if (courseIds.length === 0) {
            return new NextResponse("Your cart is empty", { status: 400 });
        }

        await purchaseCourses(session.user.id, courseIds);

        return NextResponse.json({ success : true });

    } catch (error) {
        console.error("CART MOCK CONFIRM ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
