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
            <section className="my-20 w-full">
                <div className="max-w-3xl mx-auto space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
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
                        className="w-full h-12 rounded-xl text-sm font-semibold text-foreground border-border hover:bg-muted/50"
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
