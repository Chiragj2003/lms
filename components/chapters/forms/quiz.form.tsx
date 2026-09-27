"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import { toast } from "sonner";
import { Chapter, Quiz } from "@prisma/client";
import { Button } from "@/components/ui/button";


interface QuizFormProps {
    initialData : Chapter & { quiz : Quiz|null };
    courseId : string;
    chapterId : string;
}

export const QuizForm = ({
    initialData,
    chapterId,
    courseId
}: QuizFormProps ) => {
    
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async()=>{
        try {
            setIsLoading(true);
            if (!initialData.quiz) {
                await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/quiz`);
            } 
            router.push(`/tutor/courses/${courseId}/chapters/${chapterId}/quiz-test`);

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <div className="w-full bg-card border border-border rounded-2xl shadow-sm p-4">
            <p className="text-sm text-muted-foreground mb-4">
                {initialData.quiz ? "Edit the questions for your existing quiz." : "Create a new quiz to test your students' knowledge."}
            </p>
            <Button
                className="w-full h-11 rounded-lg"
                disabled = {isLoading}
                onClick={onClick}
                variant="brand"
            >
                {initialData.quiz ? "Edit Quiz" : "Create Quiz"}
            </Button>
        </div>
    )
}
