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
                                "flex h-12 items-center px-4 rounded-2xl text-[15px] font-medium transition-colors whitespace-nowrap",
                                active
                                    ? "bg-ink text-white"
                                    : "text-ink hover:bg-soft"
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
