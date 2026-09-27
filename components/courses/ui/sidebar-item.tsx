"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";

interface SidebarItemProps {
    id: string;
    label : string;
    isCompleted : boolean,
    courseId: string;
    isLocked : boolean
}

export const SidebarItem = ({
    courseId,
    id,
    isCompleted,
    isLocked,
    label
} : SidebarItemProps ) => {

    const pathname = usePathname();
    const router = useRouter();
    const { onClose } = useSidebar();

    const Icon = isLocked ? Lock : (isCompleted ? CheckCircle : PlayCircle);

    const active = pathname.includes(id);

    const onClick = () => {
        router.push(`/course/${courseId}/view/chapter/${id}`);
        onClose();
    }

    return (
        <button
            onClick={onClick}
            type="button"
            className={cn(
                "flex items-center gap-x-2 text-zinc-400 text-sm font-medium transition-all hover:text-zinc-200 hover:bg-zinc-800 focus:outline-none relative",
                active && "text-white bg-zinc-800",
                isCompleted && "text-emerald-400 hover:text-emerald-300",
                isCompleted && active && "bg-emerald-950/30"
            )}
        >
            <div className="flex items-center gap-x-3 p-4 text-left">
                <Icon
                    className={cn(
                        "h-5 w-5 shrink-0",
                        active && !isCompleted && "text-highlight"
                    )}
                />
                {label}
            </div>
            <div className={cn(
                "absolute right-0 opacity-0 w-1 h-full bg-highlight transition-all rounded-l-full",
                active && "opacity-100",
                isCompleted && active && "bg-emerald-500"
                )}
            />
        </button>
    )
}
