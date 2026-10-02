import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isRecordNotFound } from "@/lib/prisma-errors";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";
import { SocialSchema } from "@/schemas/social.schema";
import { NextResponse } from "next/server";

export async function PATCH (req: Request) {
    try {

        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if (!(await rateLimit(`profile:${session.user.id}`, 20, 60))) {
            return tooManyRequests(60);
        }

        const body = await req.json();
        const validatedData = await SocialSchema.safeParseAsync(body);
        if (!validatedData.success) {
            return new NextResponse(validatedData.error.issues[0]?.message || "Invalid links", {status: 400});
        }

        // Store cleared fields as null so the course page hides them.
        const data = Object.fromEntries(
            Object.entries(validatedData.data).map(([key, value]) => [key, value || null])
        );

        await db.profile.update({
            where : { userId : session.user.id },
            data
        });

        return NextResponse.json({success: true});

    } catch (error) {
        if (isRecordNotFound(error)) {
            return new NextResponse("Choose your account role first", {status: 404});
        }
        console.error("PROFILE SOCIAL PATCH API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}
