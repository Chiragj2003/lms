import * as React from "react"
import { cn } from "@/lib/utils"

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide';
}

export function PageContainer({ children, className, size = 'default' }: PageContainerProps) {
  const sizeClasses = {
    default: "max-w-[1320px]",
    narrow: "max-w-3xl",
    wide: "max-w-7xl",
  }

  return (
    <div className={cn("mx-auto px-4 sm:px-6 w-full", sizeClasses[size], className)}>
      {children}
    </div>
  )
}
