import { cn } from "@/lib/utils";
import { FaStar } from "react-icons/fa";

interface RatingGraphProps {
    label : number;
    total : number;
    reviews : number;
    className : string;
}


export const RatingGraph = async({
    label,
    reviews,
    total,
    className
} : RatingGraphProps ) => {

    const calculatePercentage = ()=>{
        if ( total === 0 ) return 0;
        const percentage = (reviews*100)/total;
        return percentage;
    }

    return (
        <div className="w-full flex items-center gap-x-2">
            <div className="flex gap-x-1 items-center">
                <span className={cn(
                    "text-sm font-medium text-ink-2 w-3",
                    label === 1 && "pr-1"
                )}>
                    {label}
                </span>
                <FaStar
                    className="text-[#e6b838] size-3.5"
                />
            </div>
            <div className="flex-1 h-2.5 rounded-full bg-white overflow-hidden">
                <div 
                    className={cn(
                        "rounded-full h-full",
                        className
                    )} 
                    style={{
                        width : `${calculatePercentage()}%`
                    }}
                />
            </div>
            <div className="text-sm text-ink-2 w-6 text-right">
                {reviews}
            </div>
        </div>
    )
}