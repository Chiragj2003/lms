"use client";

/**
 * Reads a video's real length (in whole seconds) by loading only its
 * metadata in a detached <video> element. Resolves null if the length can't
 * be read within the timeout, so callers can fall back gracefully.
 */
export const readVideoDuration = (url: string, timeoutMs = 15_000) =>
    new Promise<number | null>((resolve) => {
        const video = document.createElement("video");
        let settled = false;

        const finish = (value: number | null) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            video.removeAttribute("src");
            video.load();
            resolve(value);
        };

        const timer = setTimeout(() => finish(null), timeoutMs);

        video.preload = "metadata";
        video.muted = true;
        video.onloadedmetadata = () =>
            finish(Number.isFinite(video.duration) && video.duration > 0 ? Math.round(video.duration) : null);
        video.onerror = () => finish(null);
        video.src = url;
    });
