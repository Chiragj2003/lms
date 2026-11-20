"use client";

import Link from "next/link";
import { useSWRQuery } from "@/hooks/useSWRQuery";
import { Category } from "@prisma/client";
import { ArrowRight, ArrowUpRight, GraduationCap } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PageContainer } from "../ui/page-container";
import { toneFor } from "@/lib/tones";
import { cn } from "@/lib/utils";


interface Response {
    data : (Category & { _count : {
        courses : number
    }})[];
    error : any;
    isLoading : boolean;
}

export const Categories = () => {

    const {data, error, isLoading}: Response = useSWRQuery('/api/public/category');

    const categories = Array.isArray(data) ? data.slice(0, 6) : [];
    const shouldRenderSkeleton = isLoading || (!isLoading && !Array.isArray(data));

    if ( error ) {
        return null;
    }

    return (
        <section className="py-16 md:py-20">
            <PageContainer>
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div className="space-y-2">
                        <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-2">Explore</p>
                        <h2 className="text-display-sm">Top categories</h2>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/categories">
                            All categories
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    { shouldRenderSkeleton ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-48 rounded-3xl" />
                        ))
                    ) : categories.map((category, index) => (
                        <Link
                            key={category.id}
                            href={`/category/${category.id}`}
                            className={cn(
                                "group relative flex min-h-48 flex-col justify-between rounded-3xl p-5 text-ink transition-transform duration-300 hover:-translate-y-0.5",
                                toneFor(index).bg
                            )}
                        >
                            <div className="flex items-start justify-between">
                                <span className="size-14 rounded-full bg-ink text-white flex items-center justify-center" aria-hidden="true">
                                    <GraduationCap className="size-6" />
                                </span>
                                <span className="size-9 rounded-full bg-white/60 flex items-center justify-center transition-transform duration-300 group-hover:rotate-45" aria-hidden="true">
                                    <ArrowUpRight className="size-4" />
                                </span>
                            </div>
                            <div>
                                <h3 className="text-xl font-medium tracking-tight">{category.name}</h3>
                                <p className="text-sm text-ink-2">
                                    {category._count.courses} {category._count.courses === 1 ? "course" : "courses"}
                                </p>
                            </div>
                        </Link>
                    )) }
                </div>
            </PageContainer>
        </section>
    )
}
