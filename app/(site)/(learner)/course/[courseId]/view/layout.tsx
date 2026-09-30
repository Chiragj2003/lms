import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { MobileSidebar } from "@/components/courses/ui/mobile-sidebar";
import { SideBar } from "@/components/courses/ui/sidebar";
import { getCourseAndProgress } from "@/server/course";
import { getUserProgressCount } from "@/server/progress";
import { courseMetadata } from "@/server/metadata";
import { db } from "@/lib/db";

interface ViewLayoutPageProps {
    params : Promise<{ courseId : string }>
    children : React.ReactNode;
}

export async function generateMetadata(props: ViewLayoutPageProps): Promise<Metadata> {
    const params = await props.params;

    const data = await courseMetadata(params.courseId);

    // A specific chapter's own generateMetadata overrides this with the
    // chapter title; this is only what's shown before one is picked.
    return {
        title : data?.title ?? "Course Player"
    };
}
const ViewLayoutPage = async (props: ViewLayoutPageProps) => {
    const params = await props.params;

    const {
        children
    } = props;

    // Signed-out visitors may watch a course's free preview chapter, so the
    // player shell renders without a session; each chapter page decides
    // whether its own content needs one.
    const session = await auth();
    const userId = session?.user?.id;

    const course = await getCourseAndProgress(params.courseId, userId ?? "");

    if (!course) {
        redirect("/");
    }

    const progressCount = userId ? await getUserProgressCount(userId, course.id) : 0;

    const purchase = userId
        ? await db.purchase.findUnique({
            where : {
                userId_courseId : {
                    userId,
                    courseId : course.id
                }
            }
        })
        : null;

    return (
        <>
            <MobileSidebar
                course={course}
                progressCount={progressCount}
                purchase={purchase}
            />
            <div className="h-full w-full flex overflow-hidden">
                <div className="hidden md:flex h-full w-80 flex-col shrink-0 border-r border-border bg-card shadow-sm z-10 relative">
                    <SideBar
                        course={course}
                        progressCount={progressCount}
                        purchase={purchase}
                    />
                </div>
                <main className="h-full overflow-y-auto w-full md:w-[calc(100%-20rem)] flex-1 bg-background relative">
                    { children }
                </main>
            </div>
        </>
    )
}

export default ViewLayoutPage