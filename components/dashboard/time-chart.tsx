import { timeSpendByUser } from "@/server/dashboard";
import { GraphChart } from "./graph-chart";

interface TimeChartProps {
    userId: string;
}

export const TimeChart = async({
    userId
}: TimeChartProps) => {
    
    const data = await timeSpendByUser(userId);

    if (!data) {
        return null;
    }

    return (
        <div className="w-full h-full">
            <GraphChart data={data} />
        </div>
    )
}
