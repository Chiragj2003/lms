"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/account/user-avatar";
import { cn } from "@/lib/utils";
import {
    BookOpen,
    GraduationCap,
    Menu,
    Search,
    ShoppingCart,
    X,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useSidebar } from "@/hooks/use-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useEffect, useState } from "react";


interface HeaderProps {
    variant: "default" | "ghost";
}

const NAV_LINKS = [
    { label: "Courses", href: "/search", icon: BookOpen },
    { label: "Categories", href: "/categories", icon: GraduationCap },
];

export const Header = ({ variant }: HeaderProps) => {

    const router = useRouter();
    const session = useSession();
    const pathname = usePathname();
    const { items } = useCart();
    const { onOpen } = useSidebar();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const isHome = pathname === "/";
    const isGhost = variant === "ghost";
    const isPlayerPage = pathname.includes("/course") && pathname.includes("/view");
    const isTutor = session.data?.user.role === "TUTOR";

    useEffect(() => {
        if (!isGhost) return;
        const handleScroll = () => {
            setScrolled(window.scrollY > 60);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isGhost]);

    const showSolid = !isGhost || scrolled;

    return (
        <header
            className={cn(
                "h-16 md:h-18 flex items-center justify-between px-4 md:px-8 lg:px-12 z-50 transition-all duration-300",
                isGhost && "fixed top-0 left-0 right-0",
                showSolid
                    ? "bg-white/95 backdrop-blur-md border-b border-border shadow-sm"
                    : "bg-transparent",
                isPlayerPage && "relative"
            )}
        >
            {/* Left: Logo + mobile sidebar trigger */}
            <div className="flex items-center gap-x-3">
                {/* Player page: chapter sidebar trigger for mobile */}
                {isPlayerPage && (
                    <button
                        className="md:hidden p-1.5 rounded-lg hover:bg-accent"
                        onClick={() => onOpen()}
                        aria-label="Open chapter list"
                    >
                        <BookOpen className="size-5 text-foreground" />
                    </button>
                )}

                {/* Logo */}
                <Link
                    href="/"
                    className={cn(
                        "flex items-center gap-x-2 transition-opacity hover:opacity-80",
                        isPlayerPage && "max-md:hidden"
                    )}
                >
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-foreground">
                        LearnIt
                    </span>
                </Link>

                {/* Desktop nav links */}
                <nav className="hidden md:flex items-center gap-x-1 ml-6">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-zinc-600 hover:text-foreground hover:bg-accent"
                        >
                            {link.label}
                        </Link>
                    ))}
                    {!isTutor && !session.isPending && session.data && (
                        <Link
                            href="/user/my-learning"
                            className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-zinc-600 hover:text-foreground hover:bg-accent"
                        >
                            My Learning
                        </Link>
                    )}
                </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-x-2 md:gap-x-3">
                {/* Search (desktop) */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:inline-flex rounded-lg"
                    onClick={() => router.push("/search")}
                    aria-label="Search courses"
                >
                    <Search className="h-5 w-5" />
                </Button>

                {/* Cart (learners only) */}
                {!isTutor && (
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-lg"
                            onClick={() => router.push("/cart")}
                            aria-label="Shopping cart"
                        >
                            <ShoppingCart className="h-5 w-5" />
                        </Button>
                        {items.length > 0 && (
                            <span className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center bg-highlight text-white text-[10px] font-bold rounded-full">
                                {items.length}
                            </span>
                        )}
                    </div>
                )}

                {/* Tutor dashboard link */}
                {isTutor && (
                    <Button
                        onClick={() => router.push("/tutor/courses")}
                        variant="outline"
                        size="sm"
                        className="hidden md:inline-flex rounded-lg font-medium"
                    >
                        Dashboard
                    </Button>
                )}

                {/* Auth */}
                {!session.isPending && !session.data ? (
                    <div className="flex items-center gap-x-2">
                        <Button
                            onClick={() => router.push("/login")}
                            variant="ghost"
                            size="sm"
                            className="hidden md:inline-flex rounded-lg font-medium"
                        >
                            Sign In
                        </Button>
                        <Button
                            onClick={() => router.push("/register")}
                            size="sm"
                            className="hidden md:inline-flex rounded-lg font-semibold"
                        >
                            Get Started
                        </Button>
                    </div>
                ) : session.data ? (
                    <UserAvatar />
                ) : null}

                {/* Mobile menu trigger */}
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden rounded-lg"
                            aria-label="Open menu"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-72 p-0">
                        <div className="flex flex-col h-full">
                            {/* Mobile menu header */}
                            <div className="p-4 border-b border-border flex items-center justify-between">
                                <Link href="/" className="flex items-center gap-x-2" onClick={() => setMobileOpen(false)}>
                                    <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                                        <GraduationCap className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-base font-bold text-foreground">LearnIt</span>
                                </Link>
                            </div>

                            {/* Mobile nav links */}
                            <nav className="flex-1 py-4 px-3 space-y-1">
                                <Link
                                    href="/search"
                                    className="flex items-center gap-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:bg-accent"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <Search className="h-4 w-4" />
                                    Browse Courses
                                </Link>
                                <Link
                                    href="/categories"
                                    className="flex items-center gap-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:bg-accent"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <GraduationCap className="h-4 w-4" />
                                    Categories
                                </Link>
                                {session.data && !isTutor && (
                                    <Link
                                        href="/user/my-learning"
                                        className="flex items-center gap-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:bg-accent"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <BookOpen className="h-4 w-4" />
                                        My Learning
                                    </Link>
                                )}
                                {isTutor && (
                                    <Link
                                        href="/tutor/courses"
                                        className="flex items-center gap-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:bg-accent"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        <BookOpen className="h-4 w-4" />
                                        Tutor Dashboard
                                    </Link>
                                )}
                            </nav>

                            {/* Mobile auth actions */}
                            {!session.isPending && !session.data && (
                                <div className="p-4 border-t border-border space-y-2">
                                    <Button
                                        className="w-full rounded-lg"
                                        onClick={() => {
                                            setMobileOpen(false);
                                            router.push("/register");
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full rounded-lg"
                                        onClick={() => {
                                            setMobileOpen(false);
                                            router.push("/login");
                                        }}
                                    >
                                        Sign In
                                    </Button>
                                </div>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
};
