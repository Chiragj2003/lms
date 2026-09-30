import { auth } from "@/auth";
import { purchaseCourses } from "@/lib/cart";
import { getRazorpay, isRazorpayConfigured, isValidPaymentSignature } from "@/lib/razorpay";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request, props: { params: Promise<{ courseId: string }> }) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized attempt", { status: 401 });
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

        // A valid signature only proves *some* order was paid. Without checking
        // what the order was for, a payment for the cheapest course could be
        // replayed against any other course's verify URL.
        const order = await getRazorpay().orders.fetch(razorpay_order_id);

        if (order.notes?.courseId !== params.courseId || order.notes?.userId !== session.user.id) {
            return new NextResponse("Payment does not match this course", { status: 400 });
        }

        await purchaseCourses(session.user.id, [params.courseId]);

        return NextResponse.json({ url: `/course/${params.courseId}/view?paymentId=${uuidv4()}` });

    } catch (error) {
        console.error("COURSE VERIFY API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
