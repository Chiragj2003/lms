"use client";

import { useSWRQuery } from "@/hooks/useSWRQuery";
import { Loader2 } from "lucide-react";
import { FaStar } from "react-icons/fa6";
import { KeyedMutator } from "swr";
import { RatingGraph } from "./rating-graph";
import { Heading } from "../utils/heading";


interface RateSummary {
    _count: number;
    _avg: {
        star: number | null;
    };
}

interface RateGroupBy {
    star: number;
    _count: {
      star: number;
    };
}

interface Resposne {
    data : { summary : RateSummary, group : RateGroupBy[] },
    error : any;
    isLoading : boolean;
}

interface AggregatedReviewProps {
    courseId: string;
}

export const AggregatedReview = ({
    courseId
} : AggregatedReviewProps ) => {
    
    const { data, error, isLoading }: Resposne = useSWRQuery(`/api/courses/${courseId}/review/aggregate`);

    if (error) {
        return null;
    }

    if ( isLoading ) {
        return (
            <div className="flex items-center justify-center w-full">
                <Loader2 className="size-8 text-ink animate-spin" />
            </div>
        )
    }

    
    return (
        <div className="space-y-4">
            <Heading className="text-xl font-medium tracking-tight text-ink">Course reviews</Heading>
            <div className="w-full flex flex-col sm:flex-row gap-5 rounded-3xl bg-soft p-5">
                <div className="flex sm:flex-col items-center sm:items-start justify-center gap-2 sm:w-32 shrink-0">
                    <span className="text-5xl font-medium tracking-tight text-ink">
                        { (data.summary._avg.star || 0).toFixed(1) }
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-ink-2">
                        <FaStar className="text-[#e6b838] size-4" aria-hidden />
                        {data.summary._count} {data.summary._count === 1 ? "review" : "reviews"}
                    </span>
                </div>
                <div className="flex-1 space-y-2 w-full">
                    <RatingGraph
                        label={5}
                        reviews={data.group.find((value)=>value.star===5)?._count.star || 0}
                        total={data.summary._count}
                        className = "bg-ink"
                    />
                    <RatingGraph
                        label={4}
                        reviews={data.group.find((value)=>value.star===4)?._count.star || 0}
                        total={data.summary._count}
                        className = "bg-ink"
                    />
                    <RatingGraph
                        label={3}
                        reviews={data.group.find((value)=>value.star===3)?._count.star || 0}
                        total={data.summary._count}
                        className = "bg-ink"
                    />
                    <RatingGraph
                        label={2}
                        reviews={data.group.find((value)=>value.star===2)?._count.star || 0}
                        total={data.summary._count}
                        className = "bg-ink"
                    />
                    <RatingGraph
                        label={1}
                        reviews={data.group.find((value)=>value.star===1)?._count.star || 0}
                        total={data.summary._count}
                        className = "bg-ink"
                    />
                </div>
            </div>
        </div>
        
    )
}
