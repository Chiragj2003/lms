import { LucideIcon } from "lucide-react";
import { IconBage } from "../ui/icon-badge";

interface InfoCardProps {
    label : string;
    value: number;
    icon : LucideIcon;
    variant : "default" | "success"
}

export const InfoCard = ({
    icon,
    label,
    value,
    variant
} : InfoCardProps) => {
    return (
        <div className={`rounded-3xl flex items-center gap-x-4 p-5 ${variant === "success" ? "bg-mint" : "bg-peri-soft"}`}>
            <div className="shrink-0">
                <IconBage icon={icon} variant={variant} />
            </div>
            <div className="flex flex-col text-sm">
                <p className="text-sm text-ink-2">{label}</p>
                <span className="text-[28px] leading-tight font-medium tracking-tight text-ink" >{value} <span className="text-sm text-ink-2">{value===1?"question" :"questions"}</span></span>
            </div>
        </div>
    )
}
