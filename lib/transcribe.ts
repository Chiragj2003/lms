import "server-only";

import { db } from "@/lib/db";

/**
 * Writes a chapter's transcript from its video with Google Gemini, so a
 * tutor who uploads a plain video still gets a transcript for the AI tutor.
 *
 * Flow: download the video → upload it to the Gemini Files API → wait until
 * Gemini has processed it → ask for a transcript → delete the uploaded copy.
 */

const API = "https://generativelanguage.googleapis.com";
// Gemini accepts files up to 2 GB; this keeps memory use reasonable.
const MAX_BYTES = 300 * 1024 * 1024;

const key = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
    return apiKey;
};

export const isTranscriptionConfigured = () => Boolean(process.env.GEMINI_API_KEY);

type GeminiFile = { name : string; uri : string; mimeType : string; state : string };

const uploadToGemini = async (bytes: ArrayBuffer, mimeType: string): Promise<GeminiFile> => {
    const start = await fetch(`${API}/upload/v1beta/files`, {
        method : "POST",
        headers : {
            "x-goog-api-key" : key(),
            "X-Goog-Upload-Protocol" : "resumable",
            "X-Goog-Upload-Command" : "start",
            "X-Goog-Upload-Header-Content-Length" : String(bytes.byteLength),
            "X-Goog-Upload-Header-Content-Type" : mimeType,
            "Content-Type" : "application/json",
        },
        body : JSON.stringify({ file : { display_name : "chapter-video" } }),
    });
    const uploadUrl = start.headers.get("x-goog-upload-url");
    if (!start.ok || !uploadUrl) {
        throw new Error(`Gemini upload start failed (${start.status})`);
    }

    const done = await fetch(uploadUrl, {
        method : "POST",
        headers : {
            "X-Goog-Upload-Offset" : "0",
            "X-Goog-Upload-Command" : "upload, finalize",
        },
        body : bytes,
    });
    if (!done.ok) {
        throw new Error(`Gemini upload failed (${done.status})`);
    }
    return (await done.json()).file as GeminiFile;
};

const waitUntilActive = async (file: GeminiFile): Promise<GeminiFile> => {
    let current = file;
    for (let i = 0; i < 60 && current.state === "PROCESSING"; i++) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const res = await fetch(`${API}/v1beta/${current.name}`, { headers : { "x-goog-api-key" : key() } });
        if (!res.ok) throw new Error(`Gemini file status failed (${res.status})`);
        current = await res.json();
    }
    if (current.state !== "ACTIVE") {
        throw new Error(`Gemini could not process the video (state ${current.state})`);
    }
    return current;
};

const TRANSCRIBE_PROMPT =
    "Transcribe everything spoken in this video, word for word, in the language spoken. " +
    "Use plain paragraphs, no timestamps, no speaker labels, no commentary. " +
    "If nothing is spoken, describe in a few sentences what the video shows and teaches.";

const NOTES_PROMPT =
    "Write detailed study notes, in your own words, of everything this video teaches: the topics " +
    "in order, key definitions, examples and any code shown. Plain paragraphs and short lists. " +
    "Don't quote the video.";

/** One Gemini answer about an uploaded video; "" when it returns nothing (e.g. filtered). */
const askAboutVideo = async (file: GeminiFile, prompt: string): Promise<string> => {
    const model = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";
    const res = await fetch(`${API}/v1beta/models/${model}:generateContent`, {
        method : "POST",
        headers : { "Content-Type" : "application/json", "x-goog-api-key" : key() },
        body : JSON.stringify({
            contents : [{
                role : "user",
                parts : [
                    { file_data : { mime_type : file.mimeType, file_uri : file.uri } },
                    { text : prompt },
                ],
            }],
        }),
        signal : AbortSignal.timeout(180_000),
    });
    if (!res.ok) {
        throw new Error(`Gemini transcription failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
    }
    const data = await res.json();
    const parts: { text?: string }[] = data?.candidates?.[0]?.content?.parts ?? [];
    return parts.map((part) => part.text ?? "").join("").trim();
};

/** Transcript text for a video at a public URL. */
export const transcribeVideo = async (videoUrl: string): Promise<string> => {
    const video = await fetch(videoUrl);
    if (!video.ok) throw new Error(`Could not download the video (${video.status})`);

    const length = Number(video.headers.get("content-length") || 0);
    if (length > MAX_BYTES) throw new Error("The video is too large to transcribe (over 300 MB)");

    const bytes = await video.arrayBuffer();
    if (bytes.byteLength > MAX_BYTES) throw new Error("The video is too large to transcribe (over 300 MB)");

    const mimeType = video.headers.get("content-type")?.split(";")[0] || "video/mp4";
    const file = await waitUntilActive(await uploadToGemini(bytes, mimeType));

    try {
        const transcript = await askAboutVideo(file, TRANSCRIBE_PROMPT);
        if (transcript) return transcript;
        // Gemini won't write out a transcript that matches a published video
        // (its recitation filter); study notes in its own words still give
        // the AI tutor what the chapter teaches.
        const notes = await askAboutVideo(file, NOTES_PROMPT);
        if (notes) return notes;
        throw new Error("Gemini couldn't transcribe this video");
    } finally {
        // The uploaded copy expires on its own after 48 hours; this just tidies up.
        await fetch(`${API}/v1beta/${file.name}`, { method : "DELETE", headers : { "x-goog-api-key" : key() } }).catch(() => {});
    }
};

/** Transcribes a chapter's current video and saves it. Returns the transcript. */
export const transcribeChapter = async (chapterId: string): Promise<string> => {
    const chapter = await db.chapter.findUnique({ where : { id : chapterId }, select : { videoUrl : true } });
    if (!chapter?.videoUrl) throw new Error("This chapter has no video yet");

    const transcript = await transcribeVideo(chapter.videoUrl);

    // Only save if the video hasn't been replaced while we were transcribing.
    await db.chapter.updateMany({
        where : { id : chapterId, videoUrl : chapter.videoUrl },
        data : { transcript },
    });
    return transcript;
};
