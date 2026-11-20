import { Metadata } from "next";
import { Mail } from "lucide-react";

import { PageContainer } from "@/components/ui/page-container";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
    title: "Help Center"
}

const TOPICS = [
    {
        topic: "Account",
        faqs: [
            {
                q: "How do I create an account?",
                a: "Click Sign In or Get Started and continue with Google or GitHub. The first time you sign in, you'll choose whether this is a learner or a tutor account."
            },
            {
                q: "How do I sign out?",
                a: "Open your avatar menu in the top-right corner of any page and choose Log Out."
            },
        ],
    },
    {
        topic: "Courses & Enrollment",
        faqs: [
            {
                q: "How do I find a course?",
                a: "Use the search bar on the homepage or the Courses link in the header. The first chapter of most courses is free to preview before you buy."
            },
            {
                q: "Where do my purchased courses show up?",
                a: "Go to My Learning from your avatar menu or profile page to see every course you're enrolled in and your progress through each one."
            },
            {
                q: "Can I learn at my own pace?",
                a: "Yes — enrollment gives you lifetime access. Watch lessons, take quizzes, and pick up where you left off whenever you like."
            },
        ],
    },
    {
        topic: "Payments & Refunds",
        faqs: [
            {
                q: "What payment methods are supported?",
                a: "Checkout is handled by Razorpay, which supports cards, UPI, and net banking."
            },
            {
                q: "Do you offer refunds?",
                a: "If a course isn't what you expected, reach out using the contact details below and we'll review your request. You can also watch a course's free preview chapter before buying."
            },
            {
                q: "How do coupon codes work?",
                a: "Enter a valid coupon code on the course page before checkout to apply the discount to that course's price."
            },
        ],
    },
    {
        topic: "Certificates",
        faqs: [
            {
                q: "How do I get my certificate?",
                a: "Complete every chapter in a course and a certificate is issued automatically. Find it anytime under My Certificates, where you can also download it."
            },
        ],
    },
    {
        topic: "For Tutors",
        faqs: [
            {
                q: "How do I start teaching on LearnIt?",
                a: "Choose the Tutor role when you first set up your account, then use the tutor dashboard to create a course, add chapters and videos, and publish it."
            },
            {
                q: "Can I see how my courses are performing?",
                a: "Yes — the tutor dashboard includes analytics on enrollments and revenue for your published courses."
            },
        ],
    },
];

const HelpPage = () => {
    return (
        <PageContainer size="narrow" className="py-8 md:py-12">
            <div className="text-center mb-10 space-y-3">
                <h1 className="text-display">How can we help?</h1>
                <p className="text-lg text-ink-2">Answers to common questions about learning and teaching on LearnIt.</p>
            </div>

            <div className="space-y-4">
                {TOPICS.map((section) => (
                    <div key={section.topic}>
                        <h2 className="text-xl font-medium tracking-tight text-ink mb-3 px-1">{section.topic}</h2>
                        <Accordion type="single" collapsible className="w-full space-y-2">
                            {section.faqs.map((faq, i) => (
                                <AccordionItem key={i} value={`${section.topic}-${i}`} className="rounded-3xl border-0 bg-white px-6">
                                    <AccordionTrigger className="text-left text-base font-medium text-ink hover:no-underline py-5">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                ))}
            </div>

            <div className="mt-10 p-7 rounded-[32px] bg-ink text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-medium">Still need help?</h3>
                    <p className="text-sm text-[#D2D3DB]">Our support team is happy to answer anything not covered here.</p>
                </div>
                <a
                    href="mailto:support@learnit.app"
                    className="inline-flex h-11 items-center gap-x-2 rounded-full bg-peri px-5 text-sm font-semibold text-ink whitespace-nowrap hover:bg-peri-deep"
                >
                    <Mail className="h-4 w-4" />
                    support@learnit.app
                </a>
            </div>
        </PageContainer>
    )
}

export default HelpPage
