import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope"
});

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora"
});

export const metadata: Metadata = {
  title: "TenderLyte | Premium Tender Coconut Hydration",
  description:
    "TenderLyte is premium tender coconut hydration for discerning wellness, hospitality, and retail experiences."
};

export const viewport: Viewport = {
  themeColor: "#082c21"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${sora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
