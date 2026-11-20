import { getDashboardCourses } from "@/server/dashboard";
import { ProgressCard } from "./progress-card";
import { InfoCard } from "./info-card";


interface CoursesProgressProps {
    userId : string;
}

export const CoursesProgress = async({
    userId
} : CoursesProgressProps ) => {
    
    const { completedCourses, coursesInProgress } = await getDashboardCourses(userId);
    
    return (
        <div className="w-full">
            <div className="grid sm:grid-cols-2 gap-3">
                <InfoCard
                    label="In Progress"
                    numberOfItems={coursesInProgress.length}
                    src="/assets/clock.png"
                />
                <InfoCard
                    label="Completed"
                    numberOfItems={completedCourses.length}
                    src="/assets/checked.png"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4 gap-4">
                {
                    [...completedCourses, ...coursesInProgress].map((course)=>(
                        <ProgressCard key={course.id} course={course} />
                    ))
                }
            </div>
        </div>
    )
}
