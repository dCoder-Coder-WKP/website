import type { Metadata } from 'next';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/nav/NavBar';
import Footer from '@/components/home/Footer';
import ClientShell from '@/components/ClientShell';
import NotificationBanner from '@/components/NotificationBanner';
import { fetchNotifications, fetchSiteConfig } from '@/lib/api';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'We Knead Pizza | Generations-old Goan Baked Pizza',
  description: 'Gas oven baked pizza featuring fresh dough, healthy toppings, and amazing taste. A Carona, Goa legacy by Willie Fernandes.',
  keywords: ['pizza', 'goan pizza', 'willie fernandes', 'carona goa', 'artisanal pizza', 'fresh dough', 'gas oven pizza'],
  authors: [{ name: 'Willie Fernandes' }],
  robots: 'index, follow',
  openGraph: {
    title: 'We Knead Pizza | Goan Baked Perfection',
    description: 'Gas oven baked pizza featuring fresh dough, healthy toppings, and amazing taste. A Carona, Goa legacy by Willie Fernandes.',
    url: 'https://wekneadpizza.com',
    siteName: 'We Knead Pizza',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'We Knead Pizza | Generations-old Goan Baked Pizza',
    description: 'Gas oven baked pizza featuring fresh dough, healthy toppings, and amazing taste. A Carona, Goa legacy by Willie Fernandes.',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [notifications, config] = await Promise.all([
    fetchNotifications(),
    fetchSiteConfig()
  ]);

  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${outfit.variable} font-sans antialiased bg-bg-base text-text-primary`}
      >
        <NavBar logoUrl={config?.logo_url} />
        <ClientShell>
          <div className="relative min-h-screen flex flex-col">
             {/* Global Noise Grain Overlay for texture */}
             <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
             <main className="flex-grow">{children}</main>
             <Footer />
          </div>
          <NotificationBanner notifications={notifications} />
        </ClientShell>
      </body>
    </html>
  );
}
