import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request, props: { params: Promise<{ courseId: string }> }) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized attempt", { status: 401 });
        }

        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();

        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return new NextResponse("Invalid payment details", { status: 400 });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return new NextResponse("Invalid signature", { status: 400 });
        }

        // Verify purchase doesn't already exist
        const existingPurchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: params.courseId
                }
            }
        });

        if (!existingPurchase) {
            // Create the purchase
            await db.purchase.create({
                data: {
                    userId: session.user.id,
                    courseId: params.courseId,
                }
            });
        }

        return NextResponse.json({ url: `/course/${params.courseId}/view?paymentId=${uuidv4()}` });

    } catch (error) {
        console.error("COURSE VERIFY API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
