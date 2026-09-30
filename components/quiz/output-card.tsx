"use client";

import { cn } from "@/lib/utils";
import { QuizQuestion, Option } from "@prisma/client";
import { Checkbox } from "../ui/checkbox";

interface OutputCardProps {
    question: QuizQuestion & { options: Option[] }
    type : "correct"|"incorrect"|"dropped"
}

export const OutputCard= ({
    question,
    type
}: OutputCardProps) => {;

    return (
        <div className={cn(
            "w-full p-6 rounded-2xl bg-card border border-border shadow-sm",
            type === "correct" && "bg-success/5 border-success/30",
            type === "incorrect" && "bg-destructive/5 border-destructive/30",
        )}>
            <div className="flex items-center justify-end py-2">
                <p className={cn(
                    "text-muted-foreground font-semibold",
                    type === "correct" && "text-success",
                    type === "incorrect" && "text-destructive"
                )}>
                    {
                        type.charAt(0).toUpperCase()+type.slice(1)
                    }
                </p>
            </div>
            <h3 className="font-medium text-foreground text-base" >{question.question}</h3>
            <div className="mt-6 flex flex-col space-y-2">
                {
                    question.options.map((option)=> (
                        <div
                            key={option.id}
                            className="flex items-center gap-x-4"
                        >
                            <Checkbox
                                checked={option.isCorrect}
                                disabled
                            />
                            <span className="text-sm font-medium text-zinc-600" >{option.answer}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
