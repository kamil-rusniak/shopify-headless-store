import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { CartProvider } from '@/lib/cart-context';
import { Header, CartDrawer } from '@/components';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Shopify Headless Store',
  description: 'A modern headless storefront powered by Shopify and Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white font-sans antialiased dark:bg-zinc-950`}
      >
        <CartProvider>
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <CartDrawer />
          <footer className="border-t border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-zinc-500">
                &copy; {new Date().getFullYear()} Store. Powered by Shopify &
                Next.js
              </p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
