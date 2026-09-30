import { Metadata } from "next";
import { Mail } from "lucide-react";

import { PageContainer } from "@/components/ui/page-container";
import { SectionHeader } from "@/components/ui/section-header";
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
                a: "Click Sign In or Get Started and continue with Google or GitHub. New accounts start as learners; you can switch to a tutor account from your profile once you're signed in."
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
                a: "Yes, within a reasonable window of purchase if a course isn't what you expected. Reach out using the contact details below."
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
                a: "Complete every chapter in a course (and pass its quiz, if it has one) and a certificate is generated automatically. Find it anytime under My Certificates."
            },
        ],
    },
    {
        topic: "For Tutors",
        faqs: [
            {
                q: "How do I start teaching on LearnIt?",
                a: "Switch your account to a tutor role from your profile, then use the tutor dashboard to create a course, add chapters and videos, and publish it."
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
        <PageContainer size="narrow" className="py-12 md:py-20">
            <div className="text-center mb-12">
                <SectionHeader
                    title="Help Center"
                    subtitle="Answers to common questions about learning and teaching on LearnIt."
                />
            </div>

            <div className="space-y-10">
                {TOPICS.map((section) => (
                    <div key={section.topic}>
                        <h2 className="text-lg font-semibold text-foreground mb-2">{section.topic}</h2>
                        <Accordion type="single" collapsible className="w-full">
                            {section.faqs.map((faq, i) => (
                                <AccordionItem key={i} value={`${section.topic}-${i}`} className="border-b border-border">
                                    <AccordionTrigger className="text-left text-base font-medium text-foreground hover:no-underline hover:text-primary transition-colors">
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

            <div className="mt-16 p-6 rounded-2xl bg-muted border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="font-semibold text-foreground">Still need help?</h3>
                    <p className="text-sm text-muted-foreground">Our support team is happy to answer anything not covered here.</p>
                </div>
                <a
                    href="mailto:support@learnit.app"
                    className="inline-flex items-center gap-x-2 text-sm font-semibold text-primary hover:underline underline-offset-4 whitespace-nowrap"
                >
                    <Mail className="h-4 w-4" />
                    support@learnit.app
                </a>
            </div>
        </PageContainer>
    )
}

export default HelpPage
