"use client"

import { Badge } from "@/components/ui/badge"
import { Course } from "@prisma/client"
import { ImageIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface CourseTutorCardProps {
    course : Course
}

export const CourseTutorCard = ({
    course
} : CourseTutorCardProps) => {

    const router = useRouter();

    return (
        <div
            onClick={()=>router.push(`/tutor/courses/${course.id}`)}
            className="group w-full flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/50 cursor-pointer"
        >
            <div className="w-full aspect-video bg-muted overflow-hidden relative">
                {
                    course.image ? (
                        <>
                            <Image
                                src={course.image}
                                alt={course.title}
                                fill
                                sizes="(min-width: 768px) 20rem, 18rem"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </>
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-muted">
                            <ImageIcon className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    )
                }
            </div>
            
            <div className="flex flex-col flex-1 p-4 md:p-5">
                <h3 className="font-semibold text-foreground line-clamp-2 text-base group-hover:text-primary transition-colors">
                    {course.title}
                </h3>
                
                <div className="mt-auto pt-4">
                    <Badge variant={course.isPublished ? "success" : "secondary"}>
                        {
                            course.isPublished ? "Published" : "Draft"
                        }
                    </Badge>
                </div>
            </div>
        </div>
    )
}
