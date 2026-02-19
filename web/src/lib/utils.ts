import { ROUTE, ROUTE_DEFINITIONS } from "@/consts"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const minutesToMilliseconds = (minutes: number): number => minutes * 60 * 1000

export const isHomeRoute = (currentPath: string): boolean => currentPath === ROUTE_DEFINITIONS[ROUTE.HOME].path