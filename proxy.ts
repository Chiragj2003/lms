import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Signed-out visitors to account-only pages get a real redirect to /login.
 *
 * The pages already redirect themselves, but they stream, so the browser
 * received a 200 page that bounced client-side. This only checks that a
 * session cookie exists (no database call); the pages and API routes still
 * do the real session and permission checks.
 */
export function proxy(request: NextRequest) {
    if (getSessionCookie(request)) {
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
    matcher : [
        "/user/:path*",
        "/tutor/:path*",
        "/checkout/:path*",
        "/course/:courseId/quiz/:path*",
    ],
};
