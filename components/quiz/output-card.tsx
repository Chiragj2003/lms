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
            "w-full p-6 md:p-7 rounded-[28px] bg-white",
            type === "correct" && "shadow-[inset_0_0_0_2px_#BDEDC9]",
            type === "incorrect" && "shadow-[inset_0_0_0_2px_#FDE4E1]",
        )}>
            <div className="flex items-center justify-end py-2">
                <p className={cn(
                    "inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold bg-soft text-ink",
                    type === "correct" && "bg-mint text-[#0F3D22]",
                    type === "incorrect" && "bg-[#FDE4E1] text-destructive"
                )}>
                    {
                        type.charAt(0).toUpperCase()+type.slice(1)
                    }
                </p>
            </div>
            <h3 className="text-lg font-medium tracking-tight text-ink" >{question.question}</h3>
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
                            <span className="text-sm font-medium text-ink-2" >{option.answer}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
