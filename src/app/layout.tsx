import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/nav/NavBar';
import ClientShell from '@/components/ClientShell';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'We Knead Pizza',
  description: 'Cinematic procedural pizza crafted with mathematical precision.',
  openGraph: {
    title: 'We Knead Pizza',
    description: 'Cinematic procedural pizza crafted with mathematical precision.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased bg-[#0A0705] text-[#F2EDDF]`}
      >
        <NavBar />
        <ClientShell>
          <main>{children}</main>
        </ClientShell>
      </body>
    </html>
  );
}
