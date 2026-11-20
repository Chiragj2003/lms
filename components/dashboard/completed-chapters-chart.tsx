import { chaptersCompletedInPast } from "@/server/dashboard";
import { ChaptersChart } from "./chapters-chart";

interface CompletedChaptersChartProps {
    userId: string;
}

export const CompletedChaptersChart = async({
    userId
}: CompletedChaptersChartProps ) => {
    
    const data = await chaptersCompletedInPast(userId);

    if (!data) {
        return null;
    }

    return (
        <div className="w-full h-full">
            <ChaptersChart data={data} />
        </div>
    )
}
