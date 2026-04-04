import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "./providers";
import MainNavbar from "@/components/navigations/MainNavbar";
import { Chatbot } from "@/components/chat/Chatbot";
import Footer from "@/components/common/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#3b82f6",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  title: {
    default: "UrbanKey - AI-Powered Rental Platform | Zero Brokerage",
    template: "%s | UrbanKey",
  },
  description: "India's first AI-powered, broker-free rental platform connecting verified tenants directly with verified landlords. Find your perfect home with zero brokerage.",
  keywords: [
    "rental platform",
    "zero brokerage",
    "property search",
    "AI rental",
    "tenant verification",
    "landlord verification",
    "rent agreement",
    "Indian rental",
    "Bangalore rental",
    "property management",
  ],
  authors: [{ name: "UrbanKey Team" }],
  creator: "UrbanKey",
  publisher: "UrbanKey",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://urban-key-one.vercel.app",
    siteName: "UrbanKey",
    title: "UrbanKey - AI-Powered Rental Platform",
    description: "Find your perfect home with zero brokerage. AI-powered search, verified landlords, and digital agreements.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "UrbanKey - Find Your Perfect Home",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UrbanKey - AI-Powered Rental Platform",
    description: "Find your perfect home with zero brokerage.",
    images: ["/twitter-image.jpg"],
    creator: "@urbankey",
    site: "@urbankey",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://urbankey.com",
    languages: {
      "en-IN": "https://urbankey.com",
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    // other verification codes
  },
  category: "real estate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Preconnect to important origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.mapbox.com" />
        <link rel="preconnect" href="https://events.mapbox.com" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://api.clerk.com" />
        <link rel="dns-prefetch" href="https://img.clerk.com" />
        
        {/* Fonts */}
        <link 
          href="https://api.fontshare.com/v2/css?f[]=khand@300,400,700&f[]=array@401,400,700&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Google Analytics (Optional) */}
        {process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        
        <Providers>
          <div className="w-full h-full min-h-screen">
            <MainNavbar />
            <main className="pt-16 md:pt-18 min-h-screen h-full flex w-full flex-col">
              {children}
            </main>
            <Footer />
            <Chatbot />
          </div>
        </Providers>
      </body>
    </html>
  );
}