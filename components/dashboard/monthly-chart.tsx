"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card";

import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

interface MonthlyChartProps {
    data : {
        name : string;
        total : number;
        sales : number;
    }[]
}

export const MonthlyChart = ({
    data
}: MonthlyChartProps ) => {

    const empty = !data.some((d) => d.total > 0);

    return (
        <Card className="rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Revenue, last 6 months</CardTitle>
            </CardHeader>
            <CardContent>
                {
                    empty ? (
                        <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                            No sales in this period yet.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
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
                                    formatter={(value : number, name : string)=>(
                                        name === "total" ? [`Rs ${value}`, "Revenue"] : [value, "Sales"]
                                    )}
                                    contentStyle={{ fontSize: 12, borderRadius: 6 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={3}
                                    fill="url(#revenueFill)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )
                }
            </CardContent>
        </Card>
    )
}
