import { NextResponse } from "next/server";
import * as z from "zod";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { canAccessChapter } from "@/lib/chapter-access";
import { richTextToPlain } from "@/lib/rich-text-plain";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";

const ChatSchema = z.object({
    chapterId : z.string().min(1),
    prompt : z.string().trim().min(3).max(2000),
});

// Keeps the model context bounded no matter how long a transcript is.
const MAX_TRANSCRIPT_CHARS = 12_000;

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models";

/** Yields the text of each chunk in a Gemini streamGenerateContent (SSE) response. */
async function* geminiText(body: ReadableStream<Uint8Array>) {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream : true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            try {
                const chunk = JSON.parse(line.slice(5));
                const parts: { text?: string }[] = chunk?.candidates?.[0]?.content?.parts ?? [];
                const text = parts.map((part) => part.text ?? "").join("");
                if (text) yield text;
            } catch {
                // A partial or non-JSON line: skip it.
            }
        }
    }
}

/**
 * The AI assistant runs on the server with Google Gemini (GEMINI_API_KEY),
 * so the key never reaches the browser, and streams the answer back as
 * plain text.
 */
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Sign in to use the AI assistant", { status: 401 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
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
            select : {
                title : true,
                description : true,
                transcript : true,
                course : { select : { title : true, shortDescription : true, description : true } },
            },
        });

        if (!chapter) {
            return new NextResponse("Chapter not found", { status: 404 });
        }

        const transcript = (chapter.transcript ?? "").slice(0, MAX_TRANSCRIPT_CHARS);
        const chapterDescription = richTextToPlain(chapter.description).slice(0, 4000);
        const courseDescription = richTextToPlain(chapter.course.description).slice(0, 4000);
        const model = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";

        const upstream = await fetch(`${GEMINI_URL}/${model}:streamGenerateContent?alt=sse`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "x-goog-api-key" : apiKey,
            },
            // Gives up on a model that never answers instead of hanging the request.
            signal : AbortSignal.any([req.signal, AbortSignal.timeout(60_000)]),
            body : JSON.stringify({
                // Instructions live in the system instruction, separate from
                // the learner's text, so a question can't override them.
                systemInstruction : {
                    parts : [{
                        text : [
                            `You are the friendly AI tutor inside the online course "${chapter.course.title}".`,
                            `The learner is on the chapter "${chapter.title}".`,
                            "Help them understand this chapter, the course and the subject it teaches. Use the",
                            "transcript and descriptions below when they cover the question; otherwise answer from",
                            "your own knowledge of the subject. If asked about the course itself, summarise it from",
                            "the course details. Only decline questions that have nothing to do with learning this",
                            "subject, and then suggest a related question instead. Never say you can only use the",
                            "transcript. Keep answers clear and concise, use Markdown, and include short code",
                            "examples when they help.",
                            "",
                            `Course summary: ${chapter.course.shortDescription || "(none)"}`,
                            `Course description:\n${courseDescription || "(none)"}`,
                            `Chapter description:\n${chapterDescription || "(none)"}`,
                            `Chapter transcript:\n${transcript || "(no transcript for this chapter)"}`,
                        ].join("\n"),
                    }],
                },
                contents : [{ role : "user", parts : [{ text : prompt }] }],
            }),
        });

        if (!upstream.ok || !upstream.body) {
            console.error("AI CHAT GEMINI ERROR", upstream.status, await upstream.text().catch(() => ""));
            return new NextResponse("The AI assistant is unavailable right now", { status: 502 });
        }

        const encoder = new TextEncoder();
        const body = upstream.body;
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const text of geminiText(body)) {
                        controller.enqueue(encoder.encode(text));
                    }
                } catch (error) {
                    console.error("AI CHAT STREAM ERROR", error);
                } finally {
                    controller.close();
                }
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
