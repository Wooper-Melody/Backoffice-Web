import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SWRProvider } from "@/components/providers/swr-provider"
import "@/lib/env-validator"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Melody Admin - Backoffice",
  description: "Admin panel for Melody music streaming platform",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="font-sans antialiased">
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  )
}
