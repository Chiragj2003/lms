import { auth } from "@/auth";
import { db } from "@/lib/db";
import { QNASchema } from "@/schemas/qna.schema";
import { QNAResponse } from "@/types";
import { canAccessChapter } from "@/lib/chapter-access";
import { NextResponse } from "next/server";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";

const BATCH_SIZE = 5;

export async function GET (
    req: Request
) {
    try {

        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const id = searchParams.get("id");

        if (!id) {
            return new NextResponse("ChapterId is missing", {status: 400});
        }

        // Discussion on a paid chapter was readable by anyone, signed in or not.
        if (!(await canAccessChapter(session.user.id, id))) {
            return new NextResponse("You don't have access to this chapter", {status: 403});
        }

        let qna : QNAResponse[] = [];

        if (cursor) {
            qna = await db.qNA.findMany({
                where : {
                    chapterId : id
                },
                include : {
                    solution : true,
                    user : {
                        select : {
                            id : true,
                            name:  true,
                            image: true
                        }
                    }
                },
                take : BATCH_SIZE,
                skip : 1,
                cursor : {
                    id : cursor
                },
                orderBy : {
                    createdAt : "asc"
                }
            });
        } else {
            qna = await db.qNA.findMany({
                where : {
                    chapterId : id
                },
                include : {
                    solution : true,
                    user : {
                        select : {
                            id : true,
                            name:  true,
                            image: true
                        }
                    }
                },
                take : BATCH_SIZE,
                orderBy : {
                    createdAt : "asc"
                }
            });
        }

        let nextCursor = null;

        if(qna.length === BATCH_SIZE){
            nextCursor = qna[BATCH_SIZE-1].id
        }

        return NextResponse.json({
            items : qna,
            nextCursor
        });

    } catch (error) {
        console.error("QNA GET API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}


export async function POST (req: Request) {
    try {

        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", {status: 400});
        }

        if (!(await rateLimit(`qna:${session.user.id}`, 10, 60))) {
            return tooManyRequests(60);
        }

        const body = await req.json();
        const validatedData = await QNASchema.safeParseAsync(body);

        if (!validatedData.success) {
            return new NextResponse("Fields required", {status: 400});
        }

        const data = validatedData.data;

        // Only people who can watch the chapter can ask about it.
        if (!(await canAccessChapter(session.user.id, data.chapterId))) {
            return new NextResponse("You don't have access to this chapter", {status: 403});
        }

        const response = await db.qNA.create({
            data: {
                question : data.question,
                chapterId: data.chapterId,
                userId : session.user.id
            },
            include : {
                solution : true,
                user : {
                    select : {
                        id : true,
                        name:  true,
                        image: true
                    }
                }
            },
        });

        return NextResponse.json(response);
        
    } catch (error) {
        console.error("QNA POST API ERROR", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}