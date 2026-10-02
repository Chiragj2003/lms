// Data loaders take ids from their (server) callers. "use server" would
// expose them as public endpoints if a client ever imported one; this
// makes that a build error instead.
import "server-only";

import { db } from "@/lib/db";


export const courseMetadata = async( courseId: string )=>{
    try {
        
        const course = await db.course.findUnique({
            where : {
                id : courseId
            },
            select : {
                id : true,
                image : true,
                title : true,
                shortDescription : true,
                isPublished : true
            }
        });

        return course;

    } catch (error) {
        return null;
    }
}

export const chapterMetadata = async( chapterId: string ) => {
    try {
        
        const chapter = await db.chapter.findUnique({
            where : {
                id : chapterId
            },
            select : {
                id : true,
                title : true,
                course : {
                    select : {
                        image : true
                    }
                }
            }
        });

        return chapter;

    } catch (error) {
        return null;
    }
}

export const categoryMetaData = async (categoryId : string)=>{
    try {
        
        const category = await db.subCategory.findUnique({
            where : {
                id : categoryId
            }
        });

        return category;

    } catch (error) {
        return null;
    }
}