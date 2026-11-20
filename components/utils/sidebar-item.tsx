"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
    label : string;
    href : string;
    Icon : LucideIcon;
    active : boolean;
}
export const SidebarItem = ({
    label,
    href,
    active,
    Icon,
}:SidebarItemProps) => {
    return (
        <li>
            <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                    "flex items-center gap-x-3 h-12 px-4 rounded-2xl text-[15px] font-medium transition-colors",
                    active
                        ? "bg-white text-ink"
                        : "text-[#D2D3DB] hover:text-white hover:bg-white/10"
                )}
            >
                <Icon className="size-5 shrink-0" />
                {label}
            </Link>
        </li>
    )
}
