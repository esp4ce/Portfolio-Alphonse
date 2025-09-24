import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import FloatingLinkedInButton from "./components/FloatingLinkedInButton"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://alphonse.pro'),
  title: {
    default: 'Alphonse — Portfolio',
    template: '%s | Alphonse',
  },
  description: 'Full‑Stack JS Developer (Next.js, Node, Supabase). Projects, games, contact.',
  applicationName: 'Alphonse Portfolio',
  authors: [{ name: 'Alphonse', url: 'https://alphonse.pro' }],
  creator: 'Alphonse',
  publisher: 'Alphonse',
  keywords: ['Alphonse', 'Portfolio', 'Developer', 'Full-Stack', 'JavaScript', 'Next.js', 'Node', 'Supabase'],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://alphonse.pro',
    title: 'Alphonse — Portfolio',
    description: 'Full‑Stack JS Developer (Next.js, Node, Supabase). Projects, games, contact.',
    siteName: 'Alphonse',
    locale: 'en_US',
    images: [
      {
        url: '/favicon.ico',
        width: 64,
        height: 64,
        alt: 'Alphonse Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary',
    site: '@',
    creator: '@',
    title: 'Alphonse — Portfolio',
    description: 'Full‑Stack JS Developer (Next.js, Node, Supabase).',
    images: ['/favicon.ico'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'technology',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Analytics/>
        {children}
        {/* JSON-LD Person + WebSite */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Alphonse',
              url: 'https://alphonse.pro',
              email: 'mailto:contact@alphonse.pro',
              jobTitle: 'Full‑Stack Developer',
              sameAs: [
                'https://linkedin.com/in/alphonse-schwartz-613479294'
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Alphonse — Portfolio',
              url: 'https://alphonse.pro',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://alphonse.pro/?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              }
            }),
          }}
        />
        <FloatingLinkedInButton />
      </body>
    </html>
  );
}
