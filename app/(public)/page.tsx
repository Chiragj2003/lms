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

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
                <Header variant="ghost" />
                
                {/* Background decorations */}
                <div className="absolute inset-0 -z-10 bg-zinc-50">
                    <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-highlight/5 rounded-full blur-3xl" />
                </div>

                <PageContainer>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 z-10 text-center lg:text-left">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
                                Master your future with <span className="text-primary">LearnIt</span>
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                                Empower your career with interactive video courses, real-time AI assistance, and verifiable certifications. Start learning today.
                            </p>
                            <div className="max-w-md mx-auto lg:mx-0">
                                <SearchForm />
                            </div>
                        </div>
                        
                        <div className="hidden lg:block relative z-10">
                            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl transform rotate-3" />
                                <div className="absolute inset-0 bg-white rounded-3xl shadow-xl overflow-hidden transform -rotate-2 border border-border">
                                    <Image 
                                        src="/assets/hero.avif" 
                                        alt="Learning platform" 
                                        fill 
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </PageContainer>
            </section>

            {/* Trust & Stats */}
            <TrustStrip />

            {/* Top Categories */}
            <Categories />

            {/* Features Showcase */}
            <Features />

            {/* Popular Courses (uses the existing CoursesSubPage which houses BestSeller) */}
            <CoursesSubPage />

            {/* FAQ */}
            <FAQSection />

            {/* Final CTA */}
            <CTASection />
        </div>
    )
}

export default HomePage;