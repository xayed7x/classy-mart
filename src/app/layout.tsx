import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { ParallaxProviderWrapper } from "@/components/providers/ParallaxProviderWrapper";
import { Header } from "@/components/layout/Header";
import { BottomNavBar } from "@/components/layout/BottomNavBar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const satoshi = localFont({
  src: "../fonts/Satoshi-Variable.ttf", // We will add this font file later
  variable: "--font-satoshi",
});

export const metadata: Metadata = {
  title: "Classy Mart",
  description: "The new standard in modern apparel.",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${satoshi.variable}`}>
        <ParallaxProviderWrapper>
          <Header />
          {children}
          <Footer />
          <BottomNavBar />
        </ParallaxProviderWrapper>
      </body>
    </html>
  );
}
