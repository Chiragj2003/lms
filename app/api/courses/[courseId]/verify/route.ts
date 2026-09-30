import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request, props: { params: Promise<{ courseId: string }> }) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized attempt", { status: 401 });
        }

        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keyId || !keySecret) {
            return new NextResponse("Payments are not configured", { status: 400 });
        }

        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();

        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return new NextResponse("Invalid payment details", { status: 400 });
        }

        const expectedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const expected = Buffer.from(expectedSignature);
        const received = Buffer.from(String(razorpay_signature));
        if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
            return new NextResponse("Invalid signature", { status: 400 });
        }

        // A valid signature only proves *some* order was paid. Without checking
        // what the order was for, a payment for the cheapest course could be
        // replayed against any other course's verify URL.
        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const order = await razorpay.orders.fetch(razorpay_order_id);

        if (order.notes?.courseId !== params.courseId || order.notes?.userId !== session.user.id) {
            return new NextResponse("Payment does not match this course", { status: 400 });
        }

        await db.purchase.upsert({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: params.courseId
                }
            },
            update: {},
            create: {
                userId: session.user.id,
                courseId: params.courseId,
            }
        });

        return NextResponse.json({ url: `/course/${params.courseId}/view?paymentId=${uuidv4()}` });

    } catch (error) {
        console.error("COURSE VERIFY API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
