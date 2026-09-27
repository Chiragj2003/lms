import Image from "next/image";
import { PageContainer } from "../ui/page-container";
import { SectionHeader } from "../ui/section-header";

const features = [
    {
        icon : "/assets/ai.png",
        title : "AI-Powered Learning",
        body : "Instantly resolve course-related doubts through an intuitive AI assistant."
    },
    {
        icon : "/assets/notes.png",
        title : "Smart Note Editor",
        body : "Take timestamped notes and embed screenshots while watching lessons."
    },
    {
        icon : "/assets/exam.png",
        title : "Interactive Quizzes",
        body : "Test your knowledge with chapter quizzes to ensure you've mastered the material."
    },
    {
        icon : "/assets/certificate.png",
        title : "Digital Certificates",
        body : "Earn verifiable certificates to showcase your achievements to employers."
    },
    {
        icon : "/assets/graph.png",
        title : "Real-Time Tracking",
        body : "Monitor your learning milestones and course completion in real-time."
    },
    {
        icon : "/assets/courses.png",
        title : "Premium Content",
        body : "Learn from industry experts with high-quality video and resources."
    }
];

export const Features = () => {
    return (
        <section className="py-20 md:py-32 bg-secondary/30">
            <PageContainer>
                <div className="mb-12">
                    <SectionHeader 
                        title="Everything you need to succeed"
                        subtitle="We provide the best tools to make your learning journey effective and enjoyable."
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {features.map((feature)=>(
                        <div
                            key={feature.title}
                            className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <div className="h-14 w-14 mb-6 rounded-xl bg-primary/10 flex items-center justify-center p-3 group-hover:scale-110 transition-transform duration-300">
                                <div className="relative h-full w-full">
                                    <Image
                                        src={feature.icon}
                                        alt={feature.title}
                                        className="object-contain"
                                        fill
                                    />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.body}</p>
                        </div>
                    ))}
                </div>
            </PageContainer>
        </section>
    )
}
