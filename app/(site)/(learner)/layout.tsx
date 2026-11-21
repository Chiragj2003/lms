import { Metadata } from "next";
import { Header } from "@/components/utils/header"

export const metadata: Metadata = {
    title : "Profile"
}

interface LayoutPageProps {
    children: React.ReactNode;
}

/**
 * Learner pages use the same floating white header as the rest of the
 * site; the course player sizes itself to the space left under it.
 */
const LayoutPage = ({
    children
}: LayoutPageProps ) => {
    return (
        <div className="min-h-full flex flex-col">
            <Header variant="default" />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}

export default LayoutPage;
