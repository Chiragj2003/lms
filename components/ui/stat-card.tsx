import * as React from "react"
import { cn } from "@/lib/utils"

export interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatCard({ value, label, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="flex items-center gap-2">
        <h3 className="text-2xl font-bold">{value}</h3>
        {trend === 'up' && <span className="text-teal-600 text-sm font-medium">↑</span>}
        {trend === 'down' && <span className="text-destructive text-sm font-medium">↓</span>}
        {trend === 'neutral' && <span className="text-muted-foreground text-sm font-medium">-</span>}
      </div>
    </div>
  )
}
