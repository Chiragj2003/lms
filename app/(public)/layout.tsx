import { Footer } from "@/components/utils/footer";

interface PublicLayoutProps {
    children : React.ReactNode;
}

const PublicLayout = ({
    children
} : PublicLayoutProps ) => {
    return (
        <main className="min-h-full">
            {children}
            <Footer />
        </main>
    )
}

export default PublicLayout;
