'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  FileText,
  Zap,
  Target,
  CheckCircle2,
  Upload,
  ClipboardPaste,
  Download,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <Sparkles className="h-6 w-6 text-indigo-400" />
            CoverLetter AI
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">
              Fonctionnalités
            </a>
            <a href="#how" className="text-sm text-slate-400 hover:text-white transition-colors">
              Comment ça marche
            </a>
            <a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">
              Tarifs
            </a>
            <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors">
              Connexion
            </Link>
            <Button size="sm" asChild>
              <Link href="/dashboard">Essayer gratuitement</Link>
            </Button>
          </div>

          <button
            className="text-slate-300 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="flex flex-col gap-4 border-t border-slate-800 px-6 py-4 md:hidden">
            <a href="#features" className="text-sm text-slate-400" onClick={() => setMenuOpen(false)}>
              Fonctionnalités
            </a>
            <a href="#how" className="text-sm text-slate-400" onClick={() => setMenuOpen(false)}>
              Comment ça marche
            </a>
            <a href="#pricing" className="text-sm text-slate-400" onClick={() => setMenuOpen(false)}>
              Tarifs
            </a>
            <Link href="/login" className="text-sm text-slate-300" onClick={() => setMenuOpen(false)}>
              Connexion
            </Link>
            <Button size="sm" asChild>
              <Link href="/dashboard">Essayer gratuitement</Link>
            </Button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-slate-950 to-slate-950" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-indigo-600/10 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-800/50 bg-indigo-950/50 px-4 py-1.5 text-sm text-indigo-300">
            <Zap className="h-4 w-4" />
            Propulsé par le Deep Learning
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl">
            Générez vos lettres de
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              motivation en 30 secondes
            </span>
          </h1>

          <p className="mb-8 text-lg text-slate-400 md:text-xl">
            Importez votre CV, collez l'offre d'emploi. Notre IA génère une lettre
            de motivation unique, personnalisée et prête à envoyer. Export PDF inclus.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Essayer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#how">Voir comment ça marche</a>
            </Button>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            1 lettre gratuite • Sans carte bancaire • Export PDF inclus
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            Pourquoi CoverLetter AI ?
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-950/50 border border-indigo-800/50">
                  <Target className="h-6 w-6 text-indigo-400" />
                </div>
                <CardTitle>100% Personnalisé</CardTitle>
                <CardDescription>
                  Chaque lettre est unique. L'IA analyse votre CV et l'offre pour
                  créer une lettre qui met en avant vos compétences correspondantes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-950/50 border border-violet-800/50">
                  <Zap className="h-6 w-6 text-violet-400" />
                </div>
                <CardTitle>Ultra Rapide</CardTitle>
                <CardDescription>
                  30 secondes suffisent. Plus besoin de passer des heures à rédiger
                  une lettre pour chaque candidature. Gagnez du temps, postulez plus.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-950/50 border border-emerald-800/50">
                  <FileText className="h-6 w-6 text-emerald-400" />
                </div>
                <CardTitle>Export PDF Pro</CardTitle>
                <CardDescription>
                  Téléchargez votre lettre en PDF professionnel, prêt à joindre
                  à votre candidature. Format propre et élégant via DocEngine.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            Comment ça marche
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/20 border border-indigo-700/50">
                <Upload className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">1. Importez votre CV</h3>
              <p className="text-sm text-slate-400">
                Uploadez votre CV en PDF ou collez-le en texte. L'IA l'analyse
                automatiquement.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/20 border border-violet-700/50">
                <ClipboardPaste className="h-8 w-8 text-violet-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">2. Collez l'offre d'emploi</h3>
              <p className="text-sm text-slate-400">
                Copiez le lien ou le texte de l'offre. L'IA identifie les
                compétences recherchées.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600/20 border border-emerald-700/50">
                <Download className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">3. Recevez votre lettre</h3>
              <p className="text-sm text-slate-400">
                Votre lettre personnalisée est générée en 30 secondes.
                Téléchargez-la en PDF, prête à envoyer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">
            Des tarifs simples et accessibles
          </h2>
          <p className="mb-12 text-center text-slate-400">
            Payez en FCFA via Mobile Money (MTN, Moov, Orange) ou carte bancaire
          </p>

          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            <Card className="border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl">Gratuit</CardTitle>
                <CardDescription>Parfait pour tester</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">0</span>
                  <span className="text-lg text-slate-400"> FCFA</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    1 lettre de motivation gratuite
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Export PDF inclus
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Ton personnalisable
                  </li>
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard">Commencer gratuitement</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-indigo-700/50 ring-1 ring-indigo-700/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-bl-lg">
                Populaire
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>Pour les chercheurs d'emploi actifs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">15 000</span>
                  <span className="text-lg text-slate-400"> FCFA</span>
                  <span className="text-sm text-slate-500"> / mois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Lettres illimitées
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Export PDF professionnel
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    3 tons au choix (formel, créatif, direct)
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Français & Anglais
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Paiement Mobile Money
                  </li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/dashboard">Passer au plan Pro</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white">
            Prêt à décrocher votre prochain emploi ?
          </h2>
          <p className="mb-8 text-lg text-slate-400">
            Rejoignez les chercheurs d'emploi qui gagnent du temps avec CoverLetter AI.
          </p>
          <Button size="lg" asChild>
            <Link href="/dashboard">
              Générer ma première lettre
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-500">
          <p>© 2026 CoverLetter AI. Fait avec ❤️ en Afrique.</p>
        </div>
      </footer>
    </div>
  );
}
