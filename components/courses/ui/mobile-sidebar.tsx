"use client";

import { Chapter, Course, Purchase, UserProgress } from "@prisma/client";
import {
    Sheet,
    SheetContent,
    SheetTitle,
} from "@/components/ui/sheet";
import { SideBar } from "./sidebar";
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
            <SheetContent className="h-full w-[88%] sm:max-w-sm border-none p-0 bg-white rounded-r-[28px] overflow-hidden" side="left">
                <SheetTitle className="sr-only">Chapters of {course.title}</SheetTitle>
                {/* Same list as the desktop sidebar; picking a chapter closes the sheet. */}
                <div className="h-full" onClick={(e) => { if ((e.target as HTMLElement).closest("button")) onClose(); }}>
                    <SideBar
                        course={course}
                        progressCount={progressCount}
                        purchase={purchase}
                    />
                </div>
            </SheetContent>
        </Sheet>     
    )
}
