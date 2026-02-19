import { APPLE_MODIFIER_KEY, DEFAULT_MODIFIER_KEY, ROUTE, ROUTE_DEFINITIONS } from "@/consts"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const minutesToMilliseconds = (minutes: number): number => minutes * 60 * 1000

export const isHomeRoute = (currentPath: string): boolean => currentPath === ROUTE_DEFINITIONS[ROUTE.HOME].path

export const isAppleDevice = () => {
  return navigator.platform.startsWith("Mac") || navigator.platform.startsWith("iP")
}

export const getModifierKey = () => {
  if (typeof navigator === 'undefined') return DEFAULT_MODIFIER_KEY;
  return isAppleDevice() ? APPLE_MODIFIER_KEY : DEFAULT_MODIFIER_KEY;
}