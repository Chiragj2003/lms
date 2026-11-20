import { PageContainer } from "@/components/ui/page-container";
import Link from "next/link";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "How do I get my certificate after completing a course?",
        answer: "Your certificate is issued automatically as soon as you've completed every chapter of the course. You'll find it under My Certificates, where you can view and download it."
    },
    {
        question: "Can I learn at my own pace?",
        answer: "Yes! All courses are on-demand. You get lifetime access to the courses you enroll in, and you can watch the videos, take notes, and complete quizzes whenever you have time."
    },
    {
        question: "How does the AI Assistant work?",
        answer: "Our built-in AI Assistant has context about the specific chapter you are watching. If you don't understand a concept, just ask the AI! It will explain the topic using the course material as reference."
    },
    {
        question: "Do you offer refunds?",
        answer: "If a course isn't what you expected, email support@learnit.app and we'll review your refund request. You can also watch a course's free preview chapter before buying."
    },
    {
        question: "Can I become a tutor and sell my own courses?",
        answer: "Yes. When you first set up your account, choose the Tutor role. Tutor accounts get a creator dashboard where you can upload videos, create quizzes, and set your own prices."
    }
];

export const FAQSection = () => {
    return (
        <section className="py-16 md:py-20">
            <PageContainer>
                <div className="flex flex-wrap gap-8">
                    <div className="flex-[1_1_320px] space-y-3">
                        <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-ink-2">FAQ</p>
                        <h2 className="text-display-sm">Questions, answered</h2>
                        <p className="text-muted-foreground">
                            Can&apos;t find what you need? <Link href="/help" className="font-medium text-ink underline underline-offset-4">Visit the help centre</Link>.
                        </p>
                    </div>
                    <Accordion type="single" collapsible defaultValue="item-0" className="flex-[999_1_560px] min-w-0 space-y-2.5">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="rounded-3xl border-0 bg-white px-6">
                                <AccordionTrigger className="text-left text-[17px] font-medium text-ink hover:no-underline py-5">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed text-[15px]">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </PageContainer>
        </section>
    )
}
