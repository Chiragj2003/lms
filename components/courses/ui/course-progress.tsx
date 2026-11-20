import { Progress } from "@/components/ui/custom-progress";
import { cn } from "@/lib/utils";


interface CourseProgressProps {
    value: number;
    variant : "default" | "success";
    size? : "default" | "sm";
}

const colorByVariant = {
    default : "text-ink",
    success : "text-mint-deep"
}

const sizeByVariant = {
    default : "text-sm",
    sm : "text-xs"
}

export const CourseProgress = ({
    size,
    value,
    variant
} : CourseProgressProps ) => {
    return (
        <div>
            <Progress
                className="bg-ink/10"
                value={value}
                variant={variant}
            />
            <p className={cn(
                "font-semibold mt-2",
                colorByVariant[variant||"default"],
                sizeByVariant[size || "default"]
            )}>
                {Math.round(value)}% complete
            </p>
        </div>
    )
}
