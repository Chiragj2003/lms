"use client";

import { useRouter } from "next/navigation";
import { useSWRQuery } from "@/hooks/useSWRQuery";
import { Category } from "@prisma/client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from '@/components/ui/carousel';
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "../ui/page-container";
import { SectionHeader } from "../ui/section-header";
import { GraduationCap } from "lucide-react";


interface Response {
    data : (Category & { _count : {
        courses : number
    }})[];
    error : any;
    isLoading : boolean;
}

export const Categories = () => {
    
    const router = useRouter();
    const {data, error, isLoading}: Response = useSWRQuery('/api/public/category');

    const categories = Array.isArray(data) ? data : [];
    const shouldRenderSkeleton = isLoading || (!isLoading && !Array.isArray(data));
    
    if ( error ) {
        return null;
    }

    return (
        <section className="py-20 bg-background">
            <PageContainer>
                <div className="mb-10">
                    <SectionHeader 
                        title="Top Categories"
                        subtitle="Explore our wide range of professional courses."
                    />
                </div>
                <div className="relative">
                    <Carousel
                        className="w-full"
                        opts = {{
                            align : "start",
                            slidesToScroll : "auto"
                        }}
                    >
                        <CarouselContent className="-ml-4">
                            { shouldRenderSkeleton ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <CarouselItem key={i} className="pl-4 basis-auto" >
                                        <div className="flex items-center gap-4 p-4 pr-8 rounded-2xl border border-border bg-card">
                                            <Skeleton className="h-12 w-12 rounded-xl" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-3 w-16" />
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))
                                ) : categories.map((category) => (
                                    <CarouselItem key={category.id} className="pl-4 basis-auto cursor-pointer" >
                                        <div 
                                            className="group flex items-center gap-4 p-4 pr-10 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-sm transition-all"
                                            onClick={()=>router.push(`/category/${category.id}`)}
                                        >
                                            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                                <GraduationCap className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{category.name}</h3>
                                                <p className="text-sm text-muted-foreground">{category._count.courses} Courses</p>
                                            </div>
                                        </div>
                                    </CarouselItem>
                            )) }
                        </CarouselContent>
                        <div className="hidden md:block">
                            <CarouselPrevious className="-left-4 shadow-md bg-white hover:bg-zinc-50 border-border" />
                            <CarouselNext className="-right-4 shadow-md bg-white hover:bg-zinc-50 border-border" />
                        </div>
                    </Carousel>
                </div>
            </PageContainer>
        </section>
    )
}
