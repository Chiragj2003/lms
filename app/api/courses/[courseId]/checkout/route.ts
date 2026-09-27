import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request, props: { params : Promise<{ courseId : string }> }) {
    const params = await props.params;
    try {
        const session = await auth();
        if ( !session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized attempt", {status: 401});
        }

        if (session.user.role === "TUTOR") {
            return new NextResponse("Tutors cannot purchase courses", {status: 403});
        }

        const { coupon }  = await req.json();

        let discount = 0;

        const course =  await db.course.findUnique({
            where : {
                id : params.courseId,
                isPublished : true
            }
        });

        const purchase = await db.purchase.findUnique({
            where : {
                userId_courseId : {
                    userId : session.user.id,
                    courseId : params.courseId
                },
            }
        });

        if (purchase) {
            return new NextResponse("Already purchased", {status: 400});
        }

        if (!course) {
            return new NextResponse("Course not found", {status: 400});
        }

        if (coupon){
            const verifyCoupon = await db.coupon.findUnique({
                where : {
                    courseId_coupon : {
                        courseId : params.courseId,
                        coupon
                    }
                },
            });

            if (verifyCoupon && verifyCoupon.expires > new Date() ) {
                discount = verifyCoupon.discount
            }
        }

        const amount = Math.floor(course.price! - ((course.price! * discount) / 100));

        // If the course is free or fully discounted, bypass payment
        if (amount <= 0) {
            await db.purchase.create({
                data: {
                    userId: session.user.id,
                    courseId: course.id,
                }
            });
            return NextResponse.json({ url: `/course/${course.id}/view?paymentId=${uuidv4()}` });
        }

        // Initialize Razorpay
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.warn("Razorpay keys missing. Mocking success URL.");
            return NextResponse.json({ url: `/checkout/${course.id}?amount=${amount}${coupon ? `&coupon=${encodeURIComponent(coupon)}` : ""}` });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_${uuidv4()}`.substring(0, 40),
            notes: {
                courseId: course.id,
                userId: session.user.id,
            }
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            orderId: order.id,
            amount: options.amount,
            currency: options.currency,
            courseName: course.title,
            courseDescription: course.shortDescription || "Course Enrollment",
            tutorName: session.user.name,
            tutorEmail: session.user.email,
            keyId: process.env.RAZORPAY_KEY_ID,
        });

    } catch (error) {
        console.error("COURSE CHECKOUT API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}