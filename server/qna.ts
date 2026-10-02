import { db } from "@/lib/db";

const PAGE_SIZE = 50;

/**
 * Learners' questions on a tutor's courses, unanswered first, then newest.
 */
export const getTutorQuestions = async (tutorId: string, filter: "unanswered" | "all") => {
    const where = {
        chapter : { course : { tutorId } },
        ...(filter === "unanswered" ? { solution : { is : null } } : {}),
    };

    const [questions, unansweredCount] = await Promise.all([
        db.qNA.findMany({
            where,
            orderBy : { createdAt : "desc" },
            take : PAGE_SIZE,
            include : {
                solution : true,
                user : { select : { name : true, image : true } },
                chapter : {
                    select : {
                        id : true,
                        title : true,
                        course : { select : { id : true, title : true } },
                    },
                },
            },
        }),
        db.qNA.count({
            where : { chapter : { course : { tutorId } }, solution : { is : null } },
        }),
    ]);

    // Unanswered first, keeping newest-first within each group.
    questions.sort((a, b) => Number(!!a.solution) - Number(!!b.solution));

    return { questions, unansweredCount, pageSize : PAGE_SIZE };
};
