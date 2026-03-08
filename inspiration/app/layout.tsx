import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif"
});

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: 'We Knead Pizza - Goan Baked Artisan Pizza',
  description: 'Experience artisanal Goan wood-fired pizza crafted with 72-hour fermented dough and premium ingredients. Reserve your table at our exclusive pizzeria.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'We Knead Pizza - Artisan Pizzeria',
    description: 'Award-winning Goan wood-fired pizza experience',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
