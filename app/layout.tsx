import type { Metadata } from 'next';
import './globals.css';
import './template2.css';
import './arts.css';

export const metadata: Metadata = {
  title: 'BJOT Image Builder',
  description: 'Create consistent branded UTME question and solution cards.',
  openGraph: {
    title: 'BJOT Image Builder',
    description: 'Create consistent branded UTME question and solution cards.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BJOT Image Builder',
    description: 'Create consistent branded UTME question and solution cards.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
