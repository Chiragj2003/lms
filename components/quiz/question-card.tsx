"use client";

import { cn } from "@/lib/utils";
import { QuizQuestion, Option } from "@prisma/client";
import { Checkbox } from "../ui/checkbox";

interface QuizQuestionProps {
    question: QuizQuestion & { options: Option[] }
    addAnswer: ( questionId: string, optionId: string )=>void;
    answers : { questionId: string, optionId: string }[];
}

export const QuestionCard= ({
    question,
    addAnswer,
    answers
}: QuizQuestionProps) => {;

    return (
        <div className={cn(
            "w-full p-6 md:p-8 rounded-[28px] bg-white",
        )}>
            <h3 className="text-xl md:text-2xl font-medium tracking-tight text-ink" >{question.question}</h3>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {
                    question.options.map((option)=> {
                        const selected = answers.find((ans)=>ans.questionId===question.id)?.optionId===option.id;
                        return (
                            <div
                                key={option.id}
                                className={cn(
                                    "flex items-center gap-x-4 rounded-[20px] px-4 py-3.5 transition-colors",
                                    selected ? "bg-peri-soft shadow-[inset_0_0_0_2px_#121216]" : "bg-soft hover:bg-frame/60"
                                )}
                            >
                                <Checkbox
                                    id={`option-${option.id}`}
                                    className="size-5 rounded-full"
                                    checked={selected}
                                    onClick={()=>addAnswer(question.id, option.id)}
                                />
                                <label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer text-[15px] font-medium text-ink" >{option.answer}</label>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
}
