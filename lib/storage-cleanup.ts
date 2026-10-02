import "server-only";

import { initEdgeStoreClient } from "@edgestore/server/core";

import { db } from "@/lib/db";
import { edgeStoreRouter } from "@/lib/edgestore-router";

const isEdgeStoreUrl = (url: string) => {
    try {
        return new URL(url).hostname === "files.edgestore.dev";
    } catch {
        return false;
    }
};

/**
 * Deletes uploaded files that nothing points to any more.
 *
 * Replacing a chapter video, changing a resource link, or deleting a chapter
 * or course left the old files in storage forever. Call this after the
 * database change, with the URLs that were removed. A file is only deleted
 * when no chapter or resource still uses it (the demo data, for one, shares a
 * single video across many chapters). Never throws: a failed cleanup must not
 * fail the user's action.
 */
export const deleteUnusedUploads = async (urls: (string | null | undefined)[]) => {
    if (!process.env.EDGE_STORE_ACCESS_KEY || !process.env.EDGE_STORE_SECRET_KEY) {
        return;
    }

    const candidates = [...new Set(urls.filter((url): url is string => !!url && isEdgeStoreUrl(url)))];
    if (candidates.length === 0) {
        return;
    }

    try {
        const [chapters, attachments] = await Promise.all([
            db.chapter.findMany({ where : { videoUrl : { in : candidates } }, select : { videoUrl : true } }),
            db.attachment.findMany({ where : { url : { in : candidates } }, select : { url : true } }),
        ]);
        const stillUsed = new Set([...chapters.map((c) => c.videoUrl), ...attachments.map((a) => a.url)]);
        const unused = candidates.filter((url) => !stillUsed.has(url));
        if (unused.length === 0) {
            return;
        }

        const storage = initEdgeStoreClient({ router : edgeStoreRouter });
        const results = await Promise.allSettled(
            unused.map((url) => storage.publicFiles.deleteFile({ url }))
        );
        results.forEach((result, i) => {
            if (result.status === "rejected" || !result.value.success) {
                console.error("STORAGE CLEANUP: could not delete", unused[i],
                    result.status === "rejected" ? result.reason : "(not found or already deleted)");
            }
        });
    } catch (error) {
        console.error("STORAGE CLEANUP ERROR", error);
    }
};
