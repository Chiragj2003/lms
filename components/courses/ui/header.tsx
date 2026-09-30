"use client";

import { RichText as Preview } from "@/components/utils/rich-text";

import Link from "next/link";
import Image from "next/image";
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
import { ChevronRight } from "lucide-react";
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
        <header className="bg-zinc-900 border-b border-border py-12 md:py-20 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-highlight/10 rounded-full blur-3xl opacity-50" />
            
            <PageContainer className="relative z-10">
                <div className="flex items-center gap-12">
                    <div className="w-full lg:w-2/3 space-y-6">
                        {/* Breadcrumbs */}
                        {subCategory && (
                            <div className="flex items-center gap-x-2 text-sm">
                                <Link
                                    href={`/categories#${subCategory?.categoryId}`}
                                    className="text-highlight font-semibold hover:text-highlight/80 transition-colors"
                                >
                                    { subCategory?.category.name }
                                </Link>
                                <ChevronRight className="h-4 w-4 text-zinc-500" />
                                <Link
                                    href={`/category/${subCategory?.id}`}
                                    className="text-highlight font-semibold hover:text-highlight/80 transition-colors"
                                >
                                    { subCategory?.name }
                                </Link>
                            </div>
                        )}
                        
                        {/* Title & Description */}
                        <div className="space-y-4 max-w-3xl">
                            <h1 className="text-3xl md:text-5xl lg:text-6xl text-white font-bold tracking-tight">
                                {title}
                            </h1>
                            <p className="text-zinc-300 md:text-xl leading-relaxed">
                                {shortDescription}
                            </p>
                        </div>
                        
                        {/* Ratings & Metadata */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-x-2 bg-zinc-800/50 px-3 py-1.5 rounded-full border border-zinc-700">
                                <span className="text-white font-bold">{avgRating ? avgRating.toFixed(1) : 0}</span>
                                <Stars avgRating={`${avgRating}`} />
                            </div>
                            <span className="text-zinc-400 font-medium">({ratings} ratings)</span>
                            <span className="text-zinc-600 font-medium hidden sm:block">•</span>
                            <span className="text-zinc-400 font-medium">{purchases} Students enrolled</span>
                        </div>
                        
                        {/* Instructor */}
                        <div className="pt-2">
                            <HoverCard>
                                <HoverCardTrigger className="inline-flex items-center gap-x-2 text-zinc-300 cursor-default md:cursor-pointer">
                                    Created by <span className="text-highlight font-semibold underline underline-offset-4 decoration-highlight/30 hover:decoration-highlight transition-all">{tutorName}</span>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-72 md:w-96 p-4 rounded-xl border-border shadow-xl" align="start" >
                                    <div className="flex items-start gap-x-4">
                                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                                            <AvatarImage src={tutorImage||""} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{tutorName?.charAt(0)}</AvatarFallback>
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
                        </div>
                        
                        {/* Action: owners continue; everyone else can only
                            try the free chapter, if the course has one. */}
                        {(isPurchased || previewChapterId) && (
                            <div className="pt-6">
                                <Button
                                    size="lg"
                                    className="h-14 px-8 rounded-xl text-base w-full sm:w-auto"
                                    onClick={()=>router.push(isPurchased
                                        ? `/course/${id}/view`
                                        : `/course/${id}/view/chapter/${previewChapterId}`)}
                                >
                                    {isPurchased ? "Continue learning" : "Preview for free"}
                                </Button>
                            </div>
                        )}
                    </div>
                    
                    {/* Decorative Right Side */}
                    <div className="w-1/3 hidden lg:flex items-center justify-end">
                        <div className="max-w-[400px] w-full relative aspect-square opacity-90 drop-shadow-2xl hover:scale-105 transition-transform duration-500">
                            <Image
                                src="/assets/13923473_04_13_21_05.svg"
                                fill
                                alt="Course illustration"
                                className="object-contain drop-shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </PageContainer>
        </header>
    )
}
