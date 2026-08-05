import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse =  Purchase & {
    course : Course;
}

export const groupByCourse = ( purchases : PurchaseWithCourse[] )=>{
    const grouped : { [courseTitle: string]: number} = {};
    purchases.forEach((purchase)=>{
        const courseTitle = purchase.course.title
        if (!grouped[courseTitle]) {
            grouped[courseTitle] = 0;
        }
        grouped[courseTitle] += purchase.course.price!;
    });


    return grouped;
}


const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/** Revenue per month for the last `count` months, oldest first. */
const groupByMonth = ( purchases : PurchaseWithCourse[], count = 6 ) => {
    const now = new Date();
    const buckets : { name: string; total: number; sales: number }[] = [];

    for (let i = count - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        buckets.push({ name : MONTHS[d.getMonth()], total : 0, sales : 0 });
    }

    const oldest = new Date(now.getFullYear(), now.getMonth() - (count - 1), 1);

    purchases.forEach((purchase) => {
        if (purchase.createdAt < oldest) return;
        const months = (purchase.createdAt.getFullYear() - oldest.getFullYear()) * 12
            + (purchase.createdAt.getMonth() - oldest.getMonth());
        const bucket = buckets[months];
        if (!bucket) return;
        bucket.total += purchase.course.price ?? 0;
        bucket.sales += 1;
    });

    return buckets;
}

export const getAnalytics = async ( tutorId: string ) => {
    try {

        const [purchases, courses, ratings] = await Promise.all([
            db.purchase.findMany({
                where   : { course : { tutorId } },
                include : { course : true }
            }),
            db.course.findMany({
                where  : { tutorId },
                select : {
                    id : true,
                    isPublished : true,
                    _count : { select : { chapters : true } }
                }
            }),
            db.rate.findMany({
                where  : { course : { tutorId } },
                select : { star : true }
            })
        ]);

        const groupedEarning = groupByCourse(purchases);
        const data = Object.entries(groupedEarning)
            .map(([courseTitle, total])=>({name: courseTitle, total}))
            .sort((a, b) => b.total - a.total);

        const totalRevenue = data.reduce((acc, curr)=> acc + curr.total, 0);
        const totalSales = purchases.length;

        // A learner who buys three courses is still one student.
        const totalStudents = new Set(purchases.map((p) => p.userId)).size;

        const scored = ratings.filter((r) => typeof r.star === "number");
        const averageRating = scored.length
            ? scored.reduce((acc, r) => acc + (r.star ?? 0), 0) / scored.length
            : 0;

        return {
            data,
            monthly : groupByMonth(purchases),
            totalRevenue,
            totalSales,
            totalStudents,
            totalCourses : courses.length,
            publishedCourses : courses.filter((c) => c.isPublished).length,
            totalChapters : courses.reduce((acc, c) => acc + c._count.chapters, 0),
            totalReviews : ratings.length,
            averageRating
        }

    } catch (error) {
        console.error("ANALYTICS API ERROR", error);
        return {
            data : [],
            monthly : [],
            totalRevenue : 0,
            totalSales : 0,
            totalStudents : 0,
            totalCourses : 0,
            publishedCourses : 0,
            totalChapters : 0,
            totalReviews : 0,
            averageRating : 0
        };
    }
}