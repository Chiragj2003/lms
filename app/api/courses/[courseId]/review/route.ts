import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const DEFAULT_TAKE = 10;
const MAX_TAKE = 50;

/**
 * A course's reviews, newest first, one page at a time. It used to return
 * every review in one response, oldest first.
 *
 *   ?take=10            page size (max 50)
 *   ?cursor=<reviewId>  continue after this review (from nextCursor)
 */
export async function GET(req: Request, props: { params: Promise<{ courseId: string }> }) {
    const params = await props.params;
    try {
        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const take = Math.min(Math.max(Number(searchParams.get("take")) || DEFAULT_TAKE, 1), MAX_TAKE);

        const course = await db.course.findUnique({
            where : { id : params.courseId, isPublished : true },
            select : { id : true }
        });
        if (!course) {
            return new NextResponse("Course not found", {status : 404});
        }

        // One extra row tells us whether another page exists.
        const rows = await db.rate.findMany({
            where : {
                courseId : params.courseId,
                star : { not : null }
            },
            include : {
                user : {
                    select : {
                        name : true,
                        id : true,
                        image : true
                    }
                }
            },
            orderBy : [{ createdAt : "desc" }, { id : "desc" }],
            take : take + 1,
            ...(cursor ? { cursor : { id : cursor }, skip : 1 } : {}),
        });

        const items = rows.slice(0, take);
        const nextCursor = rows.length > take ? items[items.length - 1].id : null;

        return NextResponse.json({ items, nextCursor });

    } catch (error) {
        console.error("COURSE REVIEWS GET API ERROR", error);
        return new NextResponse("Internal server error", {status : 500});
    }
}
