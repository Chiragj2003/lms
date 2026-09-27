import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { TutorHeader } from "@/components/account/tutor-header";
import { UserAvatar } from "@/components/account/user-avatar";
import { Navigation } from "@/components/utils/navigation";
import { Sidebar } from "@/components/utils/sidebar";


interface TutorLayoutProps {
    children : React.ReactNode;
}
const TutorLayout = async ({
    children
} : TutorLayoutProps ) => {

    // The whole /tutor area was previously unguarded: any signed-in learner
    // could open it and start creating courses. One check here covers every
    // page and nested route beneath it.
    const session = await auth();

    if (!session) {
        return redirect("/login");
    }

    if (session.user.role !== "TUTOR") {
        return redirect("/");
    }

    return (
        <div className="h-full flex w-full">
            <aside className="hidden h-full bg-zinc-900 md:flex w-56 lg:w-60 flex-col inset-y-0 shrink-0">
                <Sidebar/>
            </aside>
            <div className="h-full w-full md:w-[calc(100%-14rem)] lg:w-[calc(100%-15rem)]">
                <header
                    className="h-16 flex items-center border-b border-border z-10 w-full bg-white"
                >
                    <div className="px-6 md:px-10 flex items-center justify-between w-full">
                        <div className="md:hidden">
                            <TutorHeader/>
                        </div>
                        <div className="hidden md:block">
                            <Navigation/>
                        </div>
                        <UserAvatar/>
                    </div>
                </header>
                <main className="h-[calc(100%-4rem)] overflow-y-auto w-full bg-background">
                    { children }
                </main>
            </div>
        </div>
    )
}

export default TutorLayout;