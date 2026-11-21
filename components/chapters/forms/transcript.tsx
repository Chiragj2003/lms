"use client";

import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Sparkles } from "lucide-react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const TranscriptSchema = z.object({
    transcript : z.string().min(3)
});

interface TranscriptFormProps {
    initialData : {
        transcript : string|null;
        videoUrl : string|null;
    },
    chapterId : string;
    courseId : string;
}

/**
 * The chapter transcript the AI tutor answers from. Tutors can type it, or
 * have Gemini write it from the chapter video (also done automatically when
 * a new video is uploaded).
 */
export const TranscriptForm = ({
    initialData,
    chapterId,
    courseId
} : TranscriptFormProps) => {

    const router = useRouter();
    const [isEditing, setEditing] = useState(false);
    const [isGenerating, setGenerating] = useState(false);
    const toggleEdit = ()=>setEditing((prev)=>!prev);

    const form  = useForm<z.infer<typeof TranscriptSchema>>({
        resolver : zodResolver(TranscriptSchema),
        defaultValues : {
            transcript : initialData.transcript ?? ""
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async( values: z.infer<typeof TranscriptSchema> )=>{
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Transcript saved");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

    const onGenerate = async () => {
        try {
            setGenerating(true);
            const { data } = await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/transcript`);
            form.reset({ transcript : data.transcript });
            toast.success("Transcript generated from the video");
            router.refresh();
        } catch (error) {
            const message = axios.isAxiosError(error) && typeof error.response?.data === "string"
                ? error.response.data
                : "Could not transcribe this video";
            toast.error(message);
        } finally {
            setGenerating(false);
        }
    }

    return (
        <div className="mt-4 bg-white rounded-3xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <p className="font-semibold text-ink">Chapter transcript</p>
                    <p className="text-xs text-muted-foreground">The AI tutor answers learners from this.</p>
                </div>
                {
                    !isEditing && (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onGenerate}
                                disabled={isGenerating || !initialData.videoUrl}
                                title={initialData.videoUrl ? undefined : "Upload a video first"}
                            >
                                {isGenerating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                                {isGenerating ? "Transcribing…" : initialData.transcript ? "Regenerate" : "Generate from video"}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={toggleEdit} disabled={isGenerating}>
                                <Pencil className="size-4" />
                                Edit
                            </Button>
                        </div>
                    )
                }
            </div>
            {
                !isEditing ? (
                    isGenerating ? (
                        <p className="mt-3 rounded-2xl bg-soft p-4 text-sm text-muted-foreground">
                            Gemini is watching the video and writing the transcript. This usually takes under a minute.
                        </p>
                    ) : initialData.transcript ? (
                        <p className="mt-3 max-h-60 overflow-y-auto whitespace-pre-line rounded-2xl bg-soft p-4 text-sm text-ink-2">
                            {initialData.transcript}
                        </p>
                    ) : (
                        <p className="mt-3 rounded-2xl bg-soft p-4 text-sm text-muted-foreground">
                            {initialData.videoUrl
                                ? "No transcript yet. Generate one from the video, or write your own."
                                : "Upload a video and a transcript is written for you automatically."}
                        </p>
                    )
                ) : (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4 mt-4"
                        >
                            <FormField
                                control={form.control}
                                name="transcript"
                                render={({field})=>(
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Paste or write what's said in this chapter"
                                                className="min-h-48"
                                                {...field}
                                                disabled = {isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className="w-full grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={toggleEdit}
                                    disabled = {isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
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
