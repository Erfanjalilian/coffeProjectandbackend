import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import {CartProvider} from "@/contaxt/CartContext"
import {AuthProvider} from "@/contaxt/AuthContext"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "آیکسب",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
        <CartProvider>
        <Header />
        {children}
        <Footer />
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
