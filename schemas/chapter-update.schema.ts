import * as z from "zod";

// Every field a tutor can edit on a chapter. Publishing has its own endpoint;
// the owning course, position and relations (progress, notes, quiz) are never
// writable through a chapter edit.
export const ChapterUpdateSchema = z.object({
    title : z.string().trim().min(1).max(200),
    description : z.string().max(100_000),
    videoUrl : z.string().url().max(2048),
    isFree : z.boolean(),
    duration : z.number().int().min(0).max(24 * 60 * 60),
    transcript : z.string().max(200_000),
}).partial().strict();
