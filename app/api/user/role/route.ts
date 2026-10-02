import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH (req: Request) {
    try {
        
        const session = await auth();
        if (!session || !session.user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const  { role }: { role: "LEARNER" | "TUTOR" } = await req.json();
        if ( role !== "LEARNER" && role!="TUTOR" ) {
            return new NextResponse("Invalid role", {status: 400});
        }

        // The role is chosen once, during first-time setup (before a profile
        // exists); the setup screen says it can't be changed later. Without
        // this, a direct request could flip an existing account between
        // learner and tutor at any time.
        const existingProfile = await db.profile.findUnique({
            where : { userId : session.user.id },
            select : { id : true }
        });

        if (existingProfile) {
            return new NextResponse("Your account type has already been set", {status: 409});
        }

        await db.user.update({
            where : {
                id : session.user.id
            },
            data : {
                role : role === "LEARNER" ? Role.LEARNER : Role.TUTOR
            }
        });

        // Upsert, not create: a retry (or a double-click) previously hit the
        // unique constraint on userId and failed with a 500, leaving the user
        // stuck on the role picker.
        await db.profile.upsert({
            where  : { userId : session.user.id },
            update : {},
            create : { userId : session.user.id }
        });

        return NextResponse.json({success: true});

    } catch (error) {
        console.log("USER ROLE PATCH API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}