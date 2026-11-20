import { Award, BarChart3, NotebookPen, PlayCircle, Sparkles, SquareCheckBig } from "lucide-react";
import { PageContainer } from "../ui/page-container";
import { cn } from "@/lib/utils";

const features = [
    {
        icon : PlayCircle,
        title : "Chapter-by-chapter video",
        body : "Watch short chapters and pick up exactly where you left off.",
        tone : "bg-peri",
    },
    {
        icon : Sparkles,
        title : "AI study assistant",
        body : "Ask about the chapter you're watching and get answers in context.",
        tone : "bg-lilac",
    },
    {
        icon : NotebookPen,
        title : "Notes & sketch canvas",
        body : "Take notes or draw on a whiteboard beside every chapter.",
        tone : "bg-peach",
    },
    {
        icon : SquareCheckBig,
        title : "Chapter quizzes",
        body : "Check what stuck before moving on to the next chapter.",
        tone : "bg-sun",
    },
    {
        icon : Award,
        title : "Certificates",
        body : "Finish a course and download a certificate you can share.",
        tone : "bg-mint",
    },
    {
        icon : BarChart3,
        title : "Progress tracking",
        body : "See what's done, what's next and how much is left.",
        tone : "bg-aqua",
    }
];

export const Features = () => {
    return (
        <section className="py-16 md:py-20">
            <PageContainer>
                <div className="rounded-[32px] bg-white p-6 sm:p-10">
                    <div className="mb-8 max-w-2xl space-y-2">
                        <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-2">Why LearnIt</p>
                        <h2 className="text-display-sm">Everything a course needs, in one place</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((feature)=>(
                            <div
                                key={feature.title}
                                className={cn("flex min-h-56 flex-col gap-3 rounded-3xl p-6 text-ink", feature.tone)}
                            >
                                <span className="size-14 rounded-full bg-ink text-white flex items-center justify-center" aria-hidden="true">
                                    <feature.icon className="size-6" />
                                </span>
                                <h3 className="mt-auto text-xl font-medium tracking-tight">{feature.title}</h3>
                                <p className="text-sm text-ink-2 leading-relaxed">{feature.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </PageContainer>
        </section>
    )
}
