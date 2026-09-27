"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Navigation = () => {
    
    const router = useRouter();
    
    return (
        <div className="flex items-center gap-x-2">
            <Button
                className="rounded-full"
                size="icon"
                variant="outline"
                onClick={()=>router.back()}
                aria-label="Go back"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
                className="rounded-full"
                size="icon"
                variant="outline"
                onClick={()=>router.forward()}
                aria-label="Go forward"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}
