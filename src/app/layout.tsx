import type { Metadata } from 'next';
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { RootLayoutClient } from "@/components/layout/RootLayoutClient";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const satoshi = localFont({
  src: "../fonts/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
});

const siteUrl = 'https://classymart-com.netlify.app'; // Replace with your actual production domain

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | Classy Mart',
    default: 'Classy Mart | Premium Men\'s Fashion & Clothing in Bangladesh',
  },
  description: 'Discover authentic, premium quality men\'s clothing at Classy Mart. Shop the latest collection of shirts, t-shirts, pants, jackets, and Panjabis online in Bangladesh. Cash on delivery available.',
  keywords: ['online shopping Bangladesh', 'mens fashion BD', 'premium clothing', 'Classy Mart', 'buy shirts online', 'polo t-shirt price BD', 'formal pants', 'panjabi collection', 'mens clothing Bangladesh', 'fashion BD'],
  authors: [{ name: 'Classy Mart' }],
  creator: 'Classy Mart',
  publisher: 'Classy Mart',
  openGraph: {
    title: 'Classy Mart | Premium Authentic Clothing',
    description: 'The new standard for men\'s fashion in Bangladesh.',
    url: siteUrl,
    siteName: 'Classy Mart',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Classy Mart Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Classy Mart | Premium Authentic Clothing',
    description: 'The new standard for men\'s fashion in Bangladesh.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'OfC4YqWL8D2j3b-KUEOKeQkVbazla9bHZVSTG5MG0xQ',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${satoshi.variable}`}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}