"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { formatPrice } from "@/lib/format";

interface DataCardProps {
    value: number;
    label: string;
    shouldFormat?: boolean;
    hint?: string;
}

export const DataCard = ({
    label,
    value,
    shouldFormat,
    hint
} : DataCardProps ) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium" >{label}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl text-zinc-800 font-bold">
                    {shouldFormat ? formatPrice(value) : value}
                </div>
                {hint && (
                    <p className="text-xs text-zinc-500 mt-1">{hint}</p>
                )}
            </CardContent>
        </Card>
    )
}
