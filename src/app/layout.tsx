import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GlowCart — Premium Beauty, Delivered | by TrishulHub",
  description: "Discover curated collections of luxury cosmetics, skincare, and beauty essentials. A TrishulHub demo — professional e-commerce with 4 user roles, real-time tracking, and industry-grade design.",
  keywords: ["GlowCart", "TrishulHub", "cosmetics", "beauty", "skincare", "makeup", "e-commerce", "premium beauty", "demo"],
  authors: [{ name: "TrishulHub", url: "https://github.com/trishulhub-svg" }],
  icons: {
    icon: "/trishulhub-logo.png",
  },
  openGraph: {
    title: "GlowCart — Premium Beauty, Delivered",
    description: "A TrishulHub demo — professional cosmetic e-commerce with 4 user roles",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
