import Link from "next/link";
import Image from "next/image";
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
                        <Image
                            src="/assets/illustrations/not-found.webp"
                            alt=""
                            width={865}
                            height={900}
                            priority
                            aria-hidden="true"
                            className="pointer-events-none mx-auto mb-6 w-56 h-auto lg:absolute lg:right-12 lg:top-1/2 lg:-translate-y-1/2 lg:mb-0 lg:w-[380px]"
                        />
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
