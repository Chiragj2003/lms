import { Prisma } from "@prisma/client";

/**
 * True when an update/delete matched no row. Tutor routes scope every write
 * to the course (and chapter/question) in the URL, so this is what a request
 * for someone else's record — or one that doesn't exist — looks like.
 */
export const isRecordNotFound = (error: unknown) =>
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
