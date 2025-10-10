import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SWRProvider } from "@/components/providers/swr-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import VercelAnalytics from "@/components/analytics/vercel-analytics"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Melody Admin - Backoffice",
  description: "Admin panel for Melody music streaming platform",
  keywords: ["melody", "admin", "backoffice", "music", "streaming", "management"],
  authors: [
    { name: 'Wooper Melody' }
  ],
  creator: 'Wooper Melody',
  publisher: 'Wooper Melody',
  applicationName: 'Melody Admin',
  icons: {
    icon: [
      { url: '/abstract-soundscape.png', type: 'image/png' },
    ],
    shortcut: '/abstract-soundscape.png'
  },
  openGraph: {
    title: 'Melody Admin - Backoffice',
    description: 'Admin panel for Melody music streaming platform',
    siteName: 'Melody Admin',
    images: [
      {
        url: '/abstract-soundscape.png',
        width: 1200,
        height: 630,
        alt: 'Melody Admin'
      }
    ],
    locale: 'en_US',
    type: 'website'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <AuthProvider>
          <SWRProvider>
            {children}
            <Toaster />
            {process.env.NODE_ENV === 'production' && <VercelAnalytics />}
          </SWRProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
