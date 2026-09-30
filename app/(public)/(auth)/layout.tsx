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
            <PageContainer className="py-12 md:py-20">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 bg-card border border-border rounded-3xl shadow-card overflow-hidden">
                    <aside className="hidden md:flex flex-col justify-between gap-10 bg-primary text-primary-foreground p-10">
                        <p className="text-2xl font-bold tracking-tight leading-snug">
                            Learn a skill,<br />prove it.
                        </p>
                        <ul className="space-y-5">
                            {HIGHLIGHTS.map(({ icon : Icon, text }) => (
                                <li key={text} className="flex items-start gap-3 text-sm text-primary-foreground/90">
                                    <Icon className="h-5 w-5 shrink-0 mt-0.5" />
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </aside>
                    <section className="p-8 md:p-10">
                        {children}
                    </section>
                </div>
            </PageContainer>
        </div>
    )
}

export default AuthLayout
