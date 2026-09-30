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
        <div className="bg-card border border-border rounded-2xl flex items-center gap-x-4 p-4 shadow-sm">
            <div className="shrink-0">
                <IconBage icon={icon} variant={variant} />
            </div>
            <div className="flex flex-col text-sm">
                <p className="text-base font-semibold text-foreground">{label}</p>
                <span className="text-muted-foreground" >{value} {value===1?"Question" :"Questions"}</span>
            </div>
        </div>
    )
}
