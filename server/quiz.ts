// Data loaders take ids from their (server) callers. "use server" would
// expose them as public endpoints if a client ever imported one; this
// makes that a build error instead.
import "server-only";

import { db } from "@/lib/db";

export const getQuizById = async(courseId: string, quizId: string, userId: string)=>{
    try {
        const isPurchased = await db.purchase.findUnique({
            where : {
                userId_courseId : {
                    userId,
                    courseId
                }
            }
        });

        if (!isPurchased) {
            return null;
        }

        // Scoped to the course the purchase was checked against: an unscoped
        // lookup let an owner of one course open any other course's quiz by
        // putting its id in the URL. Drafts stay hidden.
        const quiz = await db.quiz.findFirst({
            where : {
                id: quizId,
                isPublished : true,
                chapter : {
                    courseId,
                    isPublished : true
                }
            },
            include : {
                questions : {
                    include : {
                        options : true
                    },
                    orderBy : {
                        position : "asc"
                    }
                },
                _count : {
                    select : {
                        questions : true
                    }
                },
                result : {
                    where : {
                        userId
                    }
                }
            }
        });

        if (!quiz) {
            return null;
        }

        // Everything returned here is serialised into the quiz page, so the
        // correct answers were readable in the page source before submitting.
        // They're only needed afterwards, on the result page.
        if (quiz.result.length === 0) {
            return {
                ...quiz,
                questions : quiz.questions.map((question) => ({
                    ...question,
                    options : question.options.map((option) => ({ ...option, isCorrect : false })),
                })),
            };
        }

        return quiz;

    } catch (error) {
        console.error("QUIZ SERVER API ERROR");
        return null;
    }
}