"use client";

import { RichText as Preview } from "@/components/utils/rich-text";

import Link from "next/link";
import { useRouter } from "next/navigation";


import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { 
    Category,
    SubCategory,
} from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlayCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Stars } from "@/components/rating/stars";
import { PageContainer } from "@/components/ui/page-container";


interface HeaderProps {
    id : string;
    title : string;
    subCategory: SubCategory & { category: Category } | null;
    tutorName: string;
    tutorImage: string|null;
    shortDescription: string;
    tutorProfile: string|null|undefined;
    lastUpdated: Date;
    ratings: number;
    purchases: number;
    avgRating: number;
    isPurchased: boolean;
    previewChapterId?: string;
}

export const Header = ({
    id,
    lastUpdated,
    shortDescription,
    subCategory,
    title,
    tutorImage,
    tutorName,
    tutorProfile,
    avgRating,
    purchases,
    ratings,
    isPurchased,
    previewChapterId
} : HeaderProps) => {
    
    const router = useRouter();
    
    return (
        <PageContainer className="pt-4">
        <header className="relative overflow-hidden rounded-[40px] bg-peri px-6 py-10 sm:px-10 sm:py-12 text-ink">
            <svg aria-hidden="true" viewBox="0 0 150 110" className="pointer-events-none absolute -right-4 -bottom-4 hidden h-64 w-96 opacity-30 md:block" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M30 92 L70 48 L104 82" /><circle cx="112" cy="30" r="16" /><path d="M104 54v10M120 54v10M20 104h120" />
            </svg>
            <div className="relative max-w-3xl space-y-5">
                {/* Breadcrumbs */}
                {subCategory && (
                    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-1.5 text-sm text-ink-2">
                        <Link
                            href={`/categories#${subCategory?.categoryId}`}
                            className="hover:underline underline-offset-4"
                        >
                            { subCategory?.category.name }
                        </Link>
                        <ChevronRight className="size-4" aria-hidden="true" />
                        <Link
                            href={`/category/${subCategory?.id}`}
                            className="hover:underline underline-offset-4"
                        >
                            { subCategory?.name }
                        </Link>
                    </nav>
                )}

                <div className="space-y-4">
                    <h1 className="text-display">
                        {title}
                    </h1>
                    <p className="text-ink-2 text-lg md:text-xl leading-relaxed">
                        {shortDescription}
                    </p>
                </div>

                {/* Ratings & metadata */}
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="inline-flex h-8 items-center gap-x-2 rounded-full bg-white px-3.5">
                        <span className="font-semibold">{avgRating ? avgRating.toFixed(1) : 0}</span>
                        <Stars avgRating={`${avgRating}`} />
                        <span className="text-ink-2">({ratings} ratings)</span>
                    </span>
                    <span className="inline-flex h-8 items-center rounded-full bg-white px-3.5">
                        {purchases} {purchases === 1 ? "learner" : "learners"} enrolled
                    </span>
                    <span className="inline-flex h-8 items-center rounded-full bg-white px-3.5">
                        Updated {lastUpdated.toLocaleDateString("en-IN", { month : "short", year : "numeric" })}
                    </span>
                </div>

                {/* Instructor */}
                <HoverCard>
                    <HoverCardTrigger className="inline-flex items-center gap-x-3 cursor-default md:cursor-pointer">
                        <Avatar className="size-12 ring-2 ring-white">
                            <AvatarImage src={tutorImage||""} />
                            <AvatarFallback className="bg-lilac">{tutorName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-left">
                            <span className="block text-xs text-ink-2">Created by</span>
                            <span className="font-semibold underline underline-offset-4 decoration-ink/30">{tutorName}</span>
                        </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-72 md:w-96 p-4 rounded-3xl border-0 shadow-float" align="start" >
                        <div className="flex items-start gap-x-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={tutorImage||""} />
                                <AvatarFallback className="bg-lilac">{tutorName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-y-2 flex-1">
                                <h2 className="text-foreground font-semibold" >{tutorName}</h2>
                                <div className="text-sm text-muted-foreground line-clamp-3">
                                    <Preview value={tutorProfile||""} />
                                </div>
                            </div>
                        </div>
                    </HoverCardContent>
                </HoverCard>

                {/* Action: owners continue; everyone else can only
                    try the free chapter, if the course has one. */}
                {(isPurchased || previewChapterId) && (
                    <div className="pt-2">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto"
                            onClick={()=>router.push(isPurchased
                                ? `/course/${id}/view`
                                : `/course/${id}/view/chapter/${previewChapterId}`)}
                        >
                            <PlayCircle className="size-5" />
                            {isPurchased ? "Continue learning" : "Preview for free"}
                        </Button>
                    </div>
                )}
            </div>
        </header>
        </PageContainer>
    )
}
