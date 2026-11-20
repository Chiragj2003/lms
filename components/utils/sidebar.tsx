import { SidebarRoutes } from "./sidebar-routes";
import { Logo } from "./logo";


export const Sidebar = () => {
    return (
        <aside className="h-full flex flex-col overflow-y-auto px-2 py-3 text-white">
            <div className="px-3 pt-1 pb-6">
                <Logo inverted label="Studio" />
            </div>

            <nav className="flex-1" aria-label="Tutor studio">
                <SidebarRoutes/>
            </nav>

            <div className="mx-2 mt-6 rounded-2xl bg-ink-soft p-4">
                <p className="text-sm font-medium text-white">Tutor studio</p>
                <p className="mt-1 text-xs text-[#A9AAB5]">Build courses, answer learners and track sales.</p>
            </div>
        </aside>
    )
}
