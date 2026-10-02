import * as z from "zod";

export const AnswerSchema = z.object({
    answer : z.string().trim().min(1, { message : "Write an answer first" }).max(10_000, { message : "Answer is too long" }),
}).strict();
