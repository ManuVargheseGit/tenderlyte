import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
