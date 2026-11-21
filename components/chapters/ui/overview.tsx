"use client";

import Image from "next/image";
import { format } from "date-fns";

import { 
    FaCircleInfo, 
    FaLinkedin, 
    FaGithub,
    FaXTwitter,
    FaYoutube
} from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";
import { IoMdLink } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { RichText as Preview } from "@/components/utils/rich-text";
import { Cerificate, UserProgress } from "@prisma/client";
import { CourseProgressButton } from "@/components/courses/ui/course-progress-button";
import { useRouter } from "next/navigation";

// Only plain web links are rendered; older rows were saved without validation.
const safeLink = (value : string | null | undefined) => {
    if (!value) return null;
    try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
    } catch {
        return null;
    }
};

const SOCIAL_LINKS = [
    { key : "linkedinLink", label : "LinkedIn", icon : FaLinkedin, className : "text-[#0072b1]" },
    { key : "githubLink", label : "GitHub", icon : FaGithub, className : "text-neutral-900" },
    { key : "facebookLink", label : "Facebook", icon : FaFacebookSquare, className : "text-[#4267B2]" },
    { key : "twitterLink", label : "X", icon : FaXTwitter, className : "text-zinc-900" },
    { key : "youtubeLink", label : "YouTube", icon : FaYoutube, className : "text-red-600" },
    { key : "websiteLink", label : "their website", icon : IoMdLink, className : "text-zinc-800" },
] as const;


interface OverviewProps {
    chapterId : string;
    courseId : string;
    shortDescription : string;
    ratings : number;
    purchases : number;
    description : string;
    updatedAt : Date;
    tutor : {
        name: string|null;
        image: string|null;
        profile : {
            description: string|null;
            headline : string|null;
            facebookLink : string|null;
            githubLink : string|null;
            websiteLink : string|null;
            linkedinLink : string|null;
            twitterLink : string|null;
            youtubeLink :string|null;
        }|null;
    };
    isPurchased : boolean;
    nextChapterId? : string;
    userProgress: UserProgress|null;
    certificate: Cerificate|null;
    quizId? : string;
    quizResultId? : string;
}

export const Overview = ({
    chapterId,
    courseId,
    description,
    purchases,
    ratings,
    shortDescription,
    tutor,
    updatedAt,
    isPurchased,
    nextChapterId,
    userProgress,
    certificate,
    quizId,
    quizResultId
} : OverviewProps) => {

    const router = useRouter();

    return (
        <div className="w-full divide-y divide-border">
            {/* About */}
            <div className="pb-7 space-y-4">
                <h1 className="text-ink text-xl md:text-2xl font-medium tracking-tight">
                    {shortDescription}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="inline-flex h-8 items-center rounded-full bg-soft px-3 font-medium text-ink">
                        {purchases} {purchases === 1 ? "student" : "students"}
                    </span>
                    <span className="inline-flex h-8 items-center gap-2 rounded-full bg-soft px-3 text-ink-2">
                        <FaCircleInfo className="size-3.5" aria-hidden />
                        Last updated {format(updatedAt, "MMMM yyyy")}
                    </span>
                </div>
            </div>

            {/* Chapter description */}
            <div className="py-7 space-y-3">
                <div className="flex items-center gap-x-4">
                    <div className="size-14 shrink-0 relative rounded-full bg-peri-soft p-2.5">
                        <Image src="/assets/about.png" alt="" fill className="object-contain p-2.5" />
                    </div>
                    <h2 className="text-xl text-ink font-medium tracking-tight">Chapter description</h2>
                </div>
                <Preview value={description} />
            </div>

            {/* Instructor */}
            <div className="py-7 space-y-3">
                <div className="flex items-start gap-x-4">
                    <div className="size-14 shrink-0 relative rounded-full bg-peri-soft p-2.5">
                        <Image src="/assets/avatar.png" alt="" fill className="object-contain p-2.5" />
                    </div>
                    <div>
                        <h2 className="text-xl text-ink font-medium tracking-tight">{tutor.name}</h2>
                        <p className="text-sm text-muted-foreground">{tutor.profile?.headline || "Instructor"}</p>
                        <div className="flex items-center justify-start flex-wrap gap-2 mt-3">
                            {
                                SOCIAL_LINKS.map(({ key, label, icon : Icon, className }) => {
                                    const href = safeLink(tutor.profile?.[key]);
                                    if (!href) return null;
                                    return (
                                        <a
                                            key={key}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`${tutor.name || "Instructor"} on ${label}`}
                                            className="size-9 rounded-full bg-soft flex items-center justify-center hover:bg-frame transition-colors"
                                        >
                                            <Icon className={`size-5 ${className}`} aria-hidden />
                                        </a>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
                <Preview value={tutor.profile?.description||""} />
            </div>

            {/* Quiz */}
            {
                quizId && (
                    <div className="py-7 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-x-4 flex-1">
                            <div className="size-14 shrink-0 relative rounded-full bg-peri-soft p-2.5">
                        <Image src="/assets/exam.png" alt="" fill className="object-contain p-2.5" />
                    </div>
                            <div>
                                <h2 className="text-xl text-ink font-medium tracking-tight">Quiz</h2>
                                <p className="text-sm text-muted-foreground">Test what you learned in this chapter.</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="sm:w-48"
                            // Owning the course is enough to take the quiz.
                            disabled={!isPurchased}
                            onClick={()=>router.push( quizResultId? `/course/${courseId}/quiz/${quizId}/result` : `/course/${courseId}/quiz/${quizId}`)}
                        >
                            { quizResultId ? "View result" : "Take test" }
                        </Button>
                    </div>
                )
            }

            {/* Progress and certificate, last */}
            <div className="pt-7 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-x-4 flex-1">
                    <div className="size-14 shrink-0 relative rounded-full bg-peri-soft p-2.5">
                        <Image src="/assets/certificate.png" alt="" fill className="object-contain p-2.5" />
                    </div>
                    <div>
                        <h2 className="text-xl text-ink font-medium tracking-tight">Certificate</h2>
                        <p className="text-sm text-muted-foreground">
                            {certificate ? "You've earned it. Nice work!" : "Complete every chapter to earn your LearnIt certificate."}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    {
                        isPurchased && (
                            <CourseProgressButton
                                chapterId={chapterId}
                                courseId={courseId}
                                nextChapterId={nextChapterId}
                                isCompleted={!!userProgress?.isCompleted}
                                certificate={!!certificate}
                            />
                        )
                    }
                    {
                        certificate && (
                            <Button
                                variant="outline"
                                onClick={()=>router.push(`/certificate/${certificate.id}`)}
                            >
                                View certificate
                            </Button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
