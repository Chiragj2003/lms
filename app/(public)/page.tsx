import { Header } from "@/components/utils/header";
import { SearchForm } from "@/components/courses/forms/search.form";
import { PageContainer } from "@/components/ui/page-container";
import { TrustStrip } from "@/components/subpages/trust-strip";
import { Categories } from "@/components/category/categories";
import { Features } from "@/components/utils/features";
import { CoursesSubPage } from "@/components/subpages/courses.subpage";
import { FAQSection } from "@/components/subpages/faq-section";
import { CTASection } from "@/components/subpages/cta-section";
import Image from "next/image";
import { Award, Sparkles, SquareCheckBig } from "lucide-react";
import { WeekStrip } from "@/components/subpages/week-strip";

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero */}
            <section className="relative pt-28 md:pt-36 pb-8">
                <Header variant="ghost" />

                <PageContainer>
                    <div className="flex flex-wrap items-center gap-10 lg:gap-12">
                        <div className="flex-[1_1_480px] space-y-7">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink">
                                <Sparkles className="size-4" aria-hidden="true" />
                                An AI study assistant in every lesson
                            </span>
                            <h1 className="text-display">
                                Check your learning roadmap and <span className="font-bold">upcoming lessons</span>
                            </h1>
                            <p className="text-lg md:text-xl text-ink-2 max-w-xl">
                                Video courses, chapter quizzes, notes and certificates on one calm,
                                colourful desk. Learn at your pace and always see what comes next.
                            </p>
                            <div className="max-w-xl">
                                <SearchForm />
                            </div>
                        </div>

                        <div className="relative flex-[1_1_420px] min-h-[460px] lg:min-h-[540px]" aria-hidden="true">
                            <div className="absolute inset-0 lg:left-10 rounded-[48px] bg-peri p-6 flex flex-col gap-4 overflow-hidden">
                                <div className="relative flex-1 overflow-hidden rounded-[32px] bg-white/30">
                                    <Image
                                        src="/assets/hero-learner.webp"
                                        alt=""
                                        fill
                                        priority
                                        sizes="(min-width: 1024px) 560px, 100vw"
                                        className="object-contain p-4 sm:p-6"
                                    />
                                </div>
                                <WeekStrip />
                            </div>
                            <div className="absolute left-0 top-10 hidden xl:flex w-60 flex-col gap-3 rounded-3xl bg-white p-5 shadow-float">
                                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-xs font-medium">
                                    <SquareCheckBig className="size-3.5" />
                                    Chapter quiz
                                </span>
                                <p className="text-[17px] font-medium leading-snug">Test what stuck before moving on</p>
                            </div>
                            <div className="absolute -right-2 bottom-28 hidden xl:flex items-center gap-3 rounded-3xl bg-lilac p-4 pr-6 shadow-float">
                                <span className="size-11 rounded-full bg-ink text-white flex items-center justify-center">
                                    <Award className="size-5" />
                                </span>
                                <div>
                                    <p className="font-medium">Certificate</p>
                                    <p className="text-xs text-ink-2">on every finished course</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </PageContainer>
            </section>

            {/* Real platform figures */}
            <TrustStrip />

            <Categories />

            <Features />

            {/* Popular courses (bestseller carousel) */}
            <CoursesSubPage />

            <FAQSection />

            <CTASection />
        </div>
    )
}

export default HomePage;
