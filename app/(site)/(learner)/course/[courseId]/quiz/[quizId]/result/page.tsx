import { auth } from "@/auth";
import { InfoCard } from "@/components/quiz/info";
import { OutputCard } from "@/components/quiz/output-card";
import { RetakeQuizButton } from "@/components/quiz/retake-quiz-button";
import { Unauthorized } from "@/components/quiz/unauthorized";
import { Badge } from "@/components/ui/badge";
import { getQuizById } from "@/server/quiz";
import { CheckCircle, XCircle } from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata : Metadata = {
    title : "Result"
}

interface QuizResultPageProps {
    params : Promise<{
        courseId: string;
        quizId: string;
    }>
}

const QuizResultPage = async (props: QuizResultPageProps) => {
    const params = await props.params;

    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return redirect("/");
    }


    const quiz = await getQuizById(params.courseId, params.quizId, session.user.id);

    if (!quiz) {
        return (
            <Unauthorized
                courseId={params.courseId}
            />
        )
    }

    if ( !quiz.result[0] ) {
        return redirect(`/course/${params.courseId}/quiz/${params.quizId}`)
    }

    return (
        <main
            className="px-4 sm:px-6 max-w-4xl w-full mx-auto"
        >
            <div className="pt-8 pb-6 flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col items-start gap-y-3">
                    <h1 className="text-display-sm">Quiz result</h1>
                    <Badge variant="pink" className="h-8 px-4 text-sm">
                        {quiz._count.questions} {quiz._count.questions === 1 ? "question" : "questions"}
                    </Badge>
                </div>
                <RetakeQuizButton courseId={params.courseId} quizId={params.quizId} />
            </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoCard
                    icon={CheckCircle}
                    label="Correct answers"
                    value={quiz.result[0].correctQuestions.length}
                    variant="success"
                />
                <InfoCard
                    icon={XCircle}
                    label="Incorrect answers"
                    value={quiz.result[0].inCorrectQuestions.length}
                    variant="default"
                />
            </div>
            <div className="w-full py-6 flex flex-col gap-y-3" >
                {
                    quiz.questions.map((question)=>(
                        <OutputCard
                            key={question.id}
                            question={question}
                            type={quiz.result[0].correctQuestions.includes(question.id)?"correct" : quiz.result[0].inCorrectQuestions.includes(question.id) ? "incorrect" : "dropped" }
                        />
                    ))
                }

            </div>
        </main>
    )
}

export default QuizResultPage;