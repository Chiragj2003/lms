import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { MessageCircleQuestion } from "lucide-react";

import { auth } from "@/auth";
import { cn } from "@/lib/utils";
import { getTutorQuestions } from "@/server/qna";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeader } from "@/components/ui/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RichText as Preview } from "@/components/utils/rich-text";
import { AnswerForm } from "@/components/qna/answer-form";

export const metadata : Metadata = {
    title : "Questions"
};

interface QuestionsPageProps {
    searchParams : Promise<{ filter? : string }>;
}

const QuestionsPage = async ({ searchParams } : QuestionsPageProps) => {

    const session = await auth();
    if (!session?.user?.id) {
        return redirect("/");
    }

    const filter = (await searchParams).filter === "all" ? "all" : "unanswered";
    const { questions, unansweredCount, pageSize } = await getTutorQuestions(session.user.id, filter);

    const tabs = [
        { key : "unanswered", label : `Unanswered (${unansweredCount})`, href : "/tutor/questions" },
        { key : "all", label : "All questions", href : "/tutor/questions?filter=all" },
    ];

    return (
        <PageContainer className="py-10 space-y-8">
            <SectionHeader
                title="Questions"
                subtitle="Learners' questions on your chapters. Your answers appear under the question in the chapter's Q&A."
            />

            <nav className="flex gap-2" aria-label="Filter questions">
                {
                    tabs.map((tab) => (
                        <Link
                            key={tab.key}
                            href={tab.href}
                            aria-current={filter === tab.key ? "page" : undefined}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                                filter === tab.key
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background text-muted-foreground border-border hover:text-foreground"
                            )}
                        >
                            {tab.label}
                        </Link>
                    ))
                }
            </nav>

            {
                questions.length === 0 ? (
                    <EmptyState
                        icon={<MessageCircleQuestion className="h-10 w-10" />}
                        title={filter === "unanswered" ? "You're all caught up" : "No questions yet"}
                        description={filter === "unanswered"
                            ? "Every question on your courses has an answer."
                            : "When learners ask about your chapters, their questions show up here."}
                    />
                ) : (
                    <div className="space-y-6 max-w-3xl">
                        {
                            questions.map((qna) => (
                                <article key={qna.id} className="bg-card border border-border rounded-2xl shadow-sm p-5 md:p-6 space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={qna.user.image || ""} alt="" />
                                                <AvatarFallback>{qna.user.name?.charAt(0) ?? "?"}</AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">{qna.user.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {qna.chapter.course.title} · {qna.chapter.title} · {format(qna.createdAt, "d MMM yyyy")}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={qna.solution ? "secondary" : "default"} className="shrink-0">
                                            {qna.solution ? "Answered" : "Needs answer"}
                                        </Badge>
                                    </div>
                                    <Preview value={qna.question} />
                                    <AnswerForm qnaId={qna.id} initialAnswer={qna.solution?.answer} />
                                </article>
                            ))
                        }
                        {
                            questions.length === pageSize && (
                                <p className="text-sm text-muted-foreground">Showing the {pageSize} most recent. Answer some to see older ones.</p>
                            )
                        }
                    </div>
                )
            }
        </PageContainer>
    );
};

export default QuestionsPage;
