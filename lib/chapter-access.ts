import { db } from "@/lib/db";

/**
 * Whether a signed-in user may see a chapter's learning material (Q&A and
 * similar): the course's tutor always, anyone else only if the chapter is a
 * free preview or they've bought the course, and only for published content.
 */
export const canAccessChapter = async (userId: string, chapterId: string) => {
    const chapter = await db.chapter.findUnique({
        where : { id : chapterId },
        select : {
            isFree : true,
            isPublished : true,
            course : { select : { id : true, tutorId : true, isPublished : true } },
        },
    });

    if (!chapter) return false;
    if (chapter.course.tutorId === userId) return true;
    if (!chapter.isPublished || !chapter.course.isPublished) return false;
    if (chapter.isFree) return true;

    const purchase = await db.purchase.findUnique({
        where : { userId_courseId : { userId, courseId : chapter.course.id } },
        select : { id : true },
    });
    return !!purchase;
};
