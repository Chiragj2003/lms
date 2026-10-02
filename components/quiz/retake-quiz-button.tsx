"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/utils";

interface RetakeQuizButtonProps {
    courseId : string;
    quizId : string;
}

export const RetakeQuizButton = ({ courseId, quizId } : RetakeQuizButtonProps) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onRetake = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/user/quiz/${quizId}`);
            router.push(`/course/${courseId}/quiz/${quizId}`);
            router.refresh();
        } catch (error) {
            toast.error(errorMessage(error));
            setLoading(false);
        }
    };

    return (
        <Button variant="outline" onClick={onRetake} disabled={loading}>
            <RotateCcw className="h-4 w-4 mr-2" />
            {loading ? "Resetting…" : "Retake quiz"}
        </Button>
    );
};
