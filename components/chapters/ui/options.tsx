"use client";

import { useEffect, useState } from "react";
import { 
    Attachment, 
    Chapter, 
    Note, 
    UserProgress, 
    Cerificate
} from "@prisma/client";

import { Overview } from "@/components/chapters/ui/overview";
import { Notes } from "@/components/chapters/ui/notes";
import { useNotes } from "@/hooks/use-notes";
import { Canvas } from "./canvas";
import CourseReview from "@/components/rating/course-review";
import { QNA } from "@/components/qna/qna";
import { AI } from "@/components/ai/ai";
import { PencilLine, PenTool, MessageSquare, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionsProps {
    chapter : Chapter & { notes : Note[], attachments : Attachment[] };
    courseId : string;
    course : {
        image: string | null;
        price: number | null;
        updatedAt: Date;
        _count: {
            purchases: number;
            ratings: number;
        };
        shortDescription: string | null;
        tutor: {
            name: string | null;
            image: string | null;
            profile: {
                description: string|null;
                headline : string|null;
                facebookLink : string|null;
                githubLink : string|null;
                websiteLink : string|null;
                linkedinLink : string|null;
                twitterLink : string|null;
                youtubeLink :string|null;
            } | null;
        };
    },
    isPurchased : boolean;
    userProgress : UserProgress|null;
    nextChapterId? : string;
    certificate : Cerificate|null;
    quizId? : string;
    quizResultId? : string;
}

type Tool = "notes" | "canvas" | "reviews" | "qna" | "ai";

export const Options = ({
    chapter,
    course,
    courseId,
    isPurchased,
    userProgress,
    nextChapterId,
    certificate,
    quizId,
    quizResultId
} : OptionsProps ) => {

    const { addNotes } = useNotes();
    const [activeTool, setActiveTool] = useState<Tool>("notes");

    useEffect(()=>{
        addNotes(chapter.notes);
    }, [chapter.id, chapter.notes, addNotes]);


    return (
        <div className="mt-3 space-y-3">
            {/* Learning tools, right under the video */}
            <div className="flex flex-col h-[600px] rounded-[28px] bg-white overflow-hidden">
                <div role="tablist" aria-label="Chapter tools" className="flex items-center gap-1.5 overflow-x-auto p-3 shrink-0 hide-scrollbar border-b border-border">
                    <WorkspaceTab active={activeTool === "notes"} onClick={() => setActiveTool("notes")} icon={PencilLine} label="Notes" />
                    <WorkspaceTab active={activeTool === "qna"} onClick={() => setActiveTool("qna")} icon={MessageSquare} label="Q&A" />
                    <WorkspaceTab active={activeTool === "ai"} onClick={() => setActiveTool("ai")} icon={Sparkles} label="AI Tutor" />
                    <WorkspaceTab active={activeTool === "canvas"} onClick={() => setActiveTool("canvas")} icon={PenTool} label="Canvas" />
                    <WorkspaceTab active={activeTool === "reviews"} onClick={() => setActiveTool("reviews")} icon={Star} label="Reviews" />
                </div>

                <div className="relative flex-1 min-h-0">
                    {activeTool === "ai" ? (
                        // The AI panel scrolls its own message list and keeps
                        // the input pinned, so it gets no outer scroll.
                        <div className="absolute inset-0">
                            <AI chapterId={chapter.id} />
                        </div>
                    ) : (
                        <div className="absolute inset-0 overflow-y-auto">
                            {activeTool === "notes" && (
                                <Notes chapterId={chapter.id} courseId={courseId} isPurchased={isPurchased} />
                            )}
                            {activeTool === "canvas" && (
                                <Canvas chapterId={chapter.id} />
                            )}
                            {activeTool === "reviews" && (
                                <div className="p-5 md:p-6"><CourseReview courseId={courseId} /></div>
                            )}
                            {activeTool === "qna" && (
                                <QNA chapterId={chapter.id}/>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* About this chapter; progress and certificate come last */}
            <div className="rounded-[28px] bg-white p-5 md:p-7">
                <Overview
                    description={chapter.description!}
                    purchases={course._count.purchases}
                    ratings={course._count.ratings}
                    shortDescription={course.shortDescription!}
                    tutor={course.tutor}
                    updatedAt={course.updatedAt}
                    isPurchased={isPurchased}
                    chapterId={chapter.id}
                    courseId={courseId}
                    nextChapterId={nextChapterId}
                    userProgress={userProgress}
                    certificate={certificate}
                    quizId={quizId}
                    quizResultId={quizResultId}
                />
            </div>
        </div>
    )
}

function WorkspaceTab({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
    return (
        <button
            type="button"
            role="tab"
            aria-selected={active}
            onClick={onClick}
            className={cn(
                "flex h-9 items-center gap-x-2 px-3.5 rounded-full text-[13px] font-medium transition-colors shrink-0",
                active ? "bg-ink text-white" : "text-ink shadow-[inset_0_0_0_1px_hsl(var(--border))] hover:bg-soft"
            )}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    )
}
