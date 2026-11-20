import Link from "next/link";
import { Logo } from "./logo";

const footerLinks = {
    platform: [
        { label: "Browse Courses", href: "/search" },
        { label: "Categories", href: "/categories" },
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
        <footer className="bg-ink text-[#D2D3DB] rounded-t-[36px] mt-16">
            <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
                {/* Main footer content */}
                <div className="py-14 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Logo inverted className="mb-4" />
                        <p className="text-sm text-[#D2D3DB] leading-relaxed max-w-xs">
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
                                        className="text-sm text-[#D2D3DB] hover:text-white transition-colors"
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
                                        className="text-sm text-[#D2D3DB] hover:text-white transition-colors"
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
                                        className="text-sm text-[#D2D3DB] hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-[#2B2C34] py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-[#A9AAB5]">
                        &copy; {new Date().getFullYear()} LearnIt. All rights reserved.
                    </p>
                    <div className="flex items-center gap-x-4">
                        <span className="text-xs text-[#A9AAB5]">
                            Built with Next.js, Prisma & Razorpay
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
