import * as z from "zod";

// Every field a tutor can edit on a course, and nothing else. Publishing has
// its own endpoint; ownership, purchases, ratings and relations are never
// writable through a course edit.
export const CourseUpdateSchema = z.object({
    title : z.string().trim().min(1).max(200),
    shortDescription : z.string().trim().min(1).max(500),
    description : z.string().max(100_000),
    image : z.string().url().max(2048),
    price : z.number().min(0).max(1_000_000),
    subCategoryId : z.string().min(1),
}).partial().strict();
