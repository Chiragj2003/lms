// Data loaders take ids from their (server) callers. "use server" would
// expose them as public endpoints if a client ever imported one; this
// makes that a build error instead.
import "server-only";

import { db } from "@/lib/db";


export const getUserProgressCount = async (userId: string, courseId: string) => {
    try {   
        
        // Both counts in parallel; the completed count filters by relation
        // instead of first fetching every chapter id.
        const [publishedCount, validCompletedChapters] = await Promise.all([
            db.chapter.count({
                where : { courseId, isPublished : true }
            }),
            db.userProgress.count({
                where : {
                    userId,
                    isCompleted : true,
                    chapter : { courseId, isPublished : true }
                }
            }),
        ]);

        if (publishedCount === 0) return 0;

        const progressPercentage = (validCompletedChapters/publishedCount)*100;

        return progressPercentage;
    } catch (error) {
        console.error(error);
        return 0;
    }
}