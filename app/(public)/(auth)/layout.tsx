import { redirect } from "next/navigation";
import { Award, PlayCircle, Sparkles } from "lucide-react";

import { Header } from "@/components/utils/header";
import { PageContainer } from "@/components/ui/page-container";
import { auth } from "@/auth";

interface AuthLayoutProps {
    children : React.ReactNode;
}

const HIGHLIGHTS = [
    { icon : PlayCircle, text : "Video courses with a free preview chapter to try first" },
    { icon : Sparkles, text : "An AI assistant that knows the chapter you're watching" },
    { icon : Award, text : "A certificate when you complete a course" },
];

const AuthLayout = async ({
    children
} : AuthLayoutProps ) => {

    // A signed-in user has nothing to do on /login or /register: send them
    // straight to their dashboard instead of showing the form again.
    const session = await auth();
    if (session) {
        redirect("/user");
    }

    return (
        <div>
            <Header variant="default" />
            <PageContainer className="py-6 md:py-10">
                <div className="grid md:grid-cols-2 gap-4 min-h-[620px]">
                    <aside className="relative hidden md:flex flex-col justify-between gap-10 overflow-hidden rounded-[40px] bg-peri p-10 text-ink">
                        <p className="text-display-sm">
                            Learn a skill,<br /><span className="font-bold">prove it.</span>
                        </p>
                        <ul className="relative space-y-3">
                            {HIGHLIGHTS.map(({ icon : Icon, text }) => (
                                <li key={text} className="flex items-center gap-3 rounded-full bg-white/70 py-2 pl-2 pr-5 text-sm">
                                    <span className="size-9 shrink-0 rounded-full bg-ink text-white flex items-center justify-center">
                                        <Icon className="size-4" aria-hidden="true" />
                                    </span>
                                    {text}
                                </li>
                            ))}
                        </ul>
                        <svg aria-hidden="true" viewBox="0 0 150 110" className="pointer-events-none absolute right-0 top-24 h-56 w-80 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M30 92 L70 48 L104 82" /><circle cx="112" cy="30" r="16" /><path d="M104 54v10M120 54v10M20 104h120" />
                        </svg>
                    </aside>
                    <section className="flex items-center justify-center rounded-[40px] bg-white p-8 md:p-12">
                        <div className="w-full max-w-sm">
                            {children}
                        </div>
                    </section>
                </div>
            </PageContainer>
        </div>
    )
}

export default AuthLayout
