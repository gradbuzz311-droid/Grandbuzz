import type { Metadata } from "next";
import { Syne, DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["300"],
});

export const metadata: Metadata = {
  title: "GradBuzz | Student Advice & Jobs",
  description: "Where student ambition meets real advice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${fraunces.variable} antialiased`}
    >
      <body className={`min-h-screen bg-brand-cream text-brand-midnight font-sans`}>{children}</body>
    </html>
  );
}
