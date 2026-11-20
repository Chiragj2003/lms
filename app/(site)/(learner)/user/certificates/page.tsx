import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth"
import { getUserCertificates } from "@/server/certificate";
import { CertificateCard } from "@/components/utils/certificate-card";
import { PageContainer } from "@/components/ui/page-container";

export const metadata : Metadata = {
    title : "Your certificates"
}

const CertificatesPage = async() => {
    
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return redirect("/");
    }

    const certificates = await getUserCertificates(session.user.id);

    return (
        <PageContainer className="py-6 md:py-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Earned by finishing every chapter of a course</p>
                    <h1 className="text-display-sm">Certificates</h1>
                </div>
                {certificates.length > 0 && (
                    <span className="inline-flex h-10 items-center rounded-full bg-white px-5 text-sm font-medium text-ink">
                        {certificates.length} earned
                    </span>
                )}
            </div>
            
            { certificates.length === 0 && (
                <EmptyState
                    className="rounded-[32px] bg-white py-14"
                    illustration="/assets/illustrations/no-certificates.webp"
                    title="No certificates yet"
                    description="Finish every chapter of a course to earn its certificate."
                    action={
                        <Button asChild>
                            <Link href="/user/my-learning">Continue learning</Link>
                        </Button>
                    }
                />
            ) }
            
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {
                    certificates.map((certificate)=>(
                        <CertificateCard
                            key={certificate.id}
                            certificateId={certificate.id}
                            image={certificate.course.image!}
                            title={certificate.course.title}
                        />
                    ))
                }
            </section>
        </PageContainer>
    )
}

export default CertificatesPage