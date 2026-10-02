"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

import { Option, QuizQuestion } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuizOption } from "./quiz-option";
import { GripHorizontal, Trash2, X } from "lucide-react";
import { useSave } from "@/hooks/use-save";
import { useDebounce } from "@/hooks/use-debounce";
import { errorMessage } from "@/lib/utils";


interface QuizItemProps {
    item: QuizQuestion & { options : Option[] }
    chapterId: string;
    courseId: string;
    disabled: boolean;
    onQuestionDelete: (id: string)=>void;
}


export const QuizItem = ({
    item,
    chapterId,
    courseId,
    disabled,
    onQuestionDelete
} : QuizItemProps) => {
    
    const [question, setQuestion] = useState(item.question);
    const [options, setOptions] = useState(item.options);
    const { setIsSaving } = useSave();
    const debounceValue = useDebounce(question, 1000);

    const onDelete = async(id: string) => {
        try {
            setIsSaving(true);
            const items = options.filter((item)=>item.id!==id);
            setOptions(items);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}/quiz/question/${item.id}/option?id=${id}`);

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setIsSaving(false)
        }
    }

    const onCreate = async()=>{
        try {
            setIsSaving(true);
            const id = uuidv4();

            setOptions((prev)=>[...prev, {
                id,
                answer : "",
                isCorrect : false,
                questionId : item.id,
                createdAt : new Date()
            }]);
            const response  = await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/quiz/question/${item.id}/option`);
            const items = options.filter((item)=>item.id !==id);
            setOptions([...items, response.data]);

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setIsSaving(false);
        }
    }


    // Last text the server has, so mounting (or typing back the same text)
    // doesn't send a pointless save.
    const savedQuestion = useRef(item.question);

    useEffect(()=>{
        if (!debounceValue || debounceValue === savedQuestion.current) {
            return;
        }
        const save = async () => {
            try {
                setIsSaving(true);
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/quiz/question/${item.id}`, { question : debounceValue});
                savedQuestion.current = debounceValue;
            } catch (error) {
                toast.error(errorMessage(error));
            } finally {
                setIsSaving(false);
            }
        };
        save();
    }, [debounceValue, courseId, chapterId, item.id, setIsSaving])



    return (
        <div className="w-full bg-card border border-border rounded-2xl shadow-sm border-l-8 border-l-primary group">
            <div className="flex items-center justify-center h-6">
                <GripHorizontal className="h-6 w-6 text-muted-foreground hidden group-hover:block"/>
            </div>
            <div className="px-6 py-4 space-y-6">
                <Input
                    value={question}
                    disabled={disabled}
                    placeholder="Question"
                    aria-label="Question"
                    onChange={(e)=>setQuestion(e.target.value)}
                    className="rounded-none h-12 border-0 border-b-2 border-border outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary focus:bg-muted font-medium text-foreground"
                />
                <div className="flex flex-col gap-y-2 w-full">
                    {options.map((option, index)=>(
                        <div className="flex items-center justify-between gap-x-4" key={option.id}>
                            <QuizOption
                                option={option}
                                chapterId={chapterId}
                                courseId={courseId}
                                index = {index+1}
                                key={option.id}
                                disabled={disabled}
                            />
                            <Button
                                className="text-muted-foreground hover:text-destructive"
                                size="icon"
                                variant="ghost"
                                onClick={()=>onDelete(option.id)}
                                disabled={disabled}
                                aria-label={`Remove option ${index+1}`}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-end space-x-4">
                    <Button
                        className="font-semibold hover:text-destructive"
                        variant="secondary"
                        aria-label="Delete question"
                        onClick={()=>onQuestionDelete(item.id)}
                        disabled={disabled}
                        size="sm"
                    >
                        <Trash2/>
                    </Button>
                    <Button
                        className="font-semibold"
                        variant="secondary"
                        onClick={onCreate}
                        disabled={disabled}
                        size="sm"
                    >
                        Add Option
                    </Button>
                </div>
            </div>
        </div>
    )
}
