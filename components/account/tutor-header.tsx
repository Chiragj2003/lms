import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { Sidebar } from "../utils/sidebar";
import { AlignJustify } from "lucide-react";

export const TutorHeader = () => {
    return (
        <Sheet>
            <SheetTrigger aria-label="Open tutor menu">
                <AlignJustify/>
            </SheetTrigger>
            <SheetContent className="bg-zinc-900 px-0 pt-10 border-none" side="left" >
                <SheetTitle className="sr-only">Tutor menu</SheetTitle>
                <Sidebar/>
            </SheetContent>
        </Sheet>
    )
}
