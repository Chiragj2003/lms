import { EditItems } from "@/components/account/edit-items";
import { PageContainer } from "@/components/ui/page-container";


interface EditLayoutPageProps {
    children: React.ReactNode;
}

const EditLayoutPage = ({
    children
} : EditLayoutPageProps ) => {

    return (
        <PageContainer className="py-10 md:py-16">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Edit profile</h1>
            <div className="w-full bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
                <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-border p-3">
                    <EditItems/>
                </aside>
                <section className="flex-1 min-w-0">
                    {
                        children
                    }
                </section>
            </div>
        </PageContainer>
    )
}

export default EditLayoutPage
