import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET () {
    try {
        
        // See server/course.ts searchCourses for why purchases and ratings are
        // aggregated in subqueries rather than joined directly onto Course.
        const courses:any  = await db.$queryRaw`
           SELECT
                c.id AS id,
                c.title AS title,
                c.price AS price,
                c.image AS image,
                COALESCE(p.total_purchases, 0) AS total_purchases,
                COALESCE(r.total_ratings, 0) AS total_ratings,
                COALESCE(r.average_rating, 0) AS average_rating,
                t.name AS tutor_name
            FROM
                "Course" c
            LEFT JOIN (
                SELECT "courseId", COUNT(*) AS total_purchases
                FROM "Purchase"
                GROUP BY "courseId"
            ) p ON p."courseId" = c.id
            LEFT JOIN (
                SELECT "courseId", COUNT(*) AS total_ratings, AVG(star) AS average_rating
                FROM "Rate"
                GROUP BY "courseId"
            ) r ON r."courseId" = c.id
            LEFT JOIN
                "User" t ON c."tutorId" = t.id
            WHERE
                c."isPublished" = true
            ORDER BY
                total_purchases DESC
            LIMIT 10;`

        const serializedCourses = courses.map((course:any) => ({
            ...course,
            total_purchases: Number(course.total_purchases),
            total_ratings: Number(course.total_ratings),
            average_rating: String(Number(course.average_rating)),
        }));
        
        return NextResponse.json(serializedCourses);

    } catch (error) {
        console.error("BESTSELLER API ERROR", error);
        return new NextResponse("Internal server error", { status: 500});
    }
}