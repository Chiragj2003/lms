"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { RichText } from "@/components/utils/rich-text";

interface DescriptionProps {
    description : string;
}

const COLLAPSED_HEIGHT = 288; // px, matches max-h-72

export const Description = ({
    description
} : DescriptionProps ) => {

    const contentRef = useRef<HTMLDivElement|null>(null);
    const [ expanded, setExpanded ] = useState(false);
    const [ overflows, setOverflows ] = useState(false);

    // Short descriptions used to sit in a fixed 288px box with a "Show more"
    // that revealed nothing; only collapse when the text is actually longer.
    useEffect(()=>{
        const node = contentRef.current;
        if (!node) return;
        const observer = new ResizeObserver(()=>{
            setOverflows(node.scrollHeight > COLLAPSED_HEIGHT + 1);
        });
        observer.observe(node);
        return ()=>observer.disconnect();
    }, []);

    const collapsed = overflows && !expanded;

    return (
        <section className="w-full">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Course Description
                </h2>
                <div
                    className={cn(
                        "text-muted-foreground relative overflow-hidden mt-6",
                        collapsed && "max-h-72"
                    )}
                >
                    <div ref={contentRef}>
                        <RichText value={description} />
                    </div>
                    {
                        collapsed && (
                            <div className="bg-gradient-to-b from-transparent to-background h-28 w-full absolute bottom-0 left-0 pointer-events-none"/>
                        )
                    }
                </div>
                {
                    overflows && (
                        <button
                            type="button"
                            onClick={()=>setExpanded((prev)=>!prev)}
                            className="mt-3 text-sm font-semibold text-primary hover:underline underline-offset-4"
                        >
                            {expanded ? "Show less" : "Show more"}
                        </button>
                    )
                }
            </div>
        </section>
    )
}
