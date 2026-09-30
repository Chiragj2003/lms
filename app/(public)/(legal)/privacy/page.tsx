import { Metadata } from "next";
import { PageContainer } from "@/components/ui/page-container";

export const metadata: Metadata = {
    title: "Privacy Policy"
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
    </section>
)

const PrivacyPage = () => {
    return (
        <PageContainer size="narrow" className="py-12 md:py-20">
            <div className="space-y-10">
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">Privacy Policy</h1>
                    <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>

                <Section title="1. What we collect">
                    <p>
                        When you create a LearnIt account, we collect the information you or your
                        sign-in provider give us: your name, email address, and profile photo. When
                        you buy a course, our payment provider processes your payment details
                        directly — we never see or store your card number. We also keep records of
                        the courses you&apos;ve purchased, your progress through them, quiz results,
                        certificates you&apos;ve earned, and reviews you&apos;ve written.
                    </p>
                </Section>

                <Section title="2. How we use it">
                    <p>
                        We use your information to run your account, deliver the courses
                        you&apos;ve purchased, track your learning progress, issue certificates,
                        process payments and refunds, and respond when you contact support. We do
                        not sell your personal information to third parties.
                    </p>
                </Section>

                <Section title="3. Sharing">
                    <p>
                        We share information only with the services that make LearnIt work: our
                        payment processor (to complete purchases), our hosting and file-storage
                        providers (to serve videos and images), and — if you signed up with Google
                        or GitHub — that provider, to confirm who you are. Tutors can see the name
                        and review left by a learner who rates their course, but not payment
                        details or contact information.
                    </p>
                </Section>

                <Section title="4. Your choices">
                    <p>
                        You can update your profile information at any time from your account
                        settings. You can request a copy of your data or ask us to delete your
                        account by contacting support; we&apos;ll retain only what we&apos;re
                        legally required to keep, such as payment records.
                    </p>
                </Section>

                <Section title="5. Cookies">
                    <p>
                        We use essential cookies to keep you signed in and remember items in your
                        cart. We don&apos;t use third-party advertising cookies.
                    </p>
                </Section>

                <Section title="6. Contact">
                    <p>
                        Questions about this policy or your data can be sent to our{" "}
                        <a href="/help" className="text-primary underline underline-offset-4">Help Center</a>.
                    </p>
                </Section>

                <p className="text-xs text-muted-foreground border-t border-border pt-6">
                    This page is a general-purpose template and isn&apos;t legal advice. Before
                    relying on it for a live product handling real payments and personal data,
                    have it reviewed by a lawyer familiar with the regions you operate in.
                </p>
            </div>
        </PageContainer>
    )
}

export default PrivacyPage
