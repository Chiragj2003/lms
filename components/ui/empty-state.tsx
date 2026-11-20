import * as React from "react"
import { cn } from "@/lib/utils"

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center space-y-4", className)}>
      {icon && <div className="size-24 rounded-full bg-peri-soft text-ink flex items-center justify-center [&_svg]:size-9">{icon}</div>}
      <div className="space-y-1">
        <h3 className="text-xl font-medium tracking-tight">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
