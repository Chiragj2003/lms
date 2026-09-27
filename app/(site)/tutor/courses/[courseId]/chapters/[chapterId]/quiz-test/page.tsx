import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getQuiz } from "@/server/chapter";
import { QuizForm } from "@/components/quiz/form";
import { Actions } from "@/components/quiz/actions";
import { PageContainer } from "@/components/ui/page-container";


interface QuizPageProps {
    params : Promise<{ courseId: string, chapterId: string }>
}

const QuizPage = async (props: QuizPageProps) => {
    const params = await props.params;

    const session = await auth();
    if (!session) {
        redirect("/");
    }


    const quiz = await getQuiz(params.courseId, session.user.id! ,params.chapterId);
    if (!quiz ) {
        redirect("/");
    }

    return (
        <PageContainer className="py-10 space-y-12">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link
                        href={`/tutor/courses/${params.courseId}/chapters/${params.chapterId}`}
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition mb-6 font-medium group"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to chapter setup
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-3xl font-bold text-foreground">
                                Quiz Builder
                            </h1>
                            <p className="text-sm text-muted-foreground font-medium">Add questions and answers to test learners.</p>
                        </div>
                        <Actions
                            chapterId={params.chapterId}
                            courseId={params.courseId}
                            disabled={quiz.questions.length===0}
                            isPublished={quiz.isPublished}
                        />
                    </div>
                </div>
            </div>
            <div className="max-w-2xl w-full">
                <QuizForm
                    chapterId={params.chapterId}
                    courseId={params.courseId}
                    quiz={quiz}
                />
            </div>
        </PageContainer>
    )
}

export default QuizPage;