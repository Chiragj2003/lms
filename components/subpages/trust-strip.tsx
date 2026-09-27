import { PageContainer } from "@/components/ui/page-container";
import { Users, BookOpen, Award, Star } from "lucide-react";

const stats = [
    {
        label: "Active Learners",
        value: "50,000+",
        icon: Users,
    },
    {
        label: "Premium Courses",
        value: "2,000+",
        icon: BookOpen,
    },
    {
        label: "Certifications",
        value: "15,000+",
        icon: Award,
    },
    {
        label: "Average Rating",
        value: "4.8/5.0",
        icon: Star,
    }
];

export const TrustStrip = () => {
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
