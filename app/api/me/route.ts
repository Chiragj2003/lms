import { NextResponse } from "next/server";

import { auth } from "@/auth";

/** The signed-in user as the app sees it (database id, role, profile), for client components. */
export async function GET() {
    const session = await auth();
    return NextResponse.json(session, {
        headers : { "Cache-Control" : "no-store" },
    });
}
