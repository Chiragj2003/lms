"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card"

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

interface RevenueChartProps {
    data : {
        name : string;
        total : number;
    }[]
}

export const RevenueChart = ({
    data
}: RevenueChartProps ) => {
    
    const empty = !data.some((d) => d.total > 0);

    return (
        <Card className="rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Revenue by Course</CardTitle>
            </CardHeader>
            <CardContent>
                {empty ? (
                    <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                        No course sales yet.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis 
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value)=>(`Rs ${value}`)}
                            />
                            <Tooltip
                                formatter={(value : number)=>(
                                    [`Rs ${value}`, "Revenue"]
                                )}
                                contentStyle={{ fontSize: 12, borderRadius: 6 }}
                                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                            />
                            <Bar 
                                dataKey="total"
                                fill="hsl(var(--primary))"
                                radius={[6, 6, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    )
}
