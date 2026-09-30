import { Header } from "@/components/utils/header";

interface LegalLayoutProps {
    children : React.ReactNode;
}

const LegalLayout = ({
    children
} : LegalLayoutProps ) => {
    return (
        <div>
            <Header variant="default" />
            {children}
        </div>
    )
}

export default LegalLayout;
