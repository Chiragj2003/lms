"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
    { label : "Public profile", href : "/user/edit-profile" },
    { label : "Social accounts", href : "/user/edit-profile/social" },
];

export const EditItems = () => {

    const pathname = usePathname();

    return (
        <nav className="flex md:flex-col gap-1" aria-label="Profile sections">
            {
                ITEMS.map((item)=>{
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                                "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                active
                                    ? "bg-accent text-accent-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            {item.label}
                        </Link>
                    );
                })
            }
        </nav>
    )
}
