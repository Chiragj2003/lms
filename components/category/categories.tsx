"use client";

import Link from "next/link";
import Image from "next/image";
import { useSWRQuery } from "@/hooks/useSWRQuery";
import { Category } from "@prisma/client";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PageContainer } from "../ui/page-container";
import { toneFor } from "@/lib/tones";
import { categoryArt } from "@/lib/category-art";
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
                                "group relative isolate flex min-h-52 flex-col justify-between overflow-hidden rounded-3xl p-5 text-ink transition-transform duration-300 hover:-translate-y-0.5",
                                toneFor(index).bg
                            )}
                        >
                            {/* Category artwork, drifting a little on hover */}
                            <Image
                                src={categoryArt(category.name, index)}
                                alt=""
                                width={1200}
                                height={800}
                                sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-4 bottom-0 -z-10 h-full w-auto max-w-none object-contain transition-transform duration-500 group-hover:-translate-x-2 group-hover:scale-105"
                            />
                            <div className="flex items-start justify-end">
                                <span className="size-9 rounded-full bg-white flex items-center justify-center transition-transform duration-300 group-hover:rotate-45" aria-hidden="true">
                                    <ArrowUpRight className="size-4" />
                                </span>
                            </div>
                            <div className="max-w-[50%]">
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
