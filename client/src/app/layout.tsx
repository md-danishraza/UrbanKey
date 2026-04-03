import type { Metadata } from "next";
import { Barlow, Barlow_Semi_Condensed } from 'next/font/google';
import "./globals.css";
import Providers from "./providers";

import MainNavbar from "@/components/navigations/MainNavbar";
import { Chatbot } from "@/components/chat/Chatbot";
import Footer from "@/components/common/Footer";
;



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
      <link href="https://api.fontshare.com/v2/css?f[]=khand@300,400,700&f[]=array@401,400,700&display=swap" rel="stylesheet"
      precedence="default"
      />
   
      <body 
     
      >
        <Providers>
        <div className=" w-full h-full min-h-screen">
         
          <MainNavbar/>
          <main className={`pt-16 md:pt-18 min-h-screen   h-full flex w-full flex-col`}>
            {children}
          </main>
          <Footer/>
          <Chatbot/>
        </div>
        </Providers>
      </body>
    </html>
  );
}
