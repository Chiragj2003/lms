import { Metadata } from "next";
import { Header } from "@/components/utils/header"

export const metadata: Metadata = {
    title : "Profile"
}

interface LayoutPageProps {
    children: React.ReactNode;
}


const LayoutPage = ({
    children
}: LayoutPageProps ) => {
    return (
        <div className="h-full bg-frame p-2 sm:p-4">
            <div className="h-full flex flex-col rounded-[36px] bg-ink px-2 pb-2 sm:px-2.5 sm:pb-2.5">
                <Header variant="app" />
                <main className="flex-1 min-h-0 overflow-y-auto rounded-[28px] bg-background">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default LayoutPage;