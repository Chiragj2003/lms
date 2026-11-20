"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useMounted } from "@/hooks/use-mounted";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/account/user-avatar";
import { cn } from "@/lib/utils";
import {
    BookOpen,
    GraduationCap,
    LayoutDashboard,
    LayoutGrid,
    Menu,
    Search,
    ShoppingCart,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useSidebar } from "@/hooks/use-sidebar";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useEffect, useState } from "react";
import { Logo } from "./logo";


interface HeaderProps {
    /** default/ghost: floating white nav. app: dark bar inside the learner shell. */
    variant: "default" | "ghost" | "app";
}

const NAV_LINKS = [
    { label: "Courses", href: "/search", icon: BookOpen },
    { label: "Categories", href: "/categories", icon: LayoutGrid },
];

const APP_LINKS = [
    { label: "Dashboard", href: "/user", exact: true },
    { label: "My learning", href: "/user/my-learning", exact: false },
    { label: "Certificates", href: "/user/certificates", exact: false },
    { label: "Browse", href: "/search", exact: false },
];

const navTextClass = (active: boolean, onDark = false) => cn(
    "inline-flex h-10 items-center rounded-full px-4 text-[15px] font-medium transition-colors",
    onDark
        ? active ? "bg-white text-ink" : "text-[#D2D3DB] hover:bg-white/10 hover:text-white"
        : active ? "bg-soft text-ink" : "text-ink-2 hover:bg-soft hover:text-ink"
);

const mobileLinkClass = "flex items-center gap-x-3 h-12 px-4 rounded-2xl text-[15px] font-medium text-ink hover:bg-soft";

