import { NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";
import { v4 as uuidv4 } from "uuid";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
    MAX_CART_CHECKOUT,
    cartOrderNotes,
    getCartCourseIds,
    purchaseCourses
} from "@/lib/cart";
import { getRazorpay, isDemoCheckoutEnabled, isRazorpayConfigured, PAYMENTS_UNAVAILABLE } from "@/lib/razorpay";

export async function POST() {
    try {
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

        if (courseIds.length > MAX_CART_CHECKOUT) {
            return new NextResponse(`You can check out up to ${MAX_CART_CHECKOUT} courses at a time`, { status: 400 });
        }

        const courses = await db.course.findMany({
            where : { id : { in : courseIds }, isPublished : true },
            select : { id : true, price : true }
        });
        const amount = Math.floor(courses.reduce((sum, course) => sum + (course.price ?? 0), 0));

        if (amount <= 0) {
            await purchaseCourses(session.user.id, courseIds);
            return NextResponse.json({ url : "/user/my-learning" });
        }

        if (!isRazorpayConfigured()) {
            if (!isDemoCheckoutEnabled()) {
                return new NextResponse(PAYMENTS_UNAVAILABLE, { status : 503 });
            }
            return NextResponse.json({ url : "/checkout/cart" });
        }

        const order = await getRazorpay().orders.create({
            amount : amount * 100,
            currency : "INR",
            receipt : `cart_${uuidv4()}`.substring(0, 40),
            notes : cartOrderNotes(session.user.id, courseIds)
        });

        return NextResponse.json({
            orderId : order.id,
            amount : order.amount,
            currency : order.currency,
            courseName : `${courseIds.length} ${courseIds.length === 1 ? "course" : "courses"}`,
            courseDescription : "LearnIt course enrollment",
            tutorName : session.user.name,
            tutorEmail : session.user.email,
            keyId : process.env.RAZORPAY_KEY_ID,
        });

    } catch (error) {
        console.error("CART CHECKOUT API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
