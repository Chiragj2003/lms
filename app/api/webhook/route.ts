import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

import { courseIdsFromNotes, purchaseCourses } from "@/lib/cart";

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = (await headers()).get("X-Razorpay-Signature");

        if (!signature) {
            return new NextResponse("Webhook error: No signature", { status: 400 });
        }

        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret) {
            console.error("RAZORPAY WEBHOOK: RAZORPAY_WEBHOOK_SECRET is not set");
            return new NextResponse("Webhook not configured", { status: 503 });
        }

        const expected = Buffer.from(
            crypto.createHmac("sha256", secret).update(body).digest("hex")
        );
        const received = Buffer.from(signature);

        // Constant-time comparison: `!==` stops at the first differing
        // character, which leaks how much of a forged signature was right.
        if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
            return new NextResponse("Webhook error: Invalid signature", { status: 400 });
        }

        const event = JSON.parse(body);

        if (event.event === "order.paid") {
            const order = event.payload.order.entity;

            const userId = order.notes?.userId;
            // Single-course orders carry courseId; cart orders carry c0..cN.
            const courseIds: string[] = order.notes?.type === "cart"
                ? courseIdsFromNotes(order.notes)
                : [order.notes?.courseId].filter(Boolean);

            if (!userId || courseIds.length === 0) {
                return new NextResponse("Webhook error: Missing metadata", { status: 400 });
            }

            await purchaseCourses(userId, courseIds);
        }

        return new NextResponse(null, { status: 200 });

    } catch (error: any) {
        console.error("RAZORPAY WEBHOOK ERROR", error);
        return new NextResponse(`Webhook Error ${error.message}`, { status: 400 });
    }
}