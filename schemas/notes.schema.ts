import * as z from "zod";

export const NotesSchema = z.object({
    time : z.number().int().min(0).max(86_400),
    note : z.string().min(1).max(20_000)
})

export const NoteUpdateSchema = z.object({
    note : z.string().min(1, { message : "Note can't be empty" }).max(20_000, { message : "Note is too long" })
})
