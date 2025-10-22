import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const mapStatusToCustomerFriendlyText = (status: string): string => {
  if (status === 'pending') {
    return 'Confirmed';
  }
  // Capitalize other statuses for a cleaner look
  return status.charAt(0).toUpperCase() + status.slice(1);
};