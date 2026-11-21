"use client";

import { GraduationCap } from "lucide-react";

import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * This week, Sunday to Saturday, with today highlighted. Computed in the
 * browser so "today" follows the visitor's own clock, not the server's
 * timezone; before hydration no day is highlighted.
 */
export const WeekStrip = () => {
    const mounted = useMounted();
    const today = mounted ? new Date().getDay() : -1;

    return (
        <div className="flex justify-between rounded-full bg-white px-4 py-3">
            {WEEK.map((day, i) => {
                const isToday = i === today;
                const isPast = today !== -1 && i < today;
                return (
                    <div key={day} className="flex flex-col items-center gap-1.5 min-w-8">
                        <span className={cn("text-xs", isToday && "font-semibold")}>{day}</span>
                        <span
                            className={cn(
                                "size-8 rounded-full flex items-center justify-center transition-colors",
                                isToday
                                    ? "bg-peach text-ink"
                                    : isPast
                                        ? "bg-ink text-white"
                                        : "bg-white text-[#9A9CA8] shadow-[inset_0_0_0_1.5px_#DCE0EA]"
                            )}
                        >
                            <GraduationCap className="size-4" aria-hidden="true" />
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
