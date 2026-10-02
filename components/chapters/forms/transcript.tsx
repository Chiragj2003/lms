"use client";

import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { useState } from "react";

const TranscriptSchema = z.object({
    transcript : z.string().min(3)
});


interface TitleFormProps {
    initialData : {
        transcript : string|null;
    },
    chapterId : string;
    courseId : string;
}

export const TranscriptForm = ({
    initialData,
    chapterId,
    courseId
} : TitleFormProps) => {

    const router = useRouter();
    const [isEditing, setEditing] = useState(false);
    const toggleEdit = ()=>setEditing((prev)=>!prev);

    const form  = useForm<z.infer<typeof TranscriptSchema>>({
        resolver : zodResolver(TranscriptSchema),
        defaultValues : {
            transcript : initialData.transcript ?? undefined
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async( values: z.infer<typeof TranscriptSchema> )=>{
        try {
            const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Course Updated")
            toggleEdit();
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="mt-6 bg-card border border-border rounded-2xl shadow-sm p-4 transition-transform">
            <div className="flex items-center justify-between font-medium text-foreground">
                <span className="font-semibold">Chapter Transcript</span>
                <Button
                    variant="ghost"
                    onClick={toggleEdit}
                >
                    {
                        isEditing ? (
                            <>Cancel</>
                        ) : (
                            <>
                                <Pencil className="h-4 w-4 mr-3" />
                                Edit Transcript
                            </>
                            
                        )
                    }
                </Button>
            </div>
            {
                !isEditing ? (
                    <p className="text-sm text-foreground mt-2 font-medium">
                        {initialData.transcript}
                    </p>
                ) : (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6 mt-4"
                        >
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="transcript"
                                    render={({field})=>(
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="Add a transcript for this chapter"
                                                    className="rounded-lg h-11"
                                                    {...field}
                                                    disabled = {isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-full grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    className="rounded-lg h-11 font-semibold"
                                    type="button"
                                    onClick={toggleEdit}
                                    disabled = {isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="rounded-lg h-11 font-semibold"
                                    type="submit"
                                    disabled = {isSubmitting || !isValid}
                                >
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                )
            }
        </div>
    )
}