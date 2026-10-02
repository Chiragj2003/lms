import { Header } from "@/components/utils/header"

interface CertificateLayoutProps {
    children: React.ReactNode;
}

// Same frame as the (learner) group, but without its loading.tsx. That
// loading boundary makes Next stream a 200 before the page runs, so a
// missing certificate could never answer with a real 404.
const CertificateLayout = ({
    children
}: CertificateLayoutProps ) => {
    return (
        <main className="h-full overflow-y-auto">
            <Header variant="default" />
            <section className="h-[calc(100%-5rem)]">
                {children}
            </section>
        </main>
    );
}

export default CertificateLayout;
