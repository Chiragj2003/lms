import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getAnalytics } from "@/server/analytics";
import { StatCard } from "@/components/ui/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { MonthlyChart } from "@/components/dashboard/monthly-chart";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeader } from "@/components/ui/section-header";
import { formatPrice } from "@/lib/format";
import { IndianRupee, ShoppingCart, Users, Star, BookOpen, Layers, TrendingUp, FileEdit } from "lucide-react";

export const metadata: Metadata = {
    title : 'Analytics'
}

const AnalyticPage = async() => {

    const session = await auth();
    if (!session || !session.user.id) {
        return redirect("/");
    }

    const {
        data,
        monthly,
        totalRevenue,
        totalSales,
        totalStudents,
        totalCourses,
        publishedCourses,
        totalChapters,
        totalReviews,
        averageRating
    } = await getAnalytics(session.user.id);

    return (
        <PageContainer className="pb-10 space-y-4">
            <SectionHeader 
                title="Analytics & Revenue"
                subtitle="Track your course performance, sales, and student engagement."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard 
                    label="Total Revenue"
                    tone="peri" 
                    value={formatPrice(totalRevenue)} 
                    icon={<IndianRupee className="h-4 w-4" />} 
                />
                <StatCard 
                    label="Total Sales"
                    tone="lilac" 
                    value={totalSales} 
                    icon={<ShoppingCart className="h-4 w-4" />} 
                />
                <StatCard 
                    label="Total Students"
                    tone="mint" 
                    value={totalStudents} 
                    icon={<Users className="h-4 w-4" />} 
                />
                <StatCard
                    label="Average Rating"
                    tone="sun"
                    value={averageRating ? averageRating.toFixed(1) : "No ratings"}
                    icon={<Star className="h-4 w-4" />}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard 
                    label="Courses" 
                    value={totalCourses} 
                    icon={<BookOpen className="h-4 w-4" />} 
                />
                <StatCard 
                    label="Chapters" 
                    value={totalChapters} 
                    icon={<Layers className="h-4 w-4" />} 
                />
                <StatCard
                    label="Avg. Rev / Sale"
                    value={formatPrice(totalSales ? totalRevenue / totalSales : 0)}
                    icon={<TrendingUp className="h-4 w-4" />}
                />
                <StatCard
                    label="Drafts"
                    value={totalCourses - publishedCourses}
                    icon={<FileEdit className="h-4 w-4" />}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <MonthlyChart data={monthly} />
                <RevenueChart data={data} />
            </div>
        </PageContainer>
    )
}

export default AnalyticPage;
