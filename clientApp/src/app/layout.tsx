import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "South African Disaster Response System",
  description: "Real-time disaster monitoring and alerts for South Africa",
  keywords: "disaster response, emergency management, South Africa, alerts",
  authors: [{ name: "Disaster Response Team" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen bg-gray-900`}>
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  )
}
