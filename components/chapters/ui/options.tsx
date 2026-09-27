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
import { PencilLine, PenTool, MessageSquare, Sparkles, LayoutList, Star } from "lucide-react";
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

type Tool = "overview" | "notes" | "canvas" | "reviews" | "qna" | "ai";

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
    const [activeTool, setActiveTool] = useState<Tool>("overview");

    useEffect(()=>{
        addNotes(chapter.notes);
    }, [chapter.id, chapter.notes, addNotes]);


    return (
        <div className="flex flex-col lg:flex-row min-h-screen border-t border-border mt-4">
            {/* Left/Main Column: Video overview and basic context */}
            <div className="flex-1 lg:border-r border-border p-6 md:p-10">
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

            {/* Right Column: Integrated Learning Workspace */}
            <div className="w-full lg:w-[450px] shrink-0 bg-muted/20 flex flex-col h-[800px] lg:h-auto border-t lg:border-t-0 border-border">
                {/* Workspace Navigation */}
                <div className="flex items-center overflow-x-auto border-b border-border bg-card sticky top-0 z-10 px-2 py-2 shrink-0 hide-scrollbar">
                    <WorkspaceTab active={activeTool === "notes"} onClick={() => setActiveTool("notes")} icon={PencilLine} label="Notes" />
                    <WorkspaceTab active={activeTool === "qna"} onClick={() => setActiveTool("qna")} icon={MessageSquare} label="Q&A" />
                    <WorkspaceTab active={activeTool === "ai"} onClick={() => setActiveTool("ai")} icon={Sparkles} label="AI Tutor" />
                    <WorkspaceTab active={activeTool === "canvas"} onClick={() => setActiveTool("canvas")} icon={PenTool} label="Canvas" />
                    <WorkspaceTab active={activeTool === "reviews"} onClick={() => setActiveTool("reviews")} icon={Star} label="Reviews" />
                </div>

                {/* Workspace Content */}
                <div className="flex-1 overflow-y-auto bg-card relative">
                    <div className={cn("absolute inset-0 h-full", activeTool === "overview" && "hidden")}>
                        {activeTool === "notes" && (
                            <Notes chapterId={chapter.id} courseId={courseId} isPurchased={isPurchased} />
                        )}
                        {activeTool === "canvas" && (
                            <Canvas chapterId={chapter.id} />
                        )}
                        {activeTool === "reviews" && (
                            <div className="p-6"><CourseReview courseId={courseId} /></div>
                        )}
                        {activeTool === "qna" && (
                            <QNA chapterId={chapter.id}/>
                        )}
                        {activeTool === "ai" && (
                            <AI chapterId={chapter.id} title={chapter.title} transcript={chapter.transcript} />
                        )}
                    </div>
                    {activeTool === "overview" && (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4 text-muted-foreground">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <LayoutList className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Learning Workspace</h3>
                                <p className="text-sm">Select a tool from the bar above to take notes, ask questions, or interact with the AI tutor while you watch.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function WorkspaceTab({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
    return (
        <button 
            onClick={onClick}
            className={cn(
                "flex items-center gap-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0",
                active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    )
}
