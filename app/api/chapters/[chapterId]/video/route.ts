import { auth } from "@/auth";
import { db } from "@/lib/db";
import { canAccessChapter } from "@/lib/chapter-access";

export const dynamic = "force-dynamic";

// Each response carries at most this much video. The browser asks for the
// next part as playback continues, so a single request never has to stay open
// for a whole video (serverless functions have a time limit).
const CHUNK_BYTES = 4 * 1024 * 1024;

const parseRange = (header: string | null) => {
    const match = header?.match(/^bytes=(\d+)-(\d*)$/);
    if (!match) return { start : 0, end : CHUNK_BYTES - 1 };
    const start = Number(match[1]);
    const requestedEnd = match[2] ? Number(match[2]) : Infinity;
    return { start, end : Math.min(requestedEnd, start + CHUNK_BYTES - 1) };
};

/**
 * Streams a chapter's video after checking the viewer may watch it.
 *
 * The player used to receive the storage URL itself. Those files are public,
 * so once a learner had the link it worked for anyone, forever. The link now
 * stays on the server and every request is checked.
 */
export async function GET(req: Request, props: { params: Promise<{ chapterId: string }> }) {
    const { chapterId } = await props.params;
    try {
        const chapter = await db.chapter.findUnique({
            where : { id : chapterId },
            select : {
                videoUrl : true,
                isFree : true,
                isPublished : true,
                course : { select : { isPublished : true } },
            },
        });

        if (!chapter?.videoUrl) {
            return new Response("Not found", { status : 404 });
        }

        // A published free preview can be watched by anyone; everything else
        // needs a signed-in user who owns the course or teaches it.
        const isOpenPreview = chapter.isFree && chapter.isPublished && chapter.course.isPublished;
        if (!isOpenPreview) {
            const session = await auth();
            if (!session?.user?.id || !(await canAccessChapter(session.user.id, chapterId))) {
                return new Response("Forbidden", { status : 403 });
            }
        }

        const { start, end } = parseRange(req.headers.get("range"));

        const upstream = await fetch(chapter.videoUrl, {
            headers : { Range : `bytes=${start}-${end}` },
            signal : req.signal,
        });

        if (upstream.status === 416) {
            return new Response(null, { status : 416, headers : { "Content-Range" : upstream.headers.get("Content-Range") ?? "" } });
        }

        if (!upstream.ok || !upstream.body) {
            console.error("CHAPTER VIDEO UPSTREAM ERROR", upstream.status);
            return new Response("Video unavailable", { status : 502 });
        }

        const headers = new Headers({
            "Content-Type" : upstream.headers.get("Content-Type") ?? "video/mp4",
            "Accept-Ranges" : "bytes",
            // Per-user access: never cache in shared caches.
            "Cache-Control" : "private, max-age=3600",
            "X-Content-Type-Options" : "nosniff",
        });
        for (const name of ["Content-Length", "Content-Range"]) {
            const value = upstream.headers.get(name);
            if (value) headers.set(name, value);
        }

        return new Response(upstream.body, { status : upstream.status, headers });

    } catch (error) {
        if ((error as Error)?.name === "AbortError") {
            return new Response(null, { status : 499 });
        }
        console.error("CHAPTER VIDEO API ERROR", error);
        return new Response("Internal server error", { status : 500 });
    }
}
