import type {Metadata, Viewport} from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import {AuthProvider} from "../context/AuthContext";
import React from "react";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "DisasterRescue",
  description: "Real-time disaster monitoring and alerts for South Africa",
  keywords: "disaster response, emergency management, South Africa, alerts",
  authors: [{ name: "Disaster Response Team" }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen bg-gray-900`}>
      <AuthProvider>
        <main className="relative">
          {children}
        </main>
      </AuthProvider>
      </body>
    </html>
  )
}
