import * as React from "react"
import { cn } from "@/lib/utils"

export interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  tone?: 'white' | 'peri' | 'lilac' | 'mint' | 'sun' | 'peach' | 'aqua';
}

const TONES = {
  white: "bg-white",
  peri: "bg-peri",
  lilac: "bg-lilac",
  mint: "bg-mint",
  sun: "bg-sun",
  peach: "bg-peach",
  aqua: "bg-aqua",
}

export function StatCard({ value, label, icon, trend, className, tone = "white" }: StatCardProps) {
  return (
    <div className={cn("rounded-3xl text-ink p-6 flex flex-col gap-5", TONES[tone], className)}>
      <div className="flex items-center justify-between gap-3">
        <p className={cn("text-sm", tone === "white" ? "text-muted-foreground" : "text-ink-2")}>{label}</p>
        {icon && <div className={cn("size-9 rounded-full flex items-center justify-center text-ink", tone === "white" ? "bg-soft" : "bg-white/70")}>{icon}</div>}
      </div>
      <div className="flex items-center gap-2">
        <h3 className="text-[32px] leading-none font-medium tracking-tight">{value}</h3>
        {trend === 'up' && <span className="text-mint-deep text-sm font-medium">↑</span>}
        {trend === 'down' && <span className="text-destructive text-sm font-medium">↓</span>}
        {trend === 'neutral' && <span className="text-muted-foreground text-sm font-medium">-</span>}
      </div>
    </div>
  )
}
