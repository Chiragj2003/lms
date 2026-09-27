"use client";

import { PageContainer } from "@/components/ui/page-container";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const CTASection = () => {
    const router = useRouter();

    return (
        <section className="py-24 relative overflow-hidden bg-zinc-900">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-highlight/20 rounded-full blur-3xl opacity-50"></div>
            </div>

            <PageContainer className="relative z-10 text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Ready to level up your skills?
                    </h2>
                    <p className="text-lg text-zinc-400">
                        Join thousands of learners who are already advancing their careers. 
                        Get unlimited access to premium courses, AI-powered assistance, and verifiable certificates.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button 
                            size="lg" 
                            className="w-full sm:w-auto text-base h-14 px-8 rounded-xl"
                            onClick={() => router.push('/search')}
                        >
                            Browse Courses
                        </Button>
                        <Button 
                            variant="outline" 
                            size="lg" 
                            className="w-full sm:w-auto text-base h-14 px-8 rounded-xl bg-transparent text-white border-zinc-700 hover:bg-white/10 hover:text-white"
                            onClick={() => router.push('/register')}
                        >
                            Become a Tutor
                        </Button>
                    </div>
                </div>
            </PageContainer>
        </section>
    )
}
