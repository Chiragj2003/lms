import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

import { courseIdsFromNotes, purchaseCourses } from "@/lib/cart";

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = (await headers()).get("X-Razorpay-Signature") as string;

        if (!signature) {
            return new NextResponse("Webhook error: No signature", { status: 400 });
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET as string)
            .update(body)
            .digest("hex");

        if (expectedSignature !== signature) {
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