import { Chapter, Course, Purchase, UserProgress } from "@prisma/client";
import { SidebarItem } from "./sidebar-item";
import { CourseProgress } from "./course-progress";

interface SideBarProps {
    course : Course & {
        chapters : ( Chapter & { userProgress : UserProgress[]|null })[]
    };
    progressCount : number;
    purchase: Purchase|null;
}

export const SideBar = ({
    course,
    progressCount,
    purchase
}: SideBarProps) => {
    
    return (
        <nav aria-label="Chapters" className="h-full w-full bg-white flex flex-col overflow-y-auto">
            <div className="p-5 flex flex-col sticky top-0 z-10 bg-white/95 backdrop-blur-md">
                <p className="text-xs text-muted-foreground">Course</p>
                <h2 className="text-lg font-medium leading-snug tracking-tight text-ink">{course.title}</h2>
                {
                    purchase && (
                        <div className="mt-4 rounded-2xl bg-soft p-3">
                            <CourseProgress
                                variant="success"
                                value={progressCount}
                            />
                        </div>
                    )
                }
            </div>
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
        </nav>
    )
}
