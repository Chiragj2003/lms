import { initEdgeStore } from '@edgestore/server';

// EdgeStore's token service only accepts non-empty strings, so a signed-out
// visitor is represented by an explicit marker rather than null or "".
export type Context = {
    userId: string;
    role: "TUTOR" | "LEARNER" | "ANONYMOUS";
};

const MB = 1024 * 1024;

// Images end up inline in rich text: course and chapter descriptions
// (tutors), notes and Q&A (learners). SVG is excluded because it can carry
// script.
const isImage = (type: string) => type.startsWith("image/") && type !== "image/svg+xml";

// Chapter videos and downloadable chapter resources — tutor uploads only.
const TUTOR_FILE_TYPES = [
    "video/",
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.",
    "application/vnd.ms-excel",
    "application/vnd.ms-powerpoint",
    "text/plain",
];

const es = initEdgeStore.context<Context>().create();

export const edgeStoreRouter = es.router({
    // Previously an open bucket: anyone, signed in or not, could upload any
    // file of any size.
    publicFiles: es
        .fileBucket({ maxSize : 500 * MB })
        .beforeUpload(({ ctx, fileInfo }) => {
            if (ctx.role !== "TUTOR" && ctx.role !== "LEARNER") {
                return false;
            }

            if (isImage(fileInfo.type)) {
                return fileInfo.size <= 10 * MB;
            }

            return ctx.role === "TUTOR"
                && TUTOR_FILE_TYPES.some((allowed) => fileInfo.type.startsWith(allowed));
        }),
});

export type EdgeStoreRouter = typeof edgeStoreRouter;
