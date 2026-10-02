// Data loaders take ids from their (server) callers. "use server" would
// expose them as public endpoints if a client ever imported one; this
// makes that a build error instead.
import "server-only";

import { db } from "@/lib/db";


export const getUserProgressCount = async (userId: string, courseId: string) => {
    try {   
        
        const publishedChapters = await db.chapter.findMany({
            where : {
                courseId,
                isPublished : true,
            },
            select : {
                id : true
            }
        });

        const publishedChapterIds = publishedChapters.map((chapters)=>chapters.id);

        const validCompletedChapters = await db.userProgress.count({
            where : {
                userId,
                chapterId : {
                    in : publishedChapterIds
                },
                isCompleted : true
            }
        });

        const progressPercentage = (validCompletedChapters/publishedChapterIds.length)*100;

        return progressPercentage;
    } catch (error) {
        console.error(error);
        return 0;
    }
}