"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { BarChart, LibraryBig, MessageCircleQuestion, Plus } from "lucide-react";
import { SidebarItem } from "./sidebar-item";

export const SidebarRoutes = () => {
    
    const pathname = usePathname();
    
    const routes = useMemo(()=>[
        {
            label : "Courses",
            Icon : LibraryBig,
            href : "/tutor/courses",
            active : pathname === "/tutor/courses"
        },
        {
            label : "Questions",
            Icon : MessageCircleQuestion,
            href : "/tutor/questions",
            active : pathname === "/tutor/questions"
        },
        {
            label : "Analytics",
            Icon : BarChart,
            href : "/tutor/analytics",
            active : pathname === "/tutor/analytics"
        },
        {
            label : "Add Course",
            Icon : Plus,
            href : "/tutor/create",
            active : pathname === "/tutor/create"
        },

    ], [pathname]);
    
    return (
        <ul className="flex flex-col w-full list-none space-y-1">
            {
                routes.map((route)=>(
                    <SidebarItem
                        key = {route.href}
                        {...route}
                    />
                ))
            }
        </ul>
    )
}
