import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CourseSchema } from "@/schemas/course.schema";
import { NextResponse } from "next/server";

export async function POST (req: Request) {
    try {
        
        const session = await auth();
        if ( !session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized attempt", {status: 401});
        }

        // The /tutor UI is role-guarded, but this endpoint was not: a learner
        // could POST here directly and create a course.
        if (session.user.role !== "TUTOR") {
            return new NextResponse("Only tutors can create courses", {status: 403});
        }

        const body = await req.json();
        const isValidatedData = await CourseSchema.safeParseAsync(body);

        if (!isValidatedData.success){
            return new NextResponse("Title is required", { status: 401});
        }

        const course = await db.course.create({
            data : {
                tutorId : session.user.id,
                title : isValidatedData.data.title
            }
        });

        return NextResponse.json(course);

    } catch (error) {
        console.error("COURSES POST API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}