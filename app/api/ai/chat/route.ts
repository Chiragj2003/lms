import { NextResponse } from "next/server";
import { Ollama } from "ollama";
import * as z from "zod";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { canAccessChapter } from "@/lib/chapter-access";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";

const ChatSchema = z.object({
    chapterId : z.string().min(1),
    prompt : z.string().trim().min(3).max(2000),
});

// Keeps the model context bounded no matter how long a transcript is.
const MAX_TRANSCRIPT_CHARS = 12_000;

/**
 * The AI assistant used to call Ollama straight from the visitor's browser
 * at 127.0.0.1, which only ever worked on the developer's own machine (and is
 * blocked from an https page). It now runs here, against OLLAMA_HOST, and
 * streams the answer back as plain text.
 */
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Sign in to use the AI assistant", { status: 401 });
        }

        const host = process.env.OLLAMA_HOST;
        if (!host) {
            return new NextResponse("The AI assistant isn't configured on this site yet", { status: 503 });
        }

        if (!(await rateLimit(`ai:${session.user.id}`, 10, 60))) {
            return tooManyRequests(60);
        }

        const parsed = ChatSchema.safeParse(await req.json());
        if (!parsed.success) {
            return new NextResponse("Ask a question of at least 3 characters", { status: 400 });
        }

        const { chapterId, prompt } = parsed.data;

        if (!(await canAccessChapter(session.user.id, chapterId))) {
            return new NextResponse("You don't have access to this chapter", { status: 403 });
        }

        // Context comes from the database, not the request, so a client can't
        // feed the model another chapter's transcript.
        const chapter = await db.chapter.findUnique({
            where : { id : chapterId },
            select : { title : true, transcript : true },
        });

        if (!chapter) {
            return new NextResponse("Chapter not found", { status: 404 });
        }

        const ollama = new Ollama({
            host,
            headers : process.env.OLLAMA_API_KEY
                ? { Authorization : `Bearer ${process.env.OLLAMA_API_KEY}` }
                : undefined,
        });

        const transcript = (chapter.transcript ?? "").slice(0, MAX_TRANSCRIPT_CHARS);

        const response = await ollama.chat({
            model : process.env.OLLAMA_MODEL || "qwen2.5-coder:latest",
            stream : true,
            messages : [
                {
                    // Instructions live in the system message, separate from
                    // the learner's text, so a question can't override them.
                    role : "system",
                    content :
                        "You are a helpful tutor for one chapter of an online course. Answer only questions " +
                        "related to this chapter's topic and transcript. If a question is unrelated, politely " +
                        "steer the learner back to the chapter.\n\n" +
                        `Chapter title: ${chapter.title}\n\n` +
                        `Chapter transcript:\n${transcript || "(no transcript available)"}`,
                },
                { role : "user", content : prompt },
            ],
        });

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const part of response) {
                        controller.enqueue(encoder.encode(part.message.content));
                    }
                } catch (error) {
                    console.error("AI CHAT STREAM ERROR", error);
                } finally {
                    controller.close();
                }
            },
            cancel() {
                response.abort();
            },
        });

        return new Response(stream, {
            headers : {
                "Content-Type" : "text/plain; charset=utf-8",
                "Cache-Control" : "no-store",
            },
        });

    } catch (error) {
        console.error("AI CHAT API ERROR", error);
        return new NextResponse("The AI assistant is unavailable right now", { status: 502 });
    }
}
