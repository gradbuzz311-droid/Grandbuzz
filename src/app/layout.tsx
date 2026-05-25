import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gradbuzz.sikshanext.in'),
  title: {
    default: "GradBuzz — Real Insights for Students",
    template: "%s | GradBuzz"
  },
  description: "A premium knowledge platform for students featuring raw, unfiltered advice from peers navigating placements, internships, and higher studies.",
  keywords: ["student advice", "placements", "internships", "higher studies", "resume review", "coding interviews", "campus life"],
  authors: [{ name: "Sikshanext Private Limited" }],
  creator: "GradBuzz Team",
  publisher: "Sikshanext Private Limited",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://gradbuzz.sikshanext.in",
    title: "GradBuzz — Real Insights for Students",
    description: "Curated knowledge. Practical advice. Career clarity. Raw, unfiltered advice from the students who are currently navigating the grind.",
    siteName: "GradBuzz",
    images: [{
      url: "/gradbuzz.png",
      width: 1200,
      height: 630,
      alt: "GradBuzz - Real Insights for Students"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "GradBuzz — Real Insights for Students",
    description: "A premium knowledge platform for students featuring raw, unfiltered advice from peers.",
    images: ["/gradbuzz.png"],
    creator: "@gradbuzz"
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
  icons: {
    icon: [
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_io/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon_io/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/favicon_io/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'manifest',
        url: '/favicon_io/site.webmanifest',
      },
    ],
  },
  alternates: {
    canonical: 'https://gradbuzz.sikshanext.in',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GradBuzz',
    url: 'https://gradbuzz.sikshanext.in',
    description: 'A premium knowledge platform for students featuring raw, unfiltered advice from peers navigating placements, internships, and higher studies.',
    publisher: {
      '@type': 'Organization',
      name: 'Sikshanext Private Limited',
      logo: {
        '@type': 'ImageObject',
        url: 'https://gradbuzz.sikshanext.in/gradbuzz.png'
      }
    }
  };

  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-brand-cream text-brand-midnight font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
