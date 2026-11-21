import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isTranscriptionConfigured, transcribeChapter } from "@/lib/transcribe";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";

// Downloading, uploading and transcribing a video can take a few minutes.
export const maxDuration = 300;

/** Tutor-only: (re)generates the chapter's transcript from its video. */
export async function POST(
    req: Request,
    props: { params : Promise<{ courseId : string, chapterId : string }> }
) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized attempt", { status : 401 });
        }

        if (!isTranscriptionConfigured()) {
            return new NextResponse("Transcription isn't set up on this site (GEMINI_API_KEY)", { status : 503 });
        }

        const chapter = await db.chapter.findFirst({
            where : {
                id : params.chapterId,
                courseId : params.courseId,
                course : { tutorId : session.user.id },
            },
            select : { id : true, videoUrl : true },
        });
        if (!chapter) {
            return new NextResponse("Chapter not found", { status : 404 });
        }
        if (!chapter.videoUrl) {
            return new NextResponse("Upload a video first", { status : 400 });
        }

        if (!(await rateLimit(`transcript:${session.user.id}`, 5, 600))) {
            return tooManyRequests(600);
        }

        const transcript = await transcribeChapter(chapter.id);
        return NextResponse.json({ transcript });

    } catch (error) {
        console.error("TRANSCRIPT API ERROR", error);
        return new NextResponse(
            error instanceof Error ? error.message : "Could not transcribe this video",
            { status : 502 }
        );
    }
}
