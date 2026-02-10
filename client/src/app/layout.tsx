import type { Metadata } from "next";
import { DM_Sans} from "next/font/google";
import "./globals.css";
import Providers from "./providers";

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
          {children}
        </Providers>
      </body>
    </html>
  );
}
