import { NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";

import { auth } from "@/auth";
import { courseIdsFromNotes, purchaseCourses } from "@/lib/cart";
import { getRazorpay, isRazorpayConfigured, isValidPaymentSignature } from "@/lib/razorpay";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!(await rateLimit(`verify:${session.user.id}`, 20, 60))) {
            return tooManyRequests(60);
        }

        if (!isRazorpayConfigured()) {
            return new NextResponse("Payments are not configured", { status: 400 });
        }

        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();

        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return new NextResponse("Invalid payment details", { status: 400 });
        }

        if (!isValidPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
            return new NextResponse("Invalid signature", { status: 400 });
        }

        // The courses come from the order our server created, never from the
        // request body, so a paid order can't be stretched to cover more.
        const order = await getRazorpay().orders.fetch(razorpay_order_id);
        const notes = order.notes as Record<string, unknown> | undefined;

        if (notes?.type !== "cart" || notes?.userId !== session.user.id) {
            return new NextResponse("Payment does not match this cart", { status: 400 });
        }

        const courseIds = courseIdsFromNotes(notes);
        if (courseIds.length === 0) {
            return new NextResponse("Payment has no courses", { status: 400 });
        }

        await purchaseCourses(session.user.id, courseIds);

        return NextResponse.json({ url : "/user/my-learning" });

    } catch (error) {
        console.error("CART VERIFY API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
