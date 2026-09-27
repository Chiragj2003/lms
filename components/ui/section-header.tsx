import * as React from "react"
import { cn } from "@/lib/utils"

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4", className)}>
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
