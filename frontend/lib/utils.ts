import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number into FCFA currency string
 * e.g. 15000 -> "15 000 FCFA"
 */
export function formatCurrency(amount: number, currency = 'FCFA'): string {
  const formatted = new Intl.NumberFormat('fr-FR').format(amount);
  return `${formatted} ${currency}`;
}

/**
 * Reads a File object as a base64 encoded string
 */
export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Strip data URL scheme prefix if present (e.g., "data:application/pdf;base64,")
        const base64Content = reader.result.includes(',')
          ? reader.result.split(',')[1]
          : reader.result;
        resolve(base64Content);
      } else {
        reject(new Error('Failed to convert file to base64 string'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
