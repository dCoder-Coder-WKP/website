import type { Metadata } from 'next';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/nav/NavBar';
import Footer from '@/components/home/Footer';
import ClientShell from '@/components/ClientShell';
import NotificationBanner from '@/components/NotificationBanner';
import { fetchNotifications } from '@/lib/api';

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

export const metadata: Metadata = {
  title: 'We Knead Pizza | Generations-old Goan Baked Pizza',
  description: 'Gas oven baked pizza featuring fresh dough, healthy toppings, and amazing taste. A Carona, Goa legacy by Willie Fernandes.',
  openGraph: {
    title: 'We Knead Pizza | Goan Baked Perfection',
    description: 'Gas oven baked pizza featuring fresh dough, healthy toppings, and amazing taste. A Carona, Goa legacy by Willie Fernandes.',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const notifications = await fetchNotifications();

  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${outfit.variable} font-sans antialiased bg-bg-base text-text-primary`}
      >
        <NavBar />
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
