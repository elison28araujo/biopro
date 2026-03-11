import type { Metadata } from 'next';
import { inter, spaceGrotesk, jetbrainsMono } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'BioPro - Seu Link na Bio Profissional',
    template: '%s | BioPro',
  },
  description: 'Transforme seu Instagram em uma máquina de conversão com BioPro.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-white text-slate-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
