"use client";

import { Course } from "@prisma/client";
import { toneFor } from "@/lib/tones";
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
            className="group w-full flex flex-col bg-white rounded-[28px] p-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
            <div className={`w-full aspect-video relative rounded-[22px] overflow-hidden ${toneFor(course.id).bg}`}>
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
            <div className="w-full space-y-3 px-2.5 pt-4 pb-2">
                <h3 className="font-medium text-ink line-clamp-2 text-lg leading-snug tracking-tight">{course.title}</h3>
                <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4 text-ink" />
                    {course._count.chapters} {course._count.chapters === 1 ? "chapter" : "chapters"}
                </div>
                <CourseProgress value={course.progress||0} variant="default" size="sm" />
            </div>
        </Link>
    )
}
