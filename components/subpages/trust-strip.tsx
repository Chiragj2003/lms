import { PageContainer } from "@/components/ui/page-container";
import { Users, BookOpen, Award, Star } from "lucide-react";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

// Real platform figures, not marketing placeholders: the strip used to claim
// 50,000+ learners and 2,000+ courses regardless of what was in the database.
export const TrustStrip = async () => {

    const [learners, courses, certificates, rating] = await Promise.all([
        db.user.count({ where : { role : "LEARNER" } }),
        db.course.count({ where : { isPublished : true } }),
        db.cerificate.count(),
        db.rate.aggregate({ _avg : { star : true } }),
    ]);

    const average = rating._avg.star;

    const stats = [
        {
            label : learners === 1 ? "Learner" : "Learners",
            value : learners.toLocaleString("en-IN"),
            icon : Users,
            tone : "bg-white",
        },
        {
            label : courses === 1 ? "Course" : "Courses",
            value : courses.toLocaleString("en-IN"),
            icon : BookOpen,
            tone : "bg-mint-soft",
        },
        {
            label : certificates === 1 ? "Certificate earned" : "Certificates earned",
            value : certificates.toLocaleString("en-IN"),
            icon : Award,
            tone : "bg-peri-soft",
        },
        {
            label : "Average rating",
            value : average ? `${average.toFixed(1)} / 5` : "—",
            icon : Star,
            tone : "bg-sun-soft",
        }
    ];

    return (
        <section className="py-6">
            <PageContainer>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className={cn("rounded-3xl p-5 sm:p-6 flex items-center justify-between gap-4", stat.tone)}>
                            <div>
                                <p className="text-3xl sm:text-[40px] leading-none font-medium tracking-tight text-ink">{stat.value}</p>
                                <p className="text-sm text-ink-2 mt-2">{stat.label}</p>
                            </div>
                            <span className="hidden sm:flex size-11 shrink-0 rounded-full bg-ink text-white items-center justify-center" aria-hidden="true">
                                <stat.icon className="size-5" />
                            </span>
                        </div>
                    ))}
                </div>
            </PageContainer>
        </section>
    )
}
