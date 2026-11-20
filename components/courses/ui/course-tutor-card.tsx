"use client"

import { Badge } from "@/components/ui/badge"
import { Course } from "@prisma/client"
import { ImageIcon, Pencil } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { toneFor } from "@/lib/tones"

interface CourseTutorCardProps {
    course : Course
}

export const CourseTutorCard = ({
    course
} : CourseTutorCardProps) => {

    return (
        <Link
            href={`/tutor/courses/${course.id}`}
            className="group w-full flex flex-col bg-white rounded-[28px] p-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
        >
            <div className={cn("w-full aspect-video rounded-[22px] overflow-hidden relative", toneFor(course.id).bg)}>
                {
                    course.image ? (
                        <Image
                            src={course.image}
                            alt=""
                            fill
                            sizes="(min-width: 768px) 20rem, 18rem"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center">
                            <span className="size-14 rounded-full bg-ink text-white flex items-center justify-center">
                                <ImageIcon className="size-6" aria-hidden="true" />
                            </span>
                        </div>
                    )
                }
                <Badge variant={course.isPublished ? "success" : "warning"} className="absolute left-3 top-3">
                    {course.isPublished ? "Published" : "Draft"}
                </Badge>
            </div>

            <div className="flex flex-1 items-start justify-between gap-3 px-2.5 pt-4 pb-2">
                <h3 className="font-medium text-ink line-clamp-2 text-lg leading-snug tracking-tight">
                    {course.title}
                </h3>
                <span aria-hidden="true" className="size-9 shrink-0 rounded-full bg-soft text-ink flex items-center justify-center transition-colors group-hover:bg-ink group-hover:text-white">
                    <Pencil className="size-4" />
                </span>
            </div>
        </Link>
    )
}
