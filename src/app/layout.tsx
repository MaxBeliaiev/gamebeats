import './globals.css'
import { Inter } from 'next/font/google'
import AuthProvider from '@/components/AuthProvider'
import { Toaster } from 'react-hot-toast'
import React from 'react'
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Admin GameBeats',
  description: 'UFC4 Tournaments & Streams',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-full relative`}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster position="top-center" reverseOrder={false} />
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
      </body>
    </html>
  )
}
