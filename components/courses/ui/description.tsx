"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
interface DescriptionProps {
    description : string;
}

export const Description = ({
    description
} : DescriptionProps ) => {

    const Preview = useMemo(()=>dynamic(()=>import("@/components/utils/preview"), {ssr:false}), []);
    const [ fullContent, setFullContent ] = useState(false);

    const toggleView = ()=>setFullContent((prev)=>!prev);

    return (
        <section className="mt-20 w-full">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Course Description
                </h2>
                <div 
                    className={cn(
                        "text-muted-foreground prose prose-zinc max-w-none relative h-72 overflow-hidden mt-6",
                        fullContent && "h-auto"
                    )}
                >
                    <Preview value={description} />
                    {
                        !fullContent && (
                            <div className="bg-gradient-to-b from-transparent to-white h-28 w-full absolute bottom-0 left-0"/>
                        )
                    }
                </div>
                <div
                    onClick={toggleView}
                    className="cursor-default md:cursor-pointer font-semibold text-green-600 hover:drop-shadow-lg transition-all"
                    role="button"
                >
                    {
                        fullContent ? "Show less" : "Show more"
                    }
                </div>
            </div>
        </section>
    )
}
