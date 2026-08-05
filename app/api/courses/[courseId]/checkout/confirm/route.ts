import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

/**
 * Completes a purchase made through the mock payment gateway.
 *
 * Only reachable while STRIPE_API_KEY is unset; once real keys are added the
 * Stripe webhook owns purchase creation and this route refuses to run, so it
 * can never be used to grant a course for free in production.
 */
export async function POST(req: Request, props: { params : Promise<{ courseId : string }> }) {
    const params = await props.params;

    try {
        if (process.env.STRIPE_API_KEY) {
            return new NextResponse("Mock checkout is disabled when Stripe is configured", {status: 403});
        }

        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", {status: 401});
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

        // Upsert so a double submit cannot fail on the unique constraint.
        await db.purchase.upsert({
            where  : {
                userId_courseId : { userId : session.user.id, courseId : course.id }
            },
            update : {},
            create : { userId : session.user.id, courseId : course.id }
        });

        return NextResponse.json({ success : true });

    } catch (error) {
        console.error("MOCK CHECKOUT CONFIRM ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}
