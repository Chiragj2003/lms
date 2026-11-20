"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Check, Lock, Play } from "lucide-react";
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

    const Icon = isLocked ? Lock : (isCompleted ? Check : Play);

    const active = pathname.includes(id);

    const onClick = () => {
        router.push(`/course/${courseId}/view/chapter/${id}`);
        onClose();
    }

    return (
        <button
            onClick={onClick}
            type="button"
            aria-current={active ? "page" : undefined}
            className={cn(
                "flex w-full items-center gap-x-3 rounded-2xl p-2.5 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                active ? "bg-peri-soft text-ink font-semibold" : "text-ink hover:bg-soft",
                isLocked && !active && "text-muted-foreground"
            )}
        >
            <span
                aria-hidden="true"
                className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full",
                    isCompleted ? "bg-mint text-ink" : active ? "bg-ink text-white" : "bg-soft text-ink"
                )}
            >
                <Icon className="size-4" />
            </span>
            <span className="flex-1 min-w-0">{label}</span>
            <span className="sr-only">
                {isLocked ? "(locked)" : isCompleted ? "(completed)" : ""}
            </span>
        </button>
    )
}
