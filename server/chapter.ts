// Data loaders take ids from their (server) callers. "use server" would
// expose them as public endpoints if a client ever imported one; this
// makes that a build error instead.
import "server-only";

import { db } from "@/lib/db";
import { Cerificate, Chapter } from "@prisma/client";

// Tutor editor: only the course's own tutor may load a chapter. Without the
// tutor check, any tutor could open another tutor's draft chapter (video,
// transcript, attachments) by putting its ids in the URL.
export const getChapterById = async(chapterId: string, courseId: string, tutorId: string)=>{
    try {
        
        const chapter = await db.chapter.findUnique({
            where : {
                id : chapterId,
                courseId: courseId,
                course : { tutorId }
            },
            include : {
                attachments: true,
                quiz : true
            }
        });

        return chapter;

    } catch (error) {
        return null;
    }
}

interface GetChapterProps {
    userId: string;
    courseId: string;
    chapterId : string;
}

export const getChapter = async({
    chapterId,
    courseId,
    userId
} : GetChapterProps)=> {
    try {
        
        const purchase = await db.purchase.findUnique({
            where : {
                userId_courseId : {
                    userId,
                    courseId
                }
            }
        });

        const course = await db.course.findUnique({
            where : {
                    isPublished : true,
                    id : courseId
            },
            select : {
                price : true,
                image : true,
                _count : {
                    select : {
                        purchases : true,
                        ratings : true
                    }
                },
                shortDescription : true,
                updatedAt : true,
                tutor : {
                    select : {
                        name : true,
                        image : true,
                        profile : {
                            select : {
                                description : true,
                                headline : true,
                                facebookLink : true,
                                githubLink : true,
                                websiteLink : true,
                                linkedinLink : true,
                                twitterLink : true,
                                youtubeLink : true
                            }
                        }
                    }
                }
            }
        });

        // Scoped to courseId: the purchase check above is for courseId, so an
        // unscoped lookup let an owner of any course open another course's
        // paid chapter by putting its id in the URL.
        const chapter = await db.chapter.findUnique({
            where : {
                id: chapterId,
                courseId,
                isPublished :true
            },
            include : {
                attachments : true,
                notes : {
                    where : {
                        userId
                    },
                    orderBy : {
                        time : "asc"
                    }
                },
                quiz : {
                    where : {
                        isPublished : true
                    },
                    select : {
                        id : true,
                        result : {
                            where : {
                                userId
                            }
                        }
                    },
                }
            }
        });

        let certificate : Cerificate|null = null;
        let nextChapter : Chapter|null = null;

        if (!chapter || !course) {
            throw new Error("Chapter or course not found");
        }

        if (purchase) {
            certificate = await db.cerificate.findUnique({
                where : {
                    userId_courseId : {
                        userId,
                        courseId
                    }
                }
            })
        }

        if (chapter.isFree || purchase) {
            nextChapter = await db.chapter.findFirst({
                where : {
                    courseId,
                    isPublished : true,
                    position : {
                        gt : chapter.position
                    }
                },
                orderBy : {
                    position : "asc"
                }
            });
        }

        const userProgress = await db.userProgress.findUnique({
            where : {
                userId_chapterId : {
                    userId,
                    chapterId
                }
            }
        });

        // Whatever is returned here ends up in the page payload, so paid
        // material must never leave the server for a locked chapter — hiding
        // the player in the UI still shipped the direct video URL.
        // The storage URL is never sent at all: the player streams through
        // /api/chapters/[chapterId]/video, which checks access per request.
        const isLocked = !chapter.isFree && !purchase;
        const visibleChapter = isLocked
            ? { ...chapter, videoUrl : null, transcript : null, attachments : [] }
            : { ...chapter, videoUrl : null };

        return  {
            chapter : visibleChapter,
            course,
            nextChapter,
            userProgress,
            purchase,
            certificate
        }

    } catch (error) {
        return  {
            chapter : null,
            course : null,
            nextChapter : null,
            userProgress: null,
            purchase : null,
        }
    }
}


export const getQuiz = async(courseId: string, userId: string, chapterId: string)=>{
    try {
        
        const course = await db.course.findUnique({
            where : {
                id : courseId,
                tutorId : userId
            },
            select : {
                id : true
            }
        });

        if (!course) {
            return null;
        }

        // Scoped to the course checked above: looking the quiz up by chapter
        // alone let a tutor load any other course's quiz, answers included.
        const quiz = await db.quiz.findFirst({
            where : {
                chapterId,
                chapter : { courseId }
            },
            include : {
                questions : {
                    include : {
                        options : {
                            orderBy : {
                                createdAt : "asc"
                            }
                        }
                    },
                    orderBy : {
                        position : "asc"
                    }
                }
            }
        });

        return quiz;

    } catch (error) {
        return null 
    }
}