"use client"

import useSWRInfinite from "swr/infinite";
import { format } from "date-fns";
import { Rate } from "@prisma/client";
import { FaStar } from "react-icons/fa6";
import { Star } from "lucide-react";

import fetcher from "@/lib/fetcher";
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";

type Review = Rate & { user : { id: string, name: string|null, image: string|null } };

interface ReviewsPage {
    items : Review[];
    nextCursor : string|null;
}

interface ReviewsProps {
    courseId: string;
}

const PAGE_SIZE = 10;
const stars = [1, 2, 3, 4, 5];

export const Reviews = ({
    courseId
} : ReviewsProps ) => {

    // Newest first, ten at a time; "Show more" fetches the next page.
    const getKey = (index : number, previous : ReviewsPage | null) => {
        if (previous && !previous.nextCursor) return null;
        const cursor = previous?.nextCursor ? `&cursor=${previous.nextCursor}` : "";
        return `/api/courses/${courseId}/review?take=${PAGE_SIZE}${cursor}`;
    };

    const { data, error, isLoading, isValidating, size, setSize } = useSWRInfinite<ReviewsPage>(getKey, fetcher, {
        revalidateFirstPage : false,
        revalidateOnFocus : false,
    });

    const reviews = data?.flatMap((page) => page.items) ?? [];
    const hasMore = !!data?.[data.length - 1]?.nextCursor;
    const loadingMore = isValidating && size > (data?.length ?? 0);

    if (isLoading || error || reviews.length === 0) {
        return null;
    }

    return (
        <div
            className="mt-10 space-y-6 w-full"
        >
            <h2 className="font-semibold text-foreground md:text-lg">Reviews</h2>
            {
                reviews.map((review)=>(
                    <div key={review.id} className="w-full">
                        <div className="flex items-start w-full gap-x-6 mb-2">
                            <div className="h-8 md:h-10 aspect-square shrink-0">
                                <Avatar className="h-full w-full">
                                    <AvatarImage src={review.user?.image||""} alt="" />
                                    <AvatarFallback className="bg-muted text-muted-foreground font-semibold md:text-lg" >{review.user.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-base text-foreground font-semibold" >{review.user?.name}</h3>
                                    <div className="flex items-center flex-wrap gap-x-6">
                                        <div className="flex gap-x-0.5 items-center" aria-label={`${review.star ?? 0} out of 5 stars`}>
                                            { stars.map((value)=>(
                                                value <= (review?.star || 0) ? (
                                                    <FaStar
                                                        key={value}
                                                        className="h-4 w-4 text-amber-500"
                                                        aria-hidden
                                                    />
                                                ) : (
                                                    <Star
                                                        key={value}
                                                        className="h-4 w-4 text-muted-foreground"
                                                        aria-hidden
                                                    />
                                                )
                                            )) }
                                        </div>
                                        <p className="text-muted-foreground text-xs font-semibold">
                                            { format(review.createdAt, "dd LLL yyyy")}
                                        </p>
                                    </div>
                                </div>
                                {
                                    review.comment && (
                                        <p className="text-sm text-foreground whitespace-pre-wrap">
                                            {review.comment}
                                        </p>
                                    )
                                }
                            </div>
                        </div>
                        <Separator/>
                    </div>
                ))
            }
            {
                hasMore && (
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setSize(size + 1)}
                        disabled={loadingMore}
                    >
                        {loadingMore ? "Loading…" : "Show more reviews"}
                    </Button>
                )
            }
        </div>
    )
}
