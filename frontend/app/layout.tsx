import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'CoverLetter AI — Générez vos lettres de motivation en 30 secondes',
  description: 'IA qui génère des lettres de motivation personnalisées à partir de votre CV et d\'une offre d\'emploi. Export PDF inclus.',
  keywords: ['lettre de motivation', 'IA', 'emploi', 'Afrique', 'générateur', 'cover letter'],
  openGraph: {
    title: 'CoverLetter AI',
    description: 'Générez vos lettres de motivation en 30 secondes avec l\'IA',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
