import { Header } from "@/components/utils/header";
import { LegalNav } from "@/components/utils/legal-nav";

interface LegalLayoutProps {
    children : React.ReactNode;
}

const LegalLayout = ({
    children
} : LegalLayoutProps ) => {
    return (
        <div>
            <Header variant="default" />
            <div className="pt-6 px-4">
                <LegalNav />
            </div>
            {children}
        </div>
    )
}

export default LegalLayout;
