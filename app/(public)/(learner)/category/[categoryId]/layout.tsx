import { Header } from "@/components/utils/header";


interface LayoutPageProps {
    children : React.ReactNode;
}

const LayoutPage = ({
    children
} : LayoutPageProps ) => {
    return (
        <div className="h-full overflow-y-auto">
            <Header variant="default" />
            {children}
        </div>
    )
}

export default LayoutPage;