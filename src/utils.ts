import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate simple random IDs for mock data
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Format numbers to currency (INR)
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date) {
  return date.toISOString().replace('T', ' ').substring(0, 19);
}
