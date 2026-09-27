import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { SidebarRoutes } from "./sidebar-routes";


export const Sidebar = () => {
    return (
        <aside className="h-full flex flex-col overflow-y-auto">
            {/* Branding */}
            <div className="p-4 pt-5 pb-6">
                <Link href="/" className="flex items-center gap-x-2.5">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-base font-bold text-white tracking-tight">
                        LearnIt
                    </span>
                </Link>
            </div>
            
            {/* Navigation */}
            <div className="flex-1 py-2">
                <SidebarRoutes/>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-500">Tutor Portal</p>
            </div>
        </aside>
    )
}
