"use client";

import { AlertTriangle, CheckCircle, CheckCircleIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";


const bannerVariants = cva(
    "border-b text-center px-4 py-3 text-sm font-medium flex items-center w-full",
    {
        variants : {
            variant : {
                warning : "bg-warning/15 border-warning/30 text-warning-foreground",
                success : "bg-success/10 border-success/30 text-success"
            }
        },
        defaultVariants : {
            variant : "warning"
        }
    }
);

interface BannerProps extends VariantProps<typeof bannerVariants> {
    label: string;
}

const iconMap = {
    warning : AlertTriangle,
    success : CheckCircleIcon
}

export const Banner = ({
    label,
    variant
} : BannerProps) => {

    const Icon = iconMap[variant || "warning"]
    
    return (
        <div className={cn(bannerVariants({variant}))} >
            <Icon className="h-4 w-4 mr-2"  />
            { label }
        </div>
    )
}
