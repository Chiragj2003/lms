import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { CompletedChaptersChart } from "@/components/dashboard/completed-chapters-chart";
import { CoursesProgress } from "@/components/dashboard/courses-progress";
import { TimeChart } from "@/components/dashboard/time-chart";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeader } from "@/components/ui/section-header";

export const metadata : Metadata = {
    title : "My learning"
}

const MyLearningPage = async() => {
    
    const session = await auth();
    if (!session || !session.user.id) {
        return redirect("/login");
    }

    if (session.user.role === "TUTOR") {
        return redirect("/tutor/analytics");
    }
    
    return (
        <PageContainer className="py-12 md:py-20 min-h-screen">
            <div className="mb-12">
                <SectionHeader 
                    title="My Learning Analytics"
                    subtitle="Track your progress and study habits."
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="lg:col-span-2">
                    <CoursesProgress userId={session.user.id} />
                </div>
                
                <div className="w-full">
                    <CompletedChaptersChart userId={session.user.id} />
                </div>
                
                <div className="w-full">
                    <TimeChart userId={session.user.id}  />
                </div>
            </div>
        </PageContainer>
    )
}

export default MyLearningPage;