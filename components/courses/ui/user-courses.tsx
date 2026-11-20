"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { KeyedMutator } from "swr";

import { useSWRQuery } from "@/hooks/useSWRQuery";
import { Course, Rate } from "@prisma/client";
import { CardSkeleton } from "./card-skeleton";
import { Card } from "@/components/rating/card";
import { PageContainer } from "@/components/ui/page-container";
import { SectionHeader } from "@/components/ui/section-header";

interface Response {
    data : (Course & {
        _count: {
            chapters: number;
        };
        progress : number|null;
        ratings: Rate[];
    })[];
    error : any
    isLoading : boolean;
    mutate : KeyedMutator<any>;
}

export const UserCourses = () => {
    
    const { data, error, isLoading, mutate } : Response = useSWRQuery("/api/user/courses");

    if (error) {
        return null;
    }

    return (
        <section className="pt-8">
            <PageContainer>
                <div className="mb-5">
                    <SectionHeader
                        title="My courses"
                        subtitle="Pick up where you left off or start a new chapter."
                    />
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {
                        isLoading ? (
                            <>
                                <CardSkeleton className="w-full" />
                                <CardSkeleton className="w-full" />
                                <CardSkeleton className="w-full" />
                                <CardSkeleton className="w-full" />
                            </>
                        ) : (
                            <>
                                {data.length === 0 && (
                                    <EmptyState
                                        className="sm:col-span-2 lg:col-span-3 xl:col-span-4 w-full rounded-[32px] bg-white py-14"
                                        illustration="/assets/illustrations/no-courses.webp"
                                        title="No courses yet"
                                        description="Courses you buy show up here, ready to resume."
                                        action={
                                            <Button asChild>
                                                <Link href="/search">Browse courses</Link>
                                            </Button>
                                        }
                                    />
                                )} 
                                {
                                    data.map(course=>(
                                        <Card
                                            course={course}
                                            key={course.id}
                                            mutate={mutate}
                                        />
                                    ))
                                }
                            </>
                        )
                    }
                </div>
            </PageContainer>
        </section>
    )
}
