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
            <SheetTrigger aria-label="Open tutor menu" className="size-11 rounded-full bg-white inline-flex items-center justify-center">
                <AlignJustify className="size-5"/>
            </SheetTrigger>
            <SheetContent className="bg-ink px-2 pt-8 border-none w-72" side="left" >
                <SheetTitle className="sr-only">Tutor menu</SheetTitle>
                <Sidebar/>
            </SheetContent>
        </Sheet>
    )
}
