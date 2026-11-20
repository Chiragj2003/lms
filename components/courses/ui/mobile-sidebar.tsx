"use client";

import { Chapter, Course, Purchase, UserProgress } from "@prisma/client";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { SidebarItem } from "./sidebar-item";
import { CourseProgress } from "./course-progress";
import { useSidebar } from "@/hooks/use-sidebar";

interface MobileSidebarProps {
    course : Course & {
        chapters : ( Chapter & { userProgress : UserProgress[]|null })[]
    };
    progressCount : number;
    purchase : Purchase|null;
}

export const MobileSidebar = ({
    course,
    progressCount,
    purchase
}: MobileSidebarProps) => {

    const { isOpen, onClose } = useSidebar();
    const onOpenChange = (open: boolean)=>{
        if (!open) {
            onClose();
        }
    }

    return (
        <Sheet
            open={isOpen}
            onOpenChange={onOpenChange}
        >
            <SheetContent className="h-full bg-white w-full sm:max-w-sm border-none p-0" side="left">
                <div className="h-full w-full flex flex-col overflow-y-auto chapter-scroll relative">
                    <SheetHeader className="flex flex-col p-6 space-y-4 sticky top-0 bg-white z-10 text-left">
                        <SheetTitle className="text-lg font-medium tracking-tight text-ink">{course.title}</SheetTitle>
                        {
                            purchase && (
                                <SheetDescription className="rounded-2xl bg-soft p-3">
                                    <CourseProgress
                                        variant="success"
                                        value={progressCount}
                                    />
                                </SheetDescription>
                            )
                        }
                    </SheetHeader>
                    <div className="flex flex-col gap-1 w-full px-3 pb-4">
                        {
                            course.chapters.map((chapter)=>(
                                <SidebarItem
                                    key = {chapter.id}
                                    id = {chapter.id}
                                    label= {chapter.title}
                                    isCompleted = {!!chapter.userProgress?.[0]?.isCompleted}
                                    courseId = {course.id}
                                    isLocked = { !chapter.isFree && !purchase }
                                />
                            ))
                        }
                    </div>
                </div>
            </SheetContent>
        </Sheet>     
    )
}
