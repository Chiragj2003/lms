import * as z from "zod";

export const RatingSchema = z.object({
    star : z.number().int().min(1).max(5).optional(),
    comment : z.string().trim().max(2_000, { message : "Review is too long (2000 characters max)" }).optional(),
    courseId: z.string().min(1)
});
