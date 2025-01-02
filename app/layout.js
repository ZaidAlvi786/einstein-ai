"use client";
import React from "react";
import { ModelStatusProvider } from "@/components/context/ModelStatusContext";
import { NewChatProvider } from "@/components/context/NewChatContext";
import { Work_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "./contexify.css";
import { GOOGLE_CLIENT_ID } from "@/config";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "../app/authContext/auth";
import StoreProvider from "./StoreProvider";
import Head from "next/head";
import Script from "next/script";

const nasalization = localFont({
  src: "./nasalization-rg.otf",
  variable: "--font-nasalization",
  display: "swap",
});
const montserrat = localFont({
  src: "./Montserrat-Regular.ttf",
  variable: "--font-montserrat",
});
const helvetica = localFont({
  src: "./Helvetica.ttf",
  variable: "--font-helvetica",
  weight: "100 400 300 900",
});
const helvetica_neue = localFont({
  src: "./Helvetica Neue.otf",
  variable: "--font-helvetica_neue",
});
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-worksans",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <body
        className={`${nasalization.variable} ${montserrat.variable} ${helvetica.variable} ${helvetica_neue.variable} ${workSans.variable}`}
      >
        {/* <!-- Google tag (gtag.js) --> */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-7V05R9KGNH"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7V05R9KGNH');
          `}
        </Script>
        <StoreProvider>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AuthProvider>
              <ModelStatusProvider>
                <NewChatProvider>{children}</NewChatProvider>
              </ModelStatusProvider>
            </AuthProvider>
          </GoogleOAuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
