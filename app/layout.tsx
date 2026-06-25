import type {Metadata} from 'next';
import { Inter, Atkinson_Hyperlegible } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const atkinson = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-atkinson',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Agenda Solidaria - Gestão de Impacto',
  description: 'Plataforma para conectar voluntários e gerenciar eventos sociais.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${atkinson.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-background text-on-surface">
        {children}
      </body>
    </html>
  );
}
