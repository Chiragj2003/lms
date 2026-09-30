import { NextResponse } from "next/server";
import * as z from "zod";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getCartCourseIds } from "@/lib/cart";
import { getCourseCardsByIds } from "@/server/course";

const cartResponse = async (userId: string) =>
    NextResponse.json(await getCourseCardsByIds(await getCartCourseIds(userId)));

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        return cartResponse(session.user.id);

    } catch (error) {
        console.error("CART GET API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}

const AddSchema = z.object({
    courseIds : z.array(z.string().min(1)).max(50)
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (session.user.role === "TUTOR") {
            return new NextResponse("Tutors cannot purchase courses", { status: 403 });
        }

        const parsed = AddSchema.safeParse(await req.json());
        if (!parsed.success) {
            return new NextResponse("Invalid cart items", { status: 400 });
        }

        const courses = await db.course.findMany({
            where : { id : { in : parsed.data.courseIds }, isPublished : true },
            select : { id : true }
        });

        await db.cartItems.createMany({
            data : courses.map((course) => ({ userId : session.user.id, courseId : course.id })),
            skipDuplicates : true
        });

        return cartResponse(session.user.id);

    } catch (error) {
        console.error("CART POST API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseId = new URL(req.url).searchParams.get("courseId");
        if (!courseId) {
            return new NextResponse("courseId is required", { status: 400 });
        }

        await db.cartItems.deleteMany({
            where : { userId : session.user.id, courseId }
        });

        return cartResponse(session.user.id);

    } catch (error) {
        console.error("CART DELETE API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
