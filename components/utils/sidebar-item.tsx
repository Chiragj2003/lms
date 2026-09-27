"use client";

import { useRouter } from "next/navigation";
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
    
    const router = useRouter();
    
    return (
        <li
            onClick={()=>router.push(href)}
            role="button"
            className={cn(
                "flex items-center gap-x-3 text-zinc-400 text-sm font-medium px-4 py-3 mx-2 rounded-lg cursor-pointer transition-colors",
                "hover:text-white hover:bg-white/10",
                active && "text-white bg-primary/20 hover:bg-primary/20"
            )}
        >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
        </li>
    )
}
