import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

import { db } from "@/lib/db";

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
            const payment = event.payload.payment.entity;
            const order = event.payload.order.entity;
            
            const userId = order.notes?.userId;
            const courseId = order.notes?.courseId;

            if (!userId || !courseId) {
                return new NextResponse("Webhook error: Missing metadata", { status: 400 });
            }

            const existingPurchase = await db.purchase.findUnique({
                where: {
                    userId_courseId: {
                        userId,
                        courseId
                    }
                }
            });

            if (!existingPurchase) {
                await db.purchase.create({
                    data: {
                        courseId,
                        userId
                    }
                });
            }
        }

        return new NextResponse(null, { status: 200 });

    } catch (error: any) {
        console.error("RAZORPAY WEBHOOK ERROR", error);
        return new NextResponse(`Webhook Error ${error.message}`, { status: 400 });
    }
}