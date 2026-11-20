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
        <div className="h-full w-full bg-frame p-2 sm:p-4">
            <div className="h-full flex gap-2.5 rounded-[36px] bg-ink p-2.5">
                <div className="hidden md:block w-60 shrink-0">
                    <Sidebar/>
                </div>
                <div className="h-full min-w-0 flex-1 flex flex-col overflow-hidden rounded-[28px] bg-background">
                    <header className="h-[72px] shrink-0 flex items-center justify-between gap-3 px-4 sm:px-7">
                        <div className="md:hidden">
                            <TutorHeader/>
                        </div>
                        <div className="hidden md:block">
                            <Navigation/>
                        </div>
                        <UserAvatar/>
                    </header>
                    <main className="flex-1 overflow-y-auto w-full">
                        { children }
                    </main>
                </div>
            </div>
        </div>
    )
}

export default TutorLayout;