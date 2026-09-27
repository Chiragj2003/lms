"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import { KeyedMutator } from "swr";

import { Course, Rate } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa6";
import { BookOpen, Star } from "lucide-react";
import { toast } from "sonner";
import { useCommentModal } from "@/hooks/use-comment-modal";
import { CourseProgress } from "../courses/ui/course-progress";


interface CardProps {
    course : (Course & {
        _count: {
            chapters: number;
        };
        progress : number|null;
        ratings: Rate[];
    });
    isBestSeller? : boolean;
    className? : string;
    mutate : KeyedMutator<any>
}

export const Card = ({
    course,
    isBestSeller,
    className,
    mutate
} : CardProps ) => {

    const router = useRouter();
    const [activeStar, setActiveStar] = useState( course.ratings[0]?.star||0 );
    const { onOpen } = useCommentModal();
    const stars = [1, 2, 3, 4, 5];

    const handleClick = async (starValue : number ) => {

        if (starValue === activeStar ) return ;
        try {

            setActiveStar( starValue );
            await axios.put(`/api/user/rating`, {
                courseId :course.id,
                star : starValue,
                comment : course?.ratings[0]?.comment||undefined,
            });
            mutate();

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
        }
    }

    return (
        <div
            className={cn(
                "group w-full flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/50 cursor-pointer",
                className
            )}
            onClick={()=>router.push(`/course/${course.id}`)}
        >
            <div className="w-full aspect-video bg-muted overflow-hidden relative">
                <Image
                    src={course.image!}
                    alt={course.title}
                    fill
                    sizes="(min-width: 768px) 20rem, 18rem"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
            
            <div className="flex flex-col flex-1 p-4 md:p-5">
                <h3 className="font-semibold text-foreground line-clamp-2 text-base group-hover:text-primary transition-colors">
                    {course.title}
                </h3>
                
                <div className="flex items-center gap-x-3 mt-4 mb-5">
                    <span className="h-8 w-8 rounded-full shrink-0 bg-primary/10 flex items-center justify-center">
                        <BookOpen className="text-primary h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                        {course._count.chapters} Chapters
                    </span>
                </div>
                
                <div className="mt-auto space-y-4">
                    <CourseProgress value={course.progress||0} variant={course.progress === 100 ? "success" : "default"} size="sm" />
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className='flex items-center gap-x-1'>
                            {
                                stars.map((star, index )=>(
                                    star <= activeStar ? (
                                        <button
                                            key={index}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleClick(star)
                                            }}
                                            className="hover:scale-110 transition-transform"
                                        >
                                            <FaStar className='h-4 w-4 text-amber-500 md:cursor-pointer' />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleClick(star)
                                            }}
                                            key={index}
                                            className="hover:scale-110 transition-transform"
                                        >
                                            <Star className='text-zinc-300 h-4 w-4 hover:text-amber-500 transition-colors md:cursor-pointer' />
                                        </button>
                                    )                   
                                ))
                            }
                        </div>
                        <div
                            className="text-xs text-primary font-medium hover:underline cursor-default md:cursor-pointer"
                            onClick={(e)=>{
                                e.stopPropagation();
                                onOpen(course.ratings[0], mutate, course);
                            }}
                        >
                            { course?.ratings[0]?.comment ? "Update review" : "Write review" }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
