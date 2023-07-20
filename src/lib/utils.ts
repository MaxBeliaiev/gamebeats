import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { AxiosError } from 'axios'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getAxiosErrorMessage = (error: AxiosError): string =>
  (error.response?.data as string) || error.message || 'Something went wrong'
