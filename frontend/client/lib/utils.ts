import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// If you don't have clsx and tailwind-merge, use this simpler version instead:
// export function cn(...classes: string[]) {
//   return classes.filter(Boolean).join(' ')
// }