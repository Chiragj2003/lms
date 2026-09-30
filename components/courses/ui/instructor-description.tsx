"use client";

import { RichText as Preview } from "@/components/utils/rich-text";

import Image from "next/image";

import { SlBadge } from "react-icons/sl";
import { UsersRound } from "lucide-react";
import { FaCirclePlay } from "react-icons/fa6";
import { cn } from "@/lib/utils";


interface InstructorDescriptionProps {
    tutor: {
        profile: {
            description: string | null;
            headline: string|null;
        } | null;
        id: string;
        image: string | null;
        _count: {
            courses: number;
        };
        name: string | null;
        courses: {
            _count: {
                purchases: number;
                ratings: number;
            };
        }[];
    }
    
}

export const InstructorDescription = ({
    tutor
}: InstructorDescriptionProps ) => {
    
    return (
        <section className="w-full mt-20" >
            <div className="max-w-3xl mx-auto space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Instructor
                </h2>
                <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
                    <div className="space-y-1">
                        <h3 className="text-xl md:text-2xl font-semibold text-primary">{tutor.name}</h3>
                        <p className="text-muted-foreground text-base font-medium">{tutor.profile?.headline}</p>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="relative size-28 md:size-36 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0">
                            {
                                tutor.image ? (
                                    <Image
                                        src={tutor.image}
                                        alt={tutor.name||"Instructor"}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl font-bold text-muted-foreground">
                                        {tutor.name?.charAt(0)??"I"}
                                    </span>
                                )
                            }
                        </div>
                        <div className="flex flex-col gap-y-3">
                            <div className="flex items-center gap-x-4 text-foreground font-medium">
                                <SlBadge className="size-5" fill="#27272a" />
                                <span className="text-sm">{tutor.courses.reduce((prev, curr)=>{
                                    return prev+curr._count.ratings
                                }, 0).toLocaleString()} Reviews</span>
                            </div>
                            <div className="flex items-center gap-x-4 text-foreground font-medium">
                                <UsersRound className="size-5" fill="#27272a" />
                                <span className="text-sm">{tutor.courses.reduce((prev, curr)=>{
                                    return prev+curr._count.purchases
                                }, 0).toLocaleString()} Students</span>
                            </div>
                            <div className="flex items-center gap-x-4 text-foreground font-medium">
                                <FaCirclePlay className="size-5" fill="#27272a" />
                                <span className="text-sm">{tutor._count.courses} Courses</span>
                            </div>
                        </div>
                    </div>
                    <div 
                        className="text-muted-foreground prose prose-zinc max-w-none relative h-auto mt-6"
                    >
                        <Preview value={tutor.profile?.description??""}/>
                    </div>
                </div>
            </div>
        </section>
    )
}
