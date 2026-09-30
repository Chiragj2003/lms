import { PageContainer } from "@/components/ui/page-container";
import { Users, BookOpen, Award, Star } from "lucide-react";
import { db } from "@/lib/db";

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
        },
        {
            label : courses === 1 ? "Course" : "Courses",
            value : courses.toLocaleString("en-IN"),
            icon : BookOpen,
        },
        {
            label : certificates === 1 ? "Certificate earned" : "Certificates earned",
            value : certificates.toLocaleString("en-IN"),
            icon : Award,
        },
        {
            label : "Average Rating",
            value : average ? `${average.toFixed(1)}/5.0` : "—",
            icon : Star,
        }
    ];

    return (
        <div className="bg-primary py-12 md:py-16">
            <PageContainer>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center justify-center space-y-3">
                            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
                                <p className="text-sm text-primary-foreground/80 mt-1 font-medium">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </PageContainer>
        </div>
    )
}
