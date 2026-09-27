import { PageContainer } from "@/components/ui/page-container";
import { SectionHeader } from "@/components/ui/section-header";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "How do I get my certificate after completing a course?",
        answer: "Once you complete all the video lessons and pass the required quizzes, a 'Generate Certificate' button will unlock on the course overview page. You can download it immediately and share it on LinkedIn."
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
        answer: "Yes, we offer a 30-day money-back guarantee for all courses. If you are not satisfied with the content, simply request a refund from your dashboard."
    },
    {
        question: "Can I become a tutor and sell my own courses?",
        answer: "Absolutely. You can switch your account role to 'Tutor' in your profile settings. From there, you will gain access to the creator dashboard where you can upload videos, create quizzes, and set your own prices."
    }
];

export const FAQSection = () => {
    return (
        <section className="py-20 md:py-32 bg-white">
            <PageContainer>
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <SectionHeader 
                            title="Frequently Asked Questions" 
                            subtitle="Everything you need to know about learning on our platform."
                        />
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-b border-border py-2">
                                <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline hover:text-primary transition-colors">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
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
