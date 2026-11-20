import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Clerk runs on every request so `auth()` works in pages and API routes.
 * Signed-out visitors to account-only pages are sent to /login; the pages
 * and API routes still do their own role and ownership checks.
 */
const isAccountPage = createRouteMatcher([
    "/user(.*)",
    "/tutor(.*)",
    "/checkout(.*)",
    "/course/:courseId/quiz(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
    if (isAccountPage(request)) {
        await auth.protect();
    }
});

export const config = {
    matcher : [
        // Skip Next.js internals and static files
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|avif|mp4|lottie)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
