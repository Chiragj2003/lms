"use client";

import { AlertTriangle, CheckCircle, CheckCircleIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";


const bannerVariants = cva(
    "rounded-2xl px-4 py-3 text-sm font-medium flex items-center w-full",
    {
        variants : {
            variant : {
                warning : "bg-sun text-[#4A3500]",
                success : "bg-mint text-[#0F3D22]"
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
