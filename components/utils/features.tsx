import { Abril_Fatface } from "next/font/google";
import Image from "next/image";
import { Heading } from "./heading";

const font =  Abril_Fatface({
    subsets : ["latin"],
    weight : ["400"]
})

const features = [
    {
        icon : "/assets/ai.png",
        title : "AI-Powered Learning",
        body : "AI-Powered Chatbot: Instantly resolve course-related doubts through an intuitive and user-friendly interface, enabling seamless learning support."
    },
    {
        icon : "/assets/notes.png",
        title : "Personalized Note Editor",
        body : "Empower students with an advanced note editor that allows them to add to-dos, embed screenshots, and much more for enhanced organization and productivity."
    },
    {
        icon : "/assets/exam.png",
        title : "Proctored exams",
        body : "Students can take quiz-based exams to assess their learning, identify areas for improvement, and enhance their knowledge in a competitive environment."
    },
    {
        icon : "/assets/certificate.png",
        title : "Digital Certificates",
        body : "Upon course completion, students can generate verifiable certificates to showcase their achievements and skills."
    },
    {
        icon : "/assets/graph.png",
        title : "Real-Time Progress Tracking",
        body : "Students can track their learning milestones, course completion, and assessments in real-time, allowing for continuous feedback and improvement."
    }
];

export const Features = () => {
    return (
        <div className="mt-20 md:pb-20">
            <div className={font.className}>
                <Heading className="text-xl md:text-3xl lg:text-5xl font-[600] text-zinc-700">
                    Goals are the compass, <span className="mark-highlight">learning is the journey.</span>
                </Heading>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 w-full mt-10 gap-6">
                {features.map((feature)=>(
                    <div
                        key={feature.title}
                        className="py-4 h-full md:py-10 px-6 rounded-lg md:rounded-xl border-2 border-zinc-200 border-l-4 border-l-highlight-500 shadow-sm cursor-default transition-shadow hover:shadow-md"
                    >
                        <div className="flex items-center gap-x-4">
                            <div className="h-14 w-14 md:h-20 md:w-20 shrink-0 relative">
                                <Image
                                    src={feature.icon}
                                    alt=""
                                    className="object-cover"
                                    fill
                                />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-zinc-800 font-semibold text-lg">{feature.title}</h3>
                                <p className="text-sm text-zinc-600 text-pretty">{feature.body}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
