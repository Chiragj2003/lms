"use client";

import Image from "next/image";
import { useState } from "react";

import axios from "axios";
import { toast } from "sonner";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, errorMessage } from "@/lib/utils";

const ROLES = [
    {
        value : "LEARNER",
        title : "I want to learn",
        description : "Browse courses, track your progress and earn certificates.",
        image : "/assets/student.png",
    },
    {
        value : "TUTOR",
        title : "I want to teach",
        description : "Create courses, add chapters and quizzes, and sell them.",
        image : "/assets/teacher.png",
    },
] as const;

export const RoleForm = () => {

    const [role, setRole] = useState<"LEARNER"|"TUTOR">("LEARNER");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async()=>{
        try {
            setIsLoading(true)
            await axios.patch("/api/user/role", {role});
            // Full reload rather than router.refresh(): role and profile live
            // on the session, and the cached session kept sending the user
            // straight back to this picker.
            window.location.href = role === "TUTOR" ? "/tutor/courses" : "/user";
        } catch (error) {
            // Already set (e.g. a retried request after the first succeeded):
            // nothing left to do here, so carry on to the dashboard.
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                window.location.href = "/user";
                return;
            }
            toast.error(errorMessage(error));
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto px-6 py-16 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-display-sm">
                    How will you use LearnIt?
                </h1>
                <p className="text-sm text-muted-foreground">
                    This sets up your account. It can&apos;t be changed later.
                </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4" role="radiogroup" aria-label="Account type">
                {ROLES.map((option)=>{
                    const selected = role === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            disabled={isLoading}
                            onClick={()=>setRole(option.value)}
                            className={cn(
                                "relative text-left p-6 rounded-[28px] transition-all min-h-56 flex flex-col",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                                selected
                                    ? "bg-peri shadow-[inset_0_0_0_2px_#121216]"
                                    : "bg-lilac-soft hover:bg-lilac"
                            )}
                        >
                            {selected && (
                                <CircleCheck className="absolute top-5 right-5 h-6 w-6 text-ink" />
                            )}
                            <div className="relative size-16 mb-4 rounded-full bg-white/70 p-2.5">
                                <Image src={option.image} alt="" fill sizes="4rem" className="object-contain" />
                            </div>
                            <p className="mt-auto text-xl font-medium tracking-tight text-ink">{option.title}</p>
                            <p className="text-sm text-ink-2 mt-1">{option.description}</p>
                        </button>
                    );
                })}
            </div>
            <Button
                size="lg"
                className="w-full"
                onClick={onSubmit}
                disabled={isLoading}
            >
                Continue
            </Button>
        </div>
    )
}
