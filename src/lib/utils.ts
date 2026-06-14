import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, addDays } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function generateTrackingToken(): string {
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const datePart = format(now, 'yyyyMMdd');
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `DL-${datePart}-${randomPart}`;
}

export function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function calculateEstimatedDate(days: number): string {
  return format(addDays(new Date(), days), 'yyyy-MM-dd');
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'dd MMM yyyy');
}

export function formatDateShort(dateStr: string): string {
  return format(new Date(dateStr), 'dd/MM/yyyy');
}
