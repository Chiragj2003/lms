import { auth } from "@/auth";
import { db } from "@/lib/db";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";
import { AnswerSchema } from "@/schemas/answer.schema";
import { NextResponse } from "next/server";

/** The question, if the signed-in user is the tutor of its course. */
const findOwnQuestion = (qnaId: string, tutorId: string) =>
    db.qNA.findFirst({
        where : { id : qnaId, chapter : { course : { tutorId } } },
        select : { id : true }
    });

/** Adds or edits the course tutor's answer to a learner's question. */
export async function PUT(req: Request, props: { params: Promise<{ qnaId: string }> }) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!(await rateLimit(`qna-answer:${session.user.id}`, 30, 60))) {
            return tooManyRequests(60);
        }

        const parsed = AnswerSchema.safeParse(await req.json());
        if (!parsed.success) {
            return new NextResponse(parsed.error.issues[0]?.message || "Invalid answer", { status: 400 });
        }

        // Only the tutor of the question's course may answer it.
        if (!(await findOwnQuestion(params.qnaId, session.user.id))) {
            return new NextResponse("Question not found", { status: 404 });
        }

        const solution = await db.solution.upsert({
            where : { questionId : params.qnaId },
            create : { questionId : params.qnaId, tutorId : session.user.id, answer : parsed.data.answer },
            update : { answer : parsed.data.answer },
        });

        return NextResponse.json(solution);

    } catch (error) {
        console.error("QNA ANSWER PUT API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}

/** Removes the tutor's answer. */
export async function DELETE(req: Request, props: { params: Promise<{ qnaId: string }> }) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!(await findOwnQuestion(params.qnaId, session.user.id))) {
            return new NextResponse("Question not found", { status: 404 });
        }

        await db.solution.deleteMany({ where : { questionId : params.qnaId } });

        return NextResponse.json({ success : true });

    } catch (error) {
        console.error("QNA ANSWER DELETE API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
