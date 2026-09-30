import { Metadata } from "next";
import { PageContainer } from "@/components/ui/page-container";

export const metadata: Metadata = {
    title: "Terms of Service"
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
    </section>
)

const TermsPage = () => {
    return (
        <PageContainer size="narrow" className="py-12 md:py-20">
            <div className="space-y-10">
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">Terms of Service</h1>
                    <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>

                <Section title="1. Your account">
                    <p>
                        You need an account to purchase or take courses on LearnIt. You&apos;re
                        responsible for the activity on your account and for keeping your sign-in
                        credentials secure. You must be old enough to form a binding contract in
                        your jurisdiction to make a purchase.
                    </p>
                </Section>

                <Section title="2. Buying a course">
                    <p>
                        When you enroll in a paid course, you&apos;re purchasing a license to
                        access that course&apos;s content for your own personal, non-commercial
                        learning. Prices are shown before checkout and are charged in the currency
                        displayed. Coupon codes are subject to their own stated terms and
                        expiration dates.
                    </p>
                </Section>

                <Section title="3. Refunds">
                    <p>
                        If a course isn&apos;t what you expected, contact support within a
                        reasonable time of purchase. We review refund requests case by case,
                        taking into account how much of the course you&apos;ve completed.
                    </p>
                </Section>

                <Section title="4. Content and conduct">
                    <p>
                        Course videos, materials, and certificates are for your use only — don&apos;t
                        download, redistribute, or share your account access with others. Reviews,
                        questions, and any other content you post should be your own and should
                        stay on-topic and respectful; we may remove content that violates this or
                        suspend accounts that abuse the platform.
                    </p>
                </Section>

                <Section title="5. Tutors">
                    <p>
                        If you publish a course as a tutor, you confirm you have the rights to the
                        material you upload and that it doesn&apos;t infringe on anyone else&apos;s
                        copyright. We may remove a course that violates these terms or receives a
                        valid takedown request.
                    </p>
                </Section>

                <Section title="6. Certificates">
                    <p>
                        A LearnIt certificate confirms you completed a specific course on this
                        platform. It isn&apos;t an accredited academic qualification unless the
                        course description says otherwise.
                    </p>
                </Section>

                <Section title="7. Changes">
                    <p>
                        We may update these terms as the platform evolves. Continuing to use
                        LearnIt after a change means you accept the updated terms.
                    </p>
                </Section>

                <Section title="8. Contact">
                    <p>
                        Questions about these terms can be sent to our{" "}
                        <a href="/help" className="text-primary underline underline-offset-4">Help Center</a>.
                    </p>
                </Section>

                <p className="text-xs text-muted-foreground border-t border-border pt-6">
                    This page is a general-purpose template and isn&apos;t legal advice. Before
                    relying on it for a live product handling real payments, have it reviewed by a
                    lawyer familiar with the regions you operate in.
                </p>
            </div>
        </PageContainer>
    )
}

export default TermsPage
