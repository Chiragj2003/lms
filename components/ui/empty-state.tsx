import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export interface EmptyStateProps {
  icon?: React.ReactNode;
  /** Path to an illustration in /public; shown instead of the icon. */
  illustration?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, illustration, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center space-y-4", className)}>
      {illustration ? (
        <Image src={illustration} alt="" width={900} height={900} sizes="240px" className="h-44 sm:h-52 w-auto" aria-hidden="true" />
      ) : icon && (
        <div className="size-24 rounded-full bg-peri-soft text-ink flex items-center justify-center [&_svg]:size-9">{icon}</div>
      )}
      <div className="space-y-1">
        <h3 className="text-xl font-medium tracking-tight">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
