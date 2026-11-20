"use client";

import { RichText as Preview } from "@/components/utils/rich-text";

import { useRouter } from "next/navigation";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Chapter } from "@prisma/client";
import { Play, VideoIcon } from "lucide-react";

interface ChaptersProps {
    chapters : Chapter[];
}

function parseDuration ( duration: number|null ) {

    if (!duration) return "00:00";
    const hour = Math.floor(duration / 3600); 
    const minute = Math.floor((duration % 3600) / 60).toString().padStart(2, '0');
    const second = (duration % 60).toString().padStart(2, '0');
  
    return hour > 0 ? `${hour}:${minute}:${second}` : `${minute}:${second}`;

}

export const Chapters = ({
    chapters
} : ChaptersProps) => {
    const router = useRouter();

    return (
        <section className="w-full rounded-[32px] bg-white p-5 sm:p-8">
            <div className="w-full space-y-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-ink">
                        Course content
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {chapters.length} {chapters.length === 1 ? "chapter" : "chapters"}
                        {chapters.some((c) => c.isFree) && ` · ${chapters.filter((c) => c.isFree).length} free preview`}
                    </p>
                </div>
                <div className="w-full">
                    <Accordion type="single" collapsible className="space-y-2">
                        {
                            chapters.map((chapter)=>(
                                <AccordionItem value={chapter.id} key={chapter.id} className="rounded-[20px] border-0 bg-soft px-4">
                                    <AccordionTrigger className="hover:no-underline">
                                        <div className="flex items-center justify-between w-full pr-3 gap-x-3">
                                            <div className="flex items-center gap-x-3">
                                                <span className={chapter.isFree
                                                    ? "size-9 shrink-0 rounded-full bg-ink text-white flex items-center justify-center"
                                                    : "size-9 shrink-0 rounded-full bg-white text-ink flex items-center justify-center"} aria-hidden="true">
                                                    {chapter.isFree ? <Play className="size-4" /> : <VideoIcon className="size-4" />}
                                                </span>
                                                <h3 className="text-ink font-medium text-[15px] text-left">{chapter.title}</h3>
                                            </div>
                                            <div className="flex items-center gap-x-3">
                                                {
                                                    // The badge used to be decoration only. Free chapters
                                                    // are watchable, so clicking it opens that one chapter
                                                    // (the chapter page still locks every paid chapter).
                                                    chapter.isFree && (
                                                        <Badge
                                                            role="link"
                                                            tabIndex={0}
                                                            variant="info"
                                                            className="cursor-pointer hover:bg-peri"
                                                            onClick={(e)=>{
                                                                e.stopPropagation();
                                                                router.push(`/course/${chapter.courseId}/view/chapter/${chapter.id}`);
                                                            }}
                                                            onKeyDown={(e)=>{
                                                                if (e.key !== "Enter" && e.key !== " ") return;
                                                                e.stopPropagation();
                                                                e.preventDefault();
                                                                router.push(`/course/${chapter.courseId}/view/chapter/${chapter.id}`);
                                                            }}
                                                        >
                                                            Free preview
                                                        </Badge>
                                                    )
                                                }
                                                <span className="text-sm text-muted-foreground tabular-nums">
                                                    {parseDuration(chapter.duration)}
                                                </span>
                                            </div>
                                            
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-sm">
                                        <Preview value={chapter.description} />
                                    </AccordionContent>
                                </AccordionItem>
                            ))
                        }
                    </Accordion>
                </div>
            </div>
        </section>
    )
}
