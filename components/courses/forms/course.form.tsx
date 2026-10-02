"use client";

import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CourseSchema } from "@/schemas/course.schema";
import { toast } from "sonner";
import { errorMessage } from "@/lib/utils";

export const CourseForm = () => {

    const router = useRouter();

    const form  = useForm<z.infer<typeof CourseSchema>>({
        resolver : zodResolver(CourseSchema),
        defaultValues : {
            title : ""
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async( values : z.infer<typeof CourseSchema>)=>{
        try {
            const response = await axios.post("/api/courses", values);
            router.push(`/tutor/courses/${response.data.id}`);
        } catch (error) {
            toast.error(errorMessage(error))
        }
    }

    return (
        <div className="w-full flex justify-center md:items-center h-full py-10 md:py-6">
            <div className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8">
                <h1 className="text-xl md:text-2xl font-bold text-foreground" >Name your course</h1>
                <p className="text-sm text-muted-foreground mt-1">What would you like to name your course? You can change it later.</p>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 mt-8"
                    >
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Course Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. Advanced Backend Development"
                                                className="rounded-lg h-11"
                                                {...field}
                                                disabled = {isSubmitting}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            What will you teach in this course?
                                        </FormDescription>
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
                                onClick={()=>router.push("/tutor/courses")}
                                disabled = {isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="rounded-lg h-11 font-semibold"
                                type="submit"
                                disabled = {isSubmitting || !isValid}
                            >
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
