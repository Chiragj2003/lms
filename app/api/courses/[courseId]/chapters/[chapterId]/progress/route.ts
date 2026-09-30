import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    props: { params : Promise<{ chapterId : string, courseId: string }> }
) {
    const params = await props.params;
    try {

        const session = await auth();
        if ( !session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized attempt", {status: 401});
        }

        const { isCompleted } = await req.json();

        if (typeof isCompleted !== "boolean") {
            return new NextResponse("isCompleted must be a boolean", {status: 400});
        }

        const chapter = await db.chapter.findUnique({
            where : {
                id : params.chapterId,
                courseId : params.courseId,
                isPublished : true
            },
            select : { isFree : true }
        });

        if (!chapter) {
            return new NextResponse("Chapter not found", {status: 404});
        }

        // Progress feeds certificates, so it can only be recorded for a
        // chapter the learner can actually watch.
        if (!chapter.isFree) {
            const purchase = await db.purchase.findUnique({
                where : {
                    userId_courseId : {
                        userId : session.user.id,
                        courseId : params.courseId
                    }
                }
            });

            if (!purchase) {
                return new NextResponse("Course is not purchased", {status: 403});
            }
        }

        const userProgress = await db.userProgress.upsert({
            where : {
                userId_chapterId : {
                    chapterId : params.chapterId,
                    userId : session.user.id
                }
            },
            update : {
                isCompleted
            },
            create : {
                userId : session.user.id,
                chapterId : params.chapterId,
                isCompleted
            }
        });

        return NextResponse.json(userProgress);

    } catch (e) {
        return new NextResponse("Internal server error", {status: 500});
    }
}