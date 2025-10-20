"use client"; // Convert to a Client Component

import { useState, useEffect } from "react"; // Import useState and useEffect
import { usePathname } from "next/navigation"; // Import the hook
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { ParallaxProviderWrapper } from "@/components/providers/ParallaxProviderWrapper";
import { Header } from "@/components/layout/Header";
import { BottomNavBar } from "@/components/layout/BottomNavBar";
import { Footer } from "@/components/layout/Footer";
import { CartController } from "@/components/cart/CartController";
import { ImmersiveSearch } from "@/components/layout/ImmersiveSearch";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const satoshi = localFont({
  src: "../fonts/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isProductPage = pathname.startsWith("/products");

  const [isDesktop, setIsDesktop] = useState(false); // State to track desktop view

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024); // Assuming 1024px is the desktop breakpoint
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${satoshi.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <ParallaxProviderWrapper>
            <CartController />
            <ImmersiveSearch />
            {(!isProductPage || (isProductPage && isDesktop)) && <Header />}
            {children}
            <Footer />
            {!isProductPage && <BottomNavBar />}
          </ParallaxProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
