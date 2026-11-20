"use client";

import { PageContainer } from "@/components/ui/page-container";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const CTASection = () => {
    const router = useRouter();

    return (
        <section className="py-16 md:py-20">
            <PageContainer>
                <div className="relative overflow-hidden rounded-[40px] bg-ink px-6 py-12 sm:px-12 sm:py-14 flex flex-wrap items-center justify-between gap-8">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-peri opacity-30" />
                    <div aria-hidden="true" className="pointer-events-none absolute right-40 bottom-[-60px] size-40 rounded-full bg-lilac opacity-30" />
                    <div className="relative max-w-xl space-y-3">
                        <h2 className="text-display-sm text-white">
                            Teach what you know. Learn what you don&apos;t.
                        </h2>
                        <p className="text-base text-[#D2D3DB]">
                            Pick a course and learn at your own pace with an AI assistant on hand,
                            or build your own course with chapters, quizzes and coupons.
                        </p>
                    </div>
                    <div className="relative flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Button
                            size="lg"
                            variant="peri"
                            className="w-full sm:w-auto"
                            onClick={() => router.push('/search')}
                        >
                            Browse courses
                        </Button>
                        <Button
                            size="lg"
                            variant="ink"
                            className="w-full sm:w-auto"
                            onClick={() => router.push('/register')}
                        >
                            Become a tutor
                        </Button>
                    </div>
                </div>
            </PageContainer>
        </section>
    )
}
