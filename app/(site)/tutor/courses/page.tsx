import { auth } from "@/auth";
import { CourseTutorCard } from "@/components/courses/ui/course-tutor-card";
import { getCoursesByTutorId } from "@/server/course";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeader } from "@/components/ui/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CoursesPage = async() => {

    const session = await auth();

    if (!session){
        return redirect("/");
    }

    const courses = await getCoursesByTutorId(session.user.id!);

    return (
        <PageContainer className="pb-10">
            <div className="mb-6">
                <SectionHeader
                    title="Your courses"
                    subtitle="Edit drafts, publish when ready, and keep courses up to date."
                    action={
                        <Link href="/tutor/create">
                            <Button><Plus className="size-4" />New course</Button>
                        </Link>
                    }
                />
            </div>

            {courses.length === 0 ? (
                <EmptyState
                    className="rounded-[32px] bg-white py-14"
                    illustration="/assets/illustrations/first-course.webp"
                    title="No courses yet"
                    description="You haven't created any courses. Start building your first course today!"
                    action={
                        <Link href="/tutor/create">
                            <Button><Plus className="size-4" />Create a course</Button>
                        </Link>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {
                        courses.map((course)=>(
                            <CourseTutorCard
                                course={course}
                                key={course.id}
                            />
                        ))
                    }
                </div>
            )}
        </PageContainer>
    )
}

export default CoursesPage