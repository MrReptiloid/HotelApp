import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'HotelApp - Hotel Booking System',
    template: '%s | HotelApp',
  },
  description: 'Book your perfect hotel room with ease. Browse hotels, compare prices, and make reservations online.',
  keywords: ['hotel', 'booking', 'reservation', 'accommodation', 'travel'],
  authors: [{ name: 'HotelApp Team' }],
  creator: 'HotelApp',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'http://localhost:3000',
    title: 'HotelApp - Hotel Booking System',
    description: 'Book your perfect hotel room with ease',
    siteName: 'HotelApp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HotelApp - Hotel Booking System',
    description: 'Book your perfect hotel room with ease',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

