import type { Metadata } from "next";
import { DM_Sans} from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/common/Navbar";

const dmSans = DM_Sans({
  subsets:["latin"],
  display:"swap",
  variable:"--font-dm-sans"
})

export const metadata: Metadata = {
  title: "UrbanKey",
  description: "An AI assisted rental app",
  icons:{
    icon:"/favicon.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className}`}
      >
        <Providers>
        <div className="h-full w-full">
        <Navbar />
        <main className={`pt-16 h-full flex w-full flex-col`}>
          {children}
          </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
