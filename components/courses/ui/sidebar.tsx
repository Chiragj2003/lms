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

export const SideBar = async({
    course,
    progressCount,
    purchase
}: SideBarProps) => {
    
    return (
        <div className="h-full w-full bg-zinc-900 flex flex-col overflow-y-auto chapter-scroll shadow-xl">
            <div className="p-6 md:p-8 flex flex-col border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
                <h1 className="text-white font-bold leading-tight">{course.title}</h1>
                {
                    purchase && (
                        <div className="mt-6">
                            <CourseProgress
                                variant="success"
                                value={progressCount}
                            />
                        </div>
                    )
                }
            </div>
            <div className="flex flex-col w-full py-4">
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
    )
}
