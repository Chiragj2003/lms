import Image from "next/image";
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
        <PageContainer className="py-12 md:py-20">
            <h1 className="text-3xl font-bold text-foreground mb-10" >Your Certificates</h1>
            
            { certificates.length === 0 && (
                <div className="mt-20 space-y-6">
                    <div className="w-60 aspect-square mx-auto relative opacity-80">
                        <Image
                            src="/assets/empty.jpg"
                            fill
                            alt=""
                            className="object-contain mix-blend-multiply"
                        />
                    </div>
                    <p className="text-base text-muted-foreground font-medium text-center max-w-md mx-auto">
                    Your certificate wallet is empty. 📚 Start exploring our courses and earn your first certificate today!
                    </p>
                </div>
            ) }
            
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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