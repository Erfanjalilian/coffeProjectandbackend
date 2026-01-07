import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { CartProvider } from "@/contaxt/CartContext";
import { AuthProvider } from "@/contaxt/AuthContext";
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
  description: "توضیح کوتاه درباره سایت",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <head>
        {/* متای سفارشی */}
        <meta name="enamad" content="48702043" />
        {/* می‌توانی متای دیگر هم اضافه کنی */}
        <meta name="keywords" content="Next.js, آیکسب, فروشگاه" />
      </head>
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
