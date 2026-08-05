import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getAnalytics } from "@/server/analytics";
import { DataCard } from "@/components/dashboard/data-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { MonthlyChart } from "@/components/dashboard/monthly-chart";

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
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-zinc-800">Analytics</h1>
                <p className="text-sm text-zinc-600 mt-1">How your courses are performing.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <DataCard label="Revenue" value={totalRevenue} shouldFormat />
                <DataCard label="Sales" value={totalSales} />
                <DataCard label="Students" value={totalStudents} />
                <DataCard
                    label="Average rating"
                    value={averageRating ? Number(averageRating.toFixed(2)) : 0}
                    hint={totalReviews ? `${totalReviews} reviews` : "No reviews yet"}
                />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <DataCard label="Courses" value={totalCourses} hint={`${publishedCourses} published`} />
                <DataCard label="Chapters" value={totalChapters} />
                <DataCard
                    label="Avg. revenue per sale"
                    value={totalSales ? Math.round(totalRevenue / totalSales) : 0}
                    shouldFormat
                />
                <DataCard
                    label="Drafts"
                    value={totalCourses - publishedCourses}
                    hint={totalCourses - publishedCourses ? "Not visible to learners" : "All published"}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <MonthlyChart data={monthly} />
                <RevenueChart data={data} />
            </div>
        </div>
    )
}

export default AnalyticPage;
