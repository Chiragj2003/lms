import Link from "next/link";
import { GraduationCap } from "lucide-react";

const footerLinks = {
    platform: [
        { label: "Browse Courses", href: "/search" },
        { label: "Categories", href: "/search" },
        { label: "Become a Tutor", href: "/register" },
    ],
    learners: [
        { label: "My Learning", href: "/user/my-learning" },
        { label: "My Certificates", href: "/user/certificates" },
        { label: "Cart", href: "/cart" },
    ],
    support: [
        { label: "Help Center", href: "/help" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
    ],
};

export const Footer = () => {
    return (
        <footer className="bg-zinc-900 text-zinc-300">
            <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-16">
                {/* Main footer content */}
                <div className="py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-x-2 mb-4">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                <GraduationCap className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white">
                                LearnIt
                            </span>
                        </Link>
                        <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
                            An interactive learning platform with video courses,
                            quizzes, certificates, and AI-powered support. Learn at
                            your pace, or teach what you know.
                        </p>
                    </div>

                    {/* Platform links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">
                            Platform
                        </h4>
                        <ul className="space-y-2.5">
                            {footerLinks.platform.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-zinc-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Learner links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">
                            For Learners
                        </h4>
                        <ul className="space-y-2.5">
                            {footerLinks.learners.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-zinc-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4">
                            Support
                        </h4>
                        <ul className="space-y-2.5">
                            {footerLinks.support.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-zinc-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-zinc-800 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-zinc-500">
                        &copy; {new Date().getFullYear()} LearnIt. All rights reserved.
                    </p>
                    <div className="flex items-center gap-x-4">
                        <span className="text-xs text-zinc-500">
                            Built with Next.js, Prisma & Stripe
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
