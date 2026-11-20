import Link from "next/link";
import { Compass } from "lucide-react";

import { Header } from "@/components/utils/header";
import { Footer } from "@/components/utils/footer";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page-container";

export default function NotFound() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header variant="default" />
            <main className="flex-1">
                <PageContainer className="py-6 md:py-10">
                    <div className="relative overflow-hidden rounded-[40px] bg-peri px-6 py-14 sm:px-12 sm:py-16 text-ink">
                        <svg aria-hidden="true" viewBox="0 0 150 110" className="pointer-events-none absolute -right-4 -bottom-4 h-72 w-[26rem] opacity-30" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M30 92 L70 48 L104 82" /><circle cx="112" cy="30" r="16" /><path d="M104 54v10M120 54v10M20 104h120" />
                        </svg>
                        <div className="relative max-w-xl space-y-5">
                            <p className="text-[120px] sm:text-[180px] leading-[0.9] font-semibold tracking-tight" aria-hidden="true">404</p>
                            <h1 className="text-display-sm">This page wandered off the roadmap.</h1>
                            <p className="text-lg text-ink-2">
                                The page you&apos;re looking for doesn&apos;t exist or may have moved.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Button asChild size="lg">
                                    <Link href="/">Back to home</Link>
                                </Button>
                                <Button asChild variant="light" size="lg">
                                    <Link href="/search">
                                        <Compass className="size-4" />
                                        Browse courses
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </PageContainer>
            </main>
            <Footer />
        </div>
    );
}
