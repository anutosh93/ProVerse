import type { Metadata } from 'next';
import React from 'react';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-jetbrains-mono' 
});

export const metadata: Metadata = {
  title: 'ProVerse - AI Universe for Product Managers',
  description: 'Complete product development lifecycle management from ideation to deployment. Streamline your workflow with AI-powered tools for brainstorming, wireframing, code generation, and more.',
  keywords: [
    'product management',
    'AI',
    'wireframing',
    'figma',
    'PRD',
    'code generation',
    'QA automation',
    'product analytics'
  ],
  authors: [{ name: 'ProVerse Team' }],
  creator: 'ProVerse',
  publisher: 'ProVerse',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://proverse.com'),
  openGraph: {
    title: 'ProVerse - AI Universe for Product Managers',
    description: 'Complete product development lifecycle management from ideation to deployment.',
    url: 'https://proverse.com',
    siteName: 'ProVerse',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ProVerse - AI Universe for Product Managers',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProVerse - AI Universe for Product Managers',
    description: 'Complete product development lifecycle management from ideation to deployment.',
    images: ['/og-image.png'],
    creator: '@proverse',
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
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 