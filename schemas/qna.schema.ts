import * as z from "zod";

export const QNASchema = z.object({
    question : z.string().min(1).max(20_000),
    chapterId: z.string().min(1)
});