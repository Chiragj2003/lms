"use client";


import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import * as z from "zod";
import axios from "axios";
import { Option } from "@prisma/client";
import { toast } from "sonner";
import { OptionSchema } from "@/schemas/option.schema";
import { errorMessage } from "@/lib/utils";
import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";


interface QuizOptionProps {
    option: Option;
    chapterId: string;
    courseId: string;
    index : number;
    disabled: boolean;
}


export const QuizOption = ({
    option,
    chapterId,
    courseId,
    index,
    disabled
} : QuizOptionProps ) => {

    
    const form = useForm<z.input<typeof OptionSchema>, any, z.infer<typeof OptionSchema>>({
        resolver : zodResolver(OptionSchema),
        defaultValues : {
            isCorrect : option.isCorrect,
            answer : option.answer
        }
    });


    const { isValid } = form.formState;
    // useWatch instead of form.watch(), which the React Compiler can't
    // memoize and which returned a new object every render.
    const answer = useWatch({ control : form.control, name : "answer" });
    const isCorrect = useWatch({ control : form.control, name : "isCorrect" });

    // Autosave a second after the last change.
    useEffect(()=>{
        if (!isValid || (answer === option.answer && !!isCorrect === option.isCorrect)) {
            return;
        }
        const timer = setTimeout(async ()=>{
            try {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/quiz/question/${option.questionId}/option?id=${option.id}`, { answer, isCorrect });
            } catch (error) {
                toast.error(errorMessage(error));
            }
        }, 1000);
        return ()=>clearTimeout(timer);
    }, [answer, isCorrect, isValid, option.answer, option.isCorrect, option.id, option.questionId, courseId, chapterId]);



    return (
        <Form {...form}>
            <form
                className="flex items-center gap-x-4 w-full"
            >   
                <FormField
                    control={form.control}
                    name="isCorrect"
                    render={(({field})=>(
                        <FormItem>
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    ))}
                />
                <FormField
                    control={form.control}
                    name="answer"
                    render={(({field})=>(
                        <FormItem>
                            <FormControl>
                                <Input
                                    className="rounded-none h-10 border-0 w-full outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-input focus:bg-muted font-medium text-foreground  focus:border-b-2"
                                    placeholder={`Option ${index}`}
                                    {...field}
                                    disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    ))}
                />
            </form>
        </Form>
    )
}
