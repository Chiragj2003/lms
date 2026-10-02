import * as z from "zod";

export const CourseSchema = z.object({
    title : z.string().trim().min(1, {
        message : "Course title is required"
    }).max(200, {
        message : "Course title is too long"
    })
});

export const ChapterCreateSchema = z.object({
    title : z.string({ error : "Chapter title is required" }).trim().min(1, {
        message : "Chapter title is required"
    }).max(200, {
        message : "Chapter title is too long"
    })
});
