"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
    { label: "Help centre", href: "/help" },
    { label: "Terms of service", href: "/terms" },
    { label: "Privacy policy", href: "/privacy" },
];

export const LegalNav = () => {
    const pathname = usePathname();
    return (
        <nav aria-label="Help and legal" className="flex flex-wrap justify-center gap-2">
            {LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                            "inline-flex h-10 items-center rounded-full px-5 text-sm font-medium transition-colors",
                            active ? "bg-ink text-white" : "bg-white text-ink hover:bg-soft"
                        )}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
};
