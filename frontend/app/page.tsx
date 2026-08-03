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
  Clock,
  Star,
  ChevronDown,
  Pen,
  Globe,
  Smartphone,
  Shield,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Comment fonctionne la génération de lettres ?",
      a: "Importez votre CV (PDF ou texte), collez l'offre d'emploi, et notre IA analyse les deux pour créer une lettre unique qui met en avant vos compétences correspondant au poste. Le tout en moins de 30 secondes.",
    },
    {
      q: "Les lettres sont-elles vraiment uniques ?",
      a: "Oui. Chaque lettre est générée à partir de votre CV et de l'offre spécifique. Aucun template générique — l'IA adapte le ton, les compétences mises en avant et la structure selon le poste visé.",
    },
    {
      q: "Puis-je modifier la lettre générée ?",
      a: "Absolument. Après génération, la lettre est éditable directement dans l'interface. Modifiez, ajoutez ou supprimez des passages avant de l'exporter en PDF.",
    },
    {
      q: "Quels modes de paiement acceptez-vous ?",
      a: "Mobile Money (MTN MoMo, Moov Money, Orange Money) et carte bancaire. Tout est en FCFA — pas besoin de carte internationale.",
    },
    {
      q: "Mes données sont-elles sécurisées ?",
      a: "Vos CV et lettres sont stockés de manière sécurisée. Nous ne partageons jamais vos données avec des tiers. Vous pouvez supprimer votre compte à tout moment.",
    },
    {
      q: "La lettre gratuite inclut-elle l'export PDF ?",
      a: "Oui ! Le plan gratuit inclut 1 lettre complète avec export PDF professionnel. Aucune carte bancaire requise pour commencer.",
    },
  ];

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
            <a href="#faq" className="text-sm text-slate-400 hover:text-white transition-colors">
              FAQ
            </a>
            <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors">
              Connexion
            </Link>
            <Button size="sm" asChild>
              <Link href="/dashboard">Essayer gratuitement</Link>
            </Button>
          </div>

          <button className="text-slate-300 md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="flex flex-col gap-4 border-t border-slate-800 px-6 py-4 md:hidden">
            <a href="#features" className="text-sm text-slate-400" onClick={() => setMenuOpen(false)}>Fonctionnalités</a>
            <a href="#how" className="text-sm text-slate-400" onClick={() => setMenuOpen(false)}>Comment ça marche</a>
            <a href="#pricing" className="text-sm text-slate-400" onClick={() => setMenuOpen(false)}>Tarifs</a>
            <a href="#faq" className="text-sm text-slate-400" onClick={() => setMenuOpen(false)}>FAQ</a>
            <Link href="/login" className="text-sm text-slate-300" onClick={() => setMenuOpen(false)}>Connexion</Link>
            <Button size="sm" asChild>
              <Link href="/dashboard">Essayer gratuitement</Link>
            </Button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-slate-950 to-slate-950" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-indigo-600/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: copy */}
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-800/50 bg-indigo-950/50 px-4 py-1.5 text-sm text-indigo-300">
                <Zap className="h-4 w-4" />
                Propulsé par le Deep Learning
              </div>

              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                Générez des lettres de
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent"> motivation qui marquent</span>
                {' '}en 30 secondes
              </h1>

              <p className="mb-8 text-lg text-slate-400 md:text-xl">
                Importez votre CV, collez l'offre d'emploi. Notre IA crée une lettre
                unique, personnalisée et prête à envoyer. Export PDF inclus.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
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

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 lg:justify-start">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  1 lettre gratuite
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Sans carte bancaire
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Export PDF inclus
                </span>
              </div>
            </div>

            {/* Right: visual preview */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-indigo-600/20 to-violet-600/20 blur-2xl" />
              <Card className="relative border-slate-700 bg-slate-900/80 backdrop-blur">
                <CardContent className="p-6">
                  {/* Mock letter preview */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-rose-500" />
                      <div className="h-3 w-3 rounded-full bg-amber-500" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-xs text-slate-500">lettre-motivation.pdf</span>
                  </div>

                  <div className="rounded-lg bg-white p-6 shadow-lg">
                    <div className="mb-4 text-center border-b-2 border-indigo-600 pb-3">
                      <h3 className="text-lg font-bold text-slate-900">Lettre de Motivation</h3>
                      <p className="text-xs text-slate-500">Agnide Farhane — 3 août 2026</p>
                    </div>
                    <div className="space-y-3 text-sm text-slate-700">
                      <p className="font-semibold">Objet : Candidature — Développeur Full-Stack</p>
                      <p>Madame, Monsieur,</p>
                      <p>
                        Passionné par l'innovation technologique et fort de cinq années
                        d'expérience en développement Full-Stack, je vous soumets ma
                        candidature pour rejoindre votre équipe à Cotonou...
                      </p>
                      <div className="flex items-center gap-2 pt-2">
                        <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" /> Compétences matchées : React, Node.js, TypeScript
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock className="h-4 w-4 text-indigo-400" />
                      Généré en 12 secondes
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-indigo-600/20 px-3 py-1.5 text-sm text-indigo-300">
                      <Download className="h-4 w-4" />
                      PDF prêt
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-800 bg-slate-900/30 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-white md:text-4xl">30s</p>
              <p className="mt-1 text-sm text-slate-400">Temps de génération</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white md:text-4xl">100%</p>
              <p className="mt-1 text-sm text-slate-400">Personnalisé</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white md:text-4xl">FCFA</p>
              <p className="mt-1 text-sm text-slate-400">Paiement local</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white md:text-4xl">PDF</p>
              <p className="mt-1 text-sm text-slate-400">Export professionnel</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            Pourquoi passer des heures à rédiger ?
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Without */}
            <Card className="border-slate-800 bg-slate-900/30">
              <CardHeader>
                <CardTitle className="text-lg text-slate-400">Sans CoverLetter AI</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "2-3 heures par lettre de motivation",
                    "Templates génériques trouvés sur Google",
                    "Difficile d'adapter chaque lettre au poste",
                    "Formatage manuel du document",
                    "Procrastination → candidatures en retard",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-500">
                      <span className="mt-1 text-rose-500">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* With */}
            <Card className="border-indigo-700/50 bg-indigo-950/20 ring-1 ring-indigo-700/30">
              <CardHeader>
                <CardTitle className="text-lg text-white">Avec CoverLetter AI</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "30 secondes pour une lettre complète",
                    "Contenu unique basé sur votre CV + l'offre",
                    "Adaptation automatique au poste et à l'entreprise",
                    "Export PDF professionnel en 1 clic",
                    "Postulez plus, augmentez vos chances",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-200">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">
            Conçu pour les chercheurs d'emploi en Afrique
          </h2>
          <p className="mb-12 text-center text-slate-400">
            Tout ce qu'il faut pour postuler rapidement, sans friction
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-950/50 border border-indigo-800/50">
                  <Target className="h-6 w-6 text-indigo-400" />
                </div>
                <CardTitle>100% Personnalisé</CardTitle>
                <CardDescription>
                  L'IA analyse votre CV et l'offre pour créer une lettre qui
                  met en avant vos compétences correspondantes. Chaque lettre est unique.
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

            <Card>
              <CardHeader>
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-950/50 border border-sky-800/50">
                  <Pen className="h-6 w-6 text-sky-400" />
                </div>
                <CardTitle>3 Tons au Choix</CardTitle>
                <CardDescription>
                  Formel pour les postes classiques, créatif pour se démarquer,
                  ou direct pour être concis. Adaptez le style selon l'entreprise.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-950/50 border border-amber-800/50">
                  <Globe className="h-6 w-6 text-amber-400" />
                </div>
                <CardTitle>Français & Anglais</CardTitle>
                <CardDescription>
                  Postulez en France, en Afrique francophone ou à l'international.
                  L'IA génère votre lettre dans la langue de votre choix.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-rose-950/50 border border-rose-800/50">
                  <Smartphone className="h-6 w-6 text-rose-400" />
                </div>
                <CardTitle>Paiement Mobile Money</CardTitle>
                <CardDescription>
                  Payez en FCFA via MTN MoMo, Moov Money ou Orange Money.
                  Aucune carte bancaire internationale requise.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">
            3 étapes, 30 secondes
          </h2>
          <p className="mb-12 text-center text-slate-400">
            De votre CV à une lettre prête à envoyer
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/20 border border-indigo-700/50">
                <Upload className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">1. Importez votre CV</h3>
              <p className="text-sm text-slate-400">
                Uploadez votre CV en PDF ou collez-le en texte. L'IA l'analyse
                automatiquement pour extraire vos compétences et expériences.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/20 border border-violet-700/50">
                <ClipboardPaste className="h-8 w-8 text-violet-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">2. Collez l'offre d'emploi</h3>
              <p className="text-sm text-slate-400">
                Copiez le texte de l'offre. L'IA identifie les compétences
                recherchées et adapte la lettre au poste et à l'entreprise.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600/20 border border-emerald-700/50">
                <Download className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">3. Recevez votre lettre</h3>
              <p className="text-sm text-slate-400">
                Votre lettre personnalisée est générée en 30 secondes.
                Modifiez-la si besoin, puis téléchargez-la en PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">
            Ils ont trouvé leur job avec CoverLetter AI
          </h2>
          <p className="mb-12 text-center text-slate-400">
            Des chercheurs d'emploi en Afrique francophone qui gagnent du temps
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Mariam K.",
                role: "Chercheuse d'emploi — Cotonou, Bénin",
                text: "J'ai postulé à 15 postes en une semaine au lieu d'une seule candidature avant. CoverLetter AI m'a fait gagner un temps fou. Le résultat est super professionnel.",
                stars: 5,
              },
              {
                name: "Ibrahim S.",
                role: "Développeur — Dakar, Sénégal",
                text: "La lettre générée était bluffante — elle reprenait exactement les compétences de mon CV qui matchaient l'offre. J'ai eu un entretien 3 jours après.",
                stars: 5,
              },
              {
                name: "Fatou D.",
                role: "Marketing — Abidjan, Côte d'Ivoire",
                text: "Le ton créatif est génial pour se démarquer. Et le paiement en Mobile Money m'a évité de chercher une carte bancaire. Vraiment pensé pour nous.",
                stars: 5,
              },
            ].map((t, i) => (
              <Card key={i} className="border-slate-700">
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm text-slate-300">"{t.text}"</p>
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Français & Anglais
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
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Pas de filigrane
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

      {/* FAQ */}
      <section id="faq" className="py-20 bg-slate-900/30">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            Questions fréquentes
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-lg border border-slate-800 bg-slate-900/50 overflow-hidden">
                <button
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-white">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-slate-400">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-600/20 to-violet-600/20 blur-2xl" />
            <Card className="relative border-slate-700 bg-slate-900/50">
              <CardContent className="p-8">
                <TrendingUp className="mx-auto mb-4 h-12 w-12 text-indigo-400" />
                <h2 className="mb-4 text-3xl font-bold text-white">
                  Prêt à décrocher votre prochain emploi ?
                </h2>
                <p className="mb-8 text-lg text-slate-400">
                  Rejoignez les chercheurs d'emploi qui postulent plus vite et mieux
                  avec CoverLetter AI. 1 lettre gratuite, sans engagement.
                </p>
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    Générer ma première lettre
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <p className="mt-4 text-sm text-slate-500">
                  Aucune carte bancaire requise • Export PDF inclus
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                CoverLetter AI
              </div>
              <p className="text-sm text-slate-400">
                Générez des lettres de motivation personnalisées en 30 secondes.
                Fait pour les chercheurs d'emploi en Afrique francophone.
              </p>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-white">Produit</p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Tableau de bord</Link></li>
              </ul>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-white">Sécurité</p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  Données chiffrées
                </li>
                <li className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-indigo-400" />
                  Paiement Mobile Money sécurisé
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Suppression à tout moment
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
            <p>© 2026 CoverLetter AI. Fait avec ❤️ en Afrique.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
