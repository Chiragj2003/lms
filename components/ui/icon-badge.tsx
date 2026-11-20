import { LucideIcon } from "lucide-react";
import {cva, type VariantProps} from "class-variance-authority";
import { cn } from "@/lib/utils";

const backgroundVariants = cva(
    "rounded-full flex items-center justify-center bg-white",
    {
        variants : {
            variant : {
                default : "bg-white/70",
                success : "bg-white/70",
            },
            size : {
                default : "p-2",
                sm : "p-1"
            }
        },
        defaultVariants : {
            variant : "default",
            size : "default"
        }
    }
);

const iconVariants = cva(
    "",
    {
        variants : {
            variant : {
                default : "text-ink",
                success : "text-mint-deep"
            },
            size : {
                default : "h-6 w-6",
                sm : "h-4 w-4"
            }
        },
        defaultVariants : {
            variant : "default",
            size : "default"
        }
    }
);


type BackgroundVariantsProps = VariantProps<typeof backgroundVariants>;
type IconVariantsProps = VariantProps<typeof iconVariants>;

interface IconBadgeProps extends BackgroundVariantsProps, IconVariantsProps {
    icon : LucideIcon;
}

export const IconBage = ({
    icon:Icon,
    variant,
    size
} : IconBadgeProps)=> {
    return (
        <div className={cn(backgroundVariants({variant, size}))}>
            <Icon className={cn(iconVariants({variant, size}))} />
        </div>
    )
}