import { auth } from "@/auth";
import { db } from "@/lib/db";
import { RatingSchema } from "@/schemas/rating.schema";
import { NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";


export async function PUT( req: Request ) {
    try {

        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", {status: 400});
        }

        if (!(await rateLimit(`rating:${session.user.id}`, 10, 60))) {
            return tooManyRequests(60);
        }

        const body = await req.json();
        const validatedData = await RatingSchema.safeParseAsync(body);

        if (!validatedData.success) {
            return new NextResponse("Invalid fields", {status: 400});
        }

        const data = validatedData.data;

        // Ratings are scoped to enrolled learners: without this, a course can
        // show reviews from people who never purchased it, alongside a
        // students-enrolled count of zero.
        const purchase = await db.purchase.findUnique({
            where : {
                userId_courseId : {
                    userId : session.user.id,
                    courseId : data.courseId
                }
            }
        });

        if (!purchase) {
            return new NextResponse("You must purchase this course before leaving a review", {status: 403});
        }

        const rating =  await db.rate.upsert({
            where : {
                userId_courseId : {
                    userId : session.user.id,
                    courseId : data.courseId
                }
            },
            create : {
                userId : session.user.id,
                courseId : data.courseId,
                comment : data.comment,
                star : data.star
            },
            update : {
                comment : data.comment,
                star : data.star
            }
        });

        return NextResponse.json(rating);
        
    } catch (error) {
        console.log("USER RATING PUT API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}