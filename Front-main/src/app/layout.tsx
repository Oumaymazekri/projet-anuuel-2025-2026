import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Footer from "./components/footer"
import Navbar from "./components/Navbar"
import { AuthProvider } from "@/app/lib/authContext"
import { CartProvider } from "./context/CartContext"
import { ProductProvider } from "./context/ProductContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: " E-Commerce Application",
  description: "A complete e-commerce application with Next.js and Wix",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <ProductProvider>
            <Navbar />
            {children}
            <Footer />
            </ProductProvider>
          
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

