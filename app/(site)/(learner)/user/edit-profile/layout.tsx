import { EditItems } from "@/components/account/edit-items";
import { PageContainer } from "@/components/ui/page-container";


interface EditLayoutPageProps {
    children: React.ReactNode;
}

const EditLayoutPage = ({
    children
} : EditLayoutPageProps ) => {

    return (
        <PageContainer className="py-6 md:py-8">
            <h1 className="text-display-sm mb-6">Edit profile</h1>
            <div className="w-full flex flex-col md:flex-row gap-4 items-start">
                <aside className="w-full md:w-72 shrink-0 rounded-[28px] bg-white p-2">
                    <EditItems/>
                </aside>
                <section className="flex-1 min-w-0 w-full rounded-[32px] bg-white">
                    {
                        children
                    }
                </section>
            </div>
        </PageContainer>
    )
}

export default EditLayoutPage
