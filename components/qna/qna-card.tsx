"use client";

import { RichText as Preview } from "@/components/utils/rich-text";

import { format } from "date-fns";

import { QNAResponse } from "@/types";
import { 
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";

interface QNACardProps {
    data : QNAResponse,
}

export const QNACard = ({
    data
}: QNACardProps ) => {
    
    return (
        <div className="max-w-2xl w-full mx-auto border border-border bg-card p-4 rounded-md">
            <div className="flex items-start gap-x-6" >
                <div className="h-8 md:h-10 aspect-square shrink-0">
                    <Avatar className="h-full w-full">
                        <AvatarImage src={data.user?.image||""} />
                        <AvatarFallback className="bg-neutral-800 text-zinc-200 font-semibold md:text-lg" >{data.user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex flex-col">
                    <h3 className="text-foreground font-medium text-sm" >{data.user?.name}</h3>
                    <p className="text-muted-foreground text-xs">
                        { format(data.createdAt, "dd LLL yyyy")}
                    </p>
                </div>
            </div>
            <div className="py-4">
                <Preview 
                    value={data.question}
                    className="py-2"
                />
            </div>
            {
                data.solution && (
                    <div className="rounded-lg bg-accent/60 border border-primary/20 p-4 space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                            Answer from {data.solution.tutor?.name || "the instructor"}
                        </p>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{data.solution.answer}</p>
                    </div>
                )
            }
        </div>
    )
}