export const Header = ({ variant }: HeaderProps) => {

    const router = useRouter();
    const session = useSession();
    // The browser can read the session from a cookie on its very first
    // render, while the server renders it as still loading. Treating it as
    // loading until after hydration keeps both first renders identical (they
    // differed, so React discarded the server HTML with a hydration error).
    const mounted = useMounted();
    const sessionReady = mounted && !session.isPending;
    const user = sessionReady ? session.data : null;
    const pathname = usePathname();
    const { items } = useCart();
    const { onOpen } = useSidebar();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const isGhost = variant === "ghost";
    const isApp = variant === "app";
    const iconVariant = isApp ? "ink" : "secondary";
    const isPlayerPage = pathname.includes("/course") && pathname.includes("/view");
    const isTutor = user?.user.role === "TUTOR";

    useEffect(() => {
        if (!isGhost) return;
        const handleScroll = () => {
            setScrolled(window.scrollY > 60);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isGhost]);

    return (
        <header
            className={cn(
                "z-50 w-full px-3 sm:px-6 pt-3 pb-2",
                isApp
                    ? "relative shrink-0 px-1 sm:px-2 py-1"
                    : isGhost ? "fixed top-0 left-0 right-0" : "sticky top-0 bg-background/85 backdrop-blur-md",
                isPlayerPage && !isApp && "relative bg-transparent backdrop-blur-none"
            )}
        >
            <div
                className={cn(
                    "mx-auto flex h-[60px] items-center justify-between gap-3 rounded-full pl-3 pr-2 sm:pl-5 transition-shadow duration-300",
                    isApp ? "max-w-none bg-transparent" : "max-w-[1320px] bg-white",
                    isGhost && scrolled && "shadow-elevated"
                )}
            >
                {/* Left: Logo + nav */}
                <div className="flex items-center gap-x-2 min-w-0">
                    {/* Player page: chapter sidebar trigger for mobile */}
                    {isPlayerPage && (
                        <Button
                            variant={iconVariant}
                            size="icon"
                            className="md:hidden"
                            onClick={() => onOpen()}
                            aria-label="Open chapter list"
                        >
                            <BookOpen className="size-5" />
                        </Button>
                    )}

                    <Logo inverted={isApp} className={cn(isPlayerPage && "max-md:hidden")} />

                    {isApp ? (
                        <nav className="hidden md:flex items-center gap-x-1 ml-5" aria-label="Learner">
                            {APP_LINKS.filter((link) => !isTutor || link.href === "/search").map((link) => {
                                const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
                                return (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        aria-current={active ? "page" : undefined}
                                        className={navTextClass(active, true)}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    ) : (
                    <nav className="hidden md:flex items-center gap-x-1 ml-5" aria-label="Main">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={navTextClass(pathname.startsWith(link.href))}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {!isTutor && sessionReady && user && (
                            <Link
                                href="/user/my-learning"
                                className={navTextClass(pathname.startsWith("/user/my-learning"))}
                            >
                                My Learning
                            </Link>
                        )}
                    </nav>
                    )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-x-2">
                    <Button
                        variant={iconVariant}
                        size="icon"
                        className="hidden md:inline-flex"
                        onClick={() => router.push("/search")}
                        aria-label="Search courses"
                    >
                        <Search className="size-5" />
                    </Button>

                    {/* Cart (learners only) */}
                    {!isTutor && (
                        <div className="relative">
                            <Button
                                variant={iconVariant}
                                size="icon"
                                onClick={() => router.push("/cart")}
                                aria-label={items.length > 0 ? `Shopping cart, ${items.length} items` : "Shopping cart"}
                            >
                                <ShoppingCart className="size-5" />
                            </Button>
                            {items.length > 0 && (
                                <span className="absolute -right-0.5 -top-0.5 size-5 flex items-center justify-center bg-peach text-ink text-[10px] font-bold rounded-full ring-2 ring-white">
                                    {items.length}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Tutor dashboard link */}
                    {isTutor && (
                        <Button
                            onClick={() => router.push("/tutor/courses")}
                            variant={isApp ? "light" : "outline"}
                            size="sm"
                            className="hidden md:inline-flex"
                        >
                            Tutor studio
                        </Button>
                    )}

                    {/* Auth */}
                    {sessionReady && !user ? (
                        <div className="flex items-center gap-x-2">
                            <Button
                                onClick={() => router.push("/login")}
                                variant="outline"
                                size="sm"
                                className="hidden md:inline-flex"
                            >
                                Sign in
                            </Button>
                            <Button
                                onClick={() => router.push("/register")}
                                variant={isApp ? "peri" : "default"}
                                size="sm"
                                className="hidden md:inline-flex"
                            >
                                Get started
                            </Button>
                        </div>
                    ) : user ? (
                        <UserAvatar />
                    ) : null}

                    {/* Mobile menu trigger */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant={iconVariant}
                                size="icon"
                                className="md:hidden"
                                aria-label="Open menu"
                            >
                                <Menu className="size-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80 p-0 bg-white">
                            <SheetTitle className="sr-only">Menu</SheetTitle>
                            <div className="flex flex-col h-full">
                                <div className="p-5">
                                    <Logo onClick={() => setMobileOpen(false)} />
                                </div>

                                <nav className="flex-1 px-3 space-y-1" aria-label="Mobile">
                                    <Link href="/search" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
                                        <Search className="size-5" />
                                        Browse courses
                                    </Link>
                                    <Link href="/categories" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
                                        <LayoutGrid className="size-5" />
                                        Categories
                                    </Link>
                                    {user && (
                                        <Link href="/user" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
                                            <LayoutDashboard className="size-5" />
                                            Dashboard
                                        </Link>
                                    )}
                                    {user && !isTutor && (
                                        <Link href="/user/my-learning" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
                                            <BookOpen className="size-5" />
                                            My learning
                                        </Link>
                                    )}
                                    {isTutor && (
                                        <Link href="/tutor/courses" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
                                            <GraduationCap className="size-5" />
                                            Tutor studio
                                        </Link>
                                    )}
                                </nav>

                                {sessionReady && !user && (
                                    <div className="p-4 space-y-2">
                                        <Button
                                            className="w-full"
                                            onClick={() => {
                                                setMobileOpen(false);
                                                router.push("/register");
                                            }}
                                        >
                                            Get started
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => {
                                                setMobileOpen(false);
                                                router.push("/login");
                                            }}
                                        >
                                            Sign in
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
};
