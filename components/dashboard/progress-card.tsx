"use client";

import { Course } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { CourseProgress } from "../courses/ui/course-progress";
import { BookOpen } from "lucide-react";

interface ProgressCardProps {
    course : Course & { progress : number|null, _count: {
        chapters: number;
    }}
}

export const ProgressCard = ({
    course
}: ProgressCardProps ) => {

    return (
        <Link
            href={`/course/${course.id}/view`}
            className="group w-full flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
            <div className="w-full aspect-video relative bg-muted overflow-hidden">
                {course.image && (
                    <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        sizes="(min-width: 768px) 20rem, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                )}
            </div>
            <div className="w-full space-y-3 p-4 md:p-5">
                <h3 className="font-semibold text-foreground line-clamp-2 text-base group-hover:text-primary transition-colors">{course.title}</h3>
                <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4 text-primary" />
                    {course._count.chapters} {course._count.chapters === 1 ? "chapter" : "chapters"}
                </div>
                <CourseProgress value={course.progress||0} variant="default" size="sm" />
            </div>
        </Link>
    )
}
