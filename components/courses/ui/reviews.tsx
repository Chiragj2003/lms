"use client";

import { Rate } from "@prisma/client";
import { ReviewCard } from "./review-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CourseReviewModal } from "@/components/modals/course-review.modal";

interface ReviewsProps {
    reviews : (Rate & { user: {
        image: string | null;
        name: string | null;
    }})[];
    courseId: string
}

export const Reviews = ({
    reviews,
    courseId
}: ReviewsProps ) => {

    const [open, setOpen] = useState(false);

    return (
        <>
            <section className="w-full rounded-[32px] bg-white p-5 sm:p-8">
                <div className="w-full space-y-6">
                    <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-ink">
                        Course Reviews
                    </h2> 
                    <div className="flex flex-col space-y-4">
                        {
                            reviews.map((review)=>(
                                <ReviewCard key={review.id} review={review} />
                            ))
                        }
                    </div>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={()=>setOpen(true)}
                    >
                        See All Reviews
                    </Button>
                </div>
            </section>
            <CourseReviewModal
                courseId={courseId}
                isOpen={open}
                onClose={()=>setOpen(false)}
            />
        </>
    )
}
