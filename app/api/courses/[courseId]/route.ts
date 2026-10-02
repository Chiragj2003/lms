import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { CourseUpdateSchema } from "@/schemas/course-update.schema";

export async function PATCH(req: Request, props: { params : Promise<{ courseId : string }> }) {
    const params = await props.params;
    try {

        const session = await auth();
        if ( !session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized attempt", {status: 401});
        }
        // The body used to be spread straight into the update, so a course's
        // tutor could write any column or nested relation: create purchases
        // for any user, add ratings in other people's names, reassign tutorId,
        // or flip isPublished past the publish checks.
        const parsed = CourseUpdateSchema.safeParse(await req.json());
        if (!parsed.success) {
            return new NextResponse("Invalid course fields", {status: 400});
        }

        const course = await db.course.findUnique({
            where : { id : params.courseId, tutorId : session.user.id },
            select : { id : true }
        });

        if (!course) {
            return new NextResponse("Course not found", {status: 404});
        }

        if (parsed.data.subCategoryId) {
            const subCategory = await db.subCategory.findUnique({
                where : { id : parsed.data.subCategoryId },
                select : { id : true }
            });
            if (!subCategory) {
                return new NextResponse("Unknown category", {status: 400});
            }
        }

        await db.course.update({
            where : { id : course.id },
            data : parsed.data
        });

        return NextResponse.json({success : true});


    } catch (error) {
        console.error("COURSES POST API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}


export async function DELETE(req: Request, props: { params : Promise<{ courseId : string }> }) {
    const params = await props.params;
    try {

        const session = await auth();
        if ( !session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized attempt", {status: 401});
        }

        await db.course.delete({
            where : {
                id : params.courseId,
                tutorId : session.user.id
            },
        });

        return NextResponse.json({success : true});

        
    } catch (error) {
        console.error("COURSES DELETE API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}