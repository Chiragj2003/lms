"use server";

import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { Course } from "@/types";

export const getCourseById = async(id: string)=> {
    try {
        
        const course = await db.course.findUnique({
            where : {
                id
            },
            include : {
                chapters : {
                    orderBy : {
                        position : "asc" 
                    }
                },
                subCategory : {
                    include : {
                        category : true
                    }
                },
                coupons : {
                    orderBy : {
                        createdAt : "asc"
                    }
                }
            }
        });

        return course;

    } catch (error) {
        return null;
    }
}

// Chapter lists (course page, player sidebar) are rendered by client
// components, so every field on each row ships to the browser. The video URL
// and transcript are paid material and are served only by getChapter, which
// checks the purchase first.
const withoutPaidMedia = <T extends { videoUrl: string | null; transcript: string | null }>(chapters: T[]): T[] =>
    chapters.map((chapter) => ({ ...chapter, videoUrl : null, transcript : null }));

export const getCourseByPublicId = async(id: string)=> {
    try {


        const [course, avgRating] = await Promise.all([
            (
                db.course.findUnique({
                    where : {
                        id
                    },
                    include : {
                        chapters : {
                            where : {
                                isPublished : true
                            },
                            orderBy : {
                                position : "asc" 
                            },
                            include : {
                                _count : {
                                    select : {
                                        attachments : true
                                    }
                                }
                            }
                        },
                        subCategory : {
                            include : {
                                category : true
                            }
                        },
                        tutor : {
                            select : {
                                id : true,
                                name : true,
                                image : true,
                                profile : {
                                    select : {
                                        description : true,
                                        headline: true
                                    }
                                },
                                _count :{
                                    select : {
                                        courses : true
                                    }
                                },
                                courses : {
                                    select : {
                                        _count : {
                                            select : {
                                                ratings : true,
                                                purchases : true
                                            }
                                        },
                                    },
                                }
                            }
                        },
                        _count : {
                            select : {
                                purchases : true,
                                ratings : true,
                            }
                        },
                        ratings : {
                            orderBy : {
                                createdAt : "desc"
                            },
                            include : {
                                user : {
                                    select : {
                                        name: true,
                                        image: true
                                    }
                                }
                            },
                            take: 6
                        }
                    }
                })
            ),
            (
                db.rate.aggregate({
                    where: {
                        courseId: id,
                    },
                    _avg: {
                        star: true,
                    },
                })
            )
        ])

        if (course) {
            course.chapters = withoutPaidMedia(course.chapters);
        }

        return {course, avgRating};

    } catch (error) {
        return {
            course: null,
            avgRating: null
        };
    }
}

export const getCourseAndProgress = async(id: string, userId: string)=> {
    try {
        
        const course = await db.course.findUnique({
            where : {
                id
            },
            include : {
                chapters : {
                    where : {
                        isPublished : true
                    },
                    include : {
                        userProgress : {
                            where : {
                                userId
                            }
                        }
                    },
                    orderBy : {
                        position : "asc"
                    }
                },
            }
        });

        if (course) {
            course.chapters = withoutPaidMedia(course.chapters);
        }

        return course;

    } catch (error) {
        return null;
    }
}

export const getCoursesByTutorId = async (tutorId: string) => {
    try {
        
        const courses = await db.course.findMany({
            where : {
                tutorId
            },
            orderBy : {
                createdAt :"desc"
            }
        });

        return courses

    } catch (error) {
        return [];
    }
}

export const getUserCourses = async(userId: string)=> {
    try {
        
        const courses = await db.purchase.findMany({
            where : {
                userId
            },
            include : {
                course : {
                    include : {
                        ratings : {
                            where : {
                                userId
                            }
                        }
                    }
                }
            }
        });

        return courses;

    } catch (error) {
        return []
    }
}


export const getCoursesByCategoryId = async (categoryId: string) => {
    try {
        
        const courses = await db.subCategory.findUnique({
            where : {
                id : categoryId
            },
            include : {
                courses : true,
                category : true
            }
        });

        return courses

    } catch (error) {
        return null
    }
}


// Purchases and ratings are aggregated in their own subqueries before joining
// back to Course. Joining both tables directly onto Course in one query fans
// rows out (purchases x ratings per course), inflating COUNT(p.id) by a
// multiple of the rating count — the cause of counts that didn't match the
// (independently-aggregated) course detail page.
const COURSE_CARD_FROM = Prisma.sql`
    SELECT
        c.id AS id,
        c.title AS title,
        c.price AS price,
        c.image AS image,
        COALESCE(p.total_purchases, 0) AS total_purchases,
        COALESCE(r.total_ratings, 0) AS total_ratings,
        COALESCE(r.average_rating, 0) AS average_rating,
        t.name AS tutor_name
    FROM
        "Course" c
    LEFT JOIN (
        SELECT "courseId", COUNT(*) AS total_purchases
        FROM "Purchase"
        GROUP BY "courseId"
    ) p ON p."courseId" = c.id
    LEFT JOIN (
        SELECT "courseId", COUNT(*) AS total_ratings, AVG(star) AS average_rating
        FROM "Rate"
        GROUP BY "courseId"
    ) r ON r."courseId" = c.id
    LEFT JOIN
        "User" t ON c."tutorId" = t.id`;

// COUNT() comes back as a BigInt and AVG() as a Prisma.Decimal; neither is a
// plain value, and passing them to a Client Component (every course card)
// throws "Only plain objects can be passed ...".
const serializeCourseCard = (course: any): Course => ({
    ...course,
    total_purchases: Number(course.total_purchases),
    total_ratings: Number(course.total_ratings),
    average_rating: String(Number(course.average_rating)),
});

export const searchCourses = async(query: string) : Promise<Course[]> =>{
    try {

        const courses: any[] = await db.$queryRaw`
            ${COURSE_CARD_FROM}
            WHERE
                c."isPublished" = true
                AND c.title ILIKE ${`%${query}%`}
            ORDER BY
                total_purchases DESC
            LIMIT 10;`

        return courses.map(serializeCourseCard);

    } catch (error) {
        return [];
    }
}

export const getCourseCardsByIds = async(ids: string[]) : Promise<Course[]> => {
    if (ids.length === 0) {
        return [];
    }

    try {

        const courses: any[] = await db.$queryRaw`
            ${COURSE_CARD_FROM}
            WHERE
                c."isPublished" = true
                AND c.id IN (${Prisma.join(ids)});`

        const byId = new Map(courses.map((course) => [course.id, serializeCourseCard(course)]));
        return ids.flatMap((id) => byId.get(id) ?? []);

    } catch (error) {
        return [];
    }
}