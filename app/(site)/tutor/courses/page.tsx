import { auth } from "@/auth";
import { CourseTutorCard } from "@/components/courses/ui/course-tutor-card";
import { getCoursesByTutorId } from "@/server/course";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeader } from "@/components/ui/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CoursesPage = async() => {

    const session = await auth();

    if (!session){
        return redirect("/");
    }

    const courses = await getCoursesByTutorId(session.user.id!);

    return (
        <PageContainer className="py-10">
            <div className="mb-10">
                <SectionHeader 
                    title="Your Courses"
                    subtitle="Manage and edit your published and draft courses."
                    action={
                        <Link href="/tutor/create">
                            <Button variant="brand">Create New Course</Button>
                        </Link>
                    }
                />
            </div>

            {courses.length === 0 ? (
                <EmptyState
                    icon={<BookOpen className="h-10 w-10" />}
                    title="No courses yet"
                    description="You haven't created any courses. Start building your first course today!"
                    action={
                        <Link href="/tutor/create">
                            <Button variant="brand">Create Course</Button>
                        </Link>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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