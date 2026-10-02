import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// API routes reply with a plain-text reason on failure; show that rather
// than a generic message when there is one.
export function errorMessage(error: unknown, fallback = "Something went wrong") {
  const data = (error as { response?: { data?: unknown } })?.response?.data
  return typeof data === "string" && data.trim() ? data : fallback
}
