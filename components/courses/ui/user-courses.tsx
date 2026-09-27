"use client";

import Image from "next/image"; 
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
        <section className="py-12">
            <PageContainer>
                <div className="mb-10">
                    <SectionHeader 
                        title="Enrolled Courses"
                        subtitle="Pick up where you left off or start a new chapter."
                    />
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                                    <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 w-full py-16 flex flex-col items-center justify-center bg-card border border-border rounded-2xl">
                                        <div className="relative h-40 aspect-square opacity-60 mb-6">
                                            <Image
                                                src="/assets/empty.jpg"
                                                fill
                                                alt="No courses"
                                                className="object-contain"
                                            />
                                        </div>
                                        <h3 className="text-xl font-semibold text-foreground mb-2">No courses yet</h3>
                                        <p className="text-muted-foreground text-center max-w-md">
                                            You haven&apos;t enrolled in any courses yet. Check out our wide range of courses and enroll today!
                                        </p>
                                    </div>
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
