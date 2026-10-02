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
import { Separator } from "@/components/ui/separator";
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
        <div className="w-full px-6 md:px-10 pb-10 pt-6">
            <div className="w-full flex flex-col gap-y-8">
                <h1 className="text-zinc-700 text-lg md:text-xl font-medium">
                    {shortDescription}
                </h1>
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start gap-4 gap-x-10">
                        <div className="flex flex-col">
                            <span className="text-zinc-800 font-semibold">{purchases}</span>
                            <span className="text-zinc-600 text-xs font-medium">
                                students
                            </span>
                        </div>
                    </div>
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
                </div>
                <div className="flex items-center gap-x-3">
                    <FaCircleInfo className="h-5 w-5" />
                    <span className="text-base font-medium">Last updated {format(updatedAt, "MMMM yyyy")}</span>
                </div>
            </div>
            <Separator className="mt-8 text-zinc-300"/>
            <div className="mt-8 space-y-6 w-full">
                <div className="flex items-center gap-x-6">
                    <div className="h-14 w-14 shrink-0 relative">
                        <Image
                            src="/assets/certificate.png"
                            alt=""
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl text-zinc-700 font-semibold">Certificate</h2>
                        <p className="text-sm text-muted-foreground">Earn your LearnIt certificate by completing every chapter.</p>
                    </div>
                </div>
                <div className="w-full">
                    <Button
                        className="w-full font-semibold"
                        variant="outline"
                        disabled={!certificate}
                        onClick={()=>router.push(`/certificate/${certificate?.id}`)}
                    >
                        {certificate ? "View your certificate" : "Complete every chapter to unlock"}
                    </Button>
                </div>
            </div>
            <Separator className="mt-8 text-zinc-300"/>
            {
                quizId && (
                    <>
                        <div className="mt-8 space-y-6 w-full">
                        <div className="flex items-center gap-x-6">
                            <div className="h-14 w-14 shrink-0 relative">
                                <Image
                                    src="/assets/exam.png"
                                    alt=""
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h2 className="text-xl text-zinc-700 font-semibold">Quiz</h2>
                                <p className="text-sm text-zinc-700 font-medium">Take a quiz to test and enhance your knowledge.</p>
                            </div>
                        </div>
                        <div className="w-full">
                            <Button
                                className="w-full font-semibold"
                                variant="outline"
                                // Was gated on having a certificate (copied from the
                                // button above), which hid the quiz until the whole
                                // course was finished; owning the course is enough.
                                disabled={!isPurchased}
                                onClick={()=>router.push( quizResultId? `/course/${courseId}/quiz/${quizId}/result` : `/course/${courseId}/quiz/${quizId}`)}
                            >
                                { quizResultId ? "View result" : "Take test" }
                            </Button>
                        </div>
                    </div>
                    <Separator className="mt-8 text-zinc-300"/>
                    </>
                )
            }
            <div className="mt-8 space-y-3 w-full">
                <div className="flex items-center gap-x-6">
                    <div className="h-14 w-14 shrink-0 relative">
                        <Image
                            src="/assets/about.png"
                            alt=""
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl text-zinc-700 font-semibold">Chapter Description</h2>
                    </div>
                </div>
                <Preview value={description} />
            </div>
            <Separator className="mt-8 text-zinc-300"/>
            <div className="mt-8 space-y-3 w-full">
                <div className="flex items-start gap-x-6">
                    <div className="h-14 w-14 shrink-0 relative">
                        <Image
                            src="/assets/avatar.png"
                            alt=""
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl text-zinc-700 font-semibold">{tutor.name}</h2>
                        <p className="text-sm text-zinc-700 font-medium">{tutor.profile?.headline || "Instructor"}</p>
                        <div className="flex items-center justify-start flex-wrap gap-4 mt-4">
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
                                            className="h-9 w-9 rounded-md bg-muted flex items-center justify-center hover:bg-accent transition-colors"
                                        >
                                            <Icon className={`h-6 w-6 ${className}`} aria-hidden />
                                        </a>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
                <Preview value={tutor.profile?.description||""} />
            </div>
        </div>
    )
}
