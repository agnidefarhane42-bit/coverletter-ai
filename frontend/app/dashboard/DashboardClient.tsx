'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Upload,
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  Wand2,
  Briefcase,
  LogOut,
  Loader2,
  Crown,
  Lock,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { readFileAsBase64 } from '@/lib/utils';

type Tone = 'formal' | 'creative' | 'direct';
type Step = 'input' | 'generating' | 'result' | 'paywall';

interface GenerateResponse {
  letter: string;
  metadata: {
    word_count: number;
    language: string;
  };
}

const PRO_PRICE = 15000;

export default function DashboardClient({ userName }: { userName: string }) {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>('input');
  const [cvText, setCvText] = useState('');
  const [cvFileName, setCvFileName] = useState('');
  const [cvType, setCvType] = useState<'text' | 'pdf'>('text');
  const [cvBase64, setCvBase64] = useState('');
  const [jobOffer, setJobOffer] = useState('');
  const [tone, setTone] = useState<Tone>('formal');
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [editableLetter, setEditableLetter] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subscription state
  const [plan, setPlan] = useState<'free' | 'pro'>('free');
  const [freeLettersUsed, setFreeLettersUsed] = useState(0);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paymentMsg, setPaymentMsg] = useState('');

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch('/api/subscription/status');
        const data = await res.json();
        setPlan(data.plan || 'free');
        setFreeLettersUsed(data.freeLettersUsed || 0);
      } catch {
        // Default to free
      } finally {
        setLoadingPlan(false);
      }
    }
    fetchSubscription();
  }, []);

  // Handle payment redirect messages
  useEffect(() => {
    const payment = searchParams.get('payment');
    if (payment === 'success') {
      setPaymentMsg('✓ Paiement réussi ! Votre plan Pro est actif.');
      setPlan('pro');
    } else if (payment === 'failed') {
      setPaymentMsg('Le paiement a échoué. Réessayez.');
    } else if (payment === 'pending') {
      setPaymentMsg('Paiement en cours de traitement...');
    } else if (payment === 'error') {
      setPaymentMsg('Erreur lors du paiement. Contactez le support.');
    }
  }, [searchParams]);

  const isFreeExhausted = plan === 'free' && freeLettersUsed >= 1;

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCvFileName(file.name);
    setError('');

    if (file.type === 'application/pdf') {
      try {
        const base64 = await readFileAsBase64(file);
        setCvBase64(base64);
        setCvType('pdf');
      } catch {
        setError('Impossible de lire ce fichier PDF.');
      }
    } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const text = await file.text();
      setCvText(text);
      setCvType('text');
    } else {
      setError('Format non supporté. Utilisez un fichier PDF ou TXT.');
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const fakeEvent = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(fakeEvent);
    }
  }

  async function handleGenerate() {
    if (!cvText && !cvBase64) {
      setError('Veuillez importer votre CV.');
      return;
    }
    if (!jobOffer.trim()) {
      setError("Veuillez coller l'offre d'emploi.");
      return;
    }

    // Check freemium
    if (isFreeExhausted) {
      setStep('paywall');
      return;
    }

    setError('');
    setStep('generating');

    try {
      const cvContent = cvType === 'pdf' ? cvBase64 : cvText;

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cv_content: cvContent,
          cv_type: cvType,
          job_offer: jobOffer,
          tone,
          language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la génération.');
      }

      const generateData = data as GenerateResponse;
      setGeneratedLetter(generateData.letter);
      setEditableLetter(generateData.letter);
      setStep('result');

      // Increment free usage if on free plan
      if (plan === 'free') {
        setFreeLettersUsed((prev) => prev + 1);
        // Fire and forget — update backend
        fetch('/api/subscription/status', { method: 'POST' }).catch(() => {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération.');
      setStep('input');
    }
  }

  async function handleUpgrade() {
    setPaying(true);
    setError('');

    try {
      const res = await fetch('/api/notchpay/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'pro_monthly' }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'initialisation du paiement');
      }

      // Redirect to Notch Pay checkout
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du paiement.');
    } finally {
      setPaying(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(editableLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDownloadPDF() {
    setGeneratingPdf(true);
    setError('');

    try {
      const res = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letter: editableLetter,
          userName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'export PDF.");
      }

      const url = data.pdfUrl || data.url;
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = 'lettre-motivation.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setPdfUrl(url);
      } else {
        throw new Error('Aucun PDF reçu de DocEngine.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'export PDF.");
    } finally {
      setGeneratingPdf(false);
    }
  }

  function handleReset() {
    setStep('input');
    setGeneratedLetter('');
    setEditableLetter('');
    setPdfUrl('');
    setError('');
  }

  const tones: { value: Tone; label: string; desc: string }[] = [
    { value: 'formal', label: 'Formel', desc: 'Classique et professionnel' },
    { value: 'creative', label: 'Créatif', desc: 'Original et accrocheur' },
    { value: 'direct', label: 'Direct', desc: 'Concis et efficace' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            CoverLetter AI
          </Link>
          <div className="flex items-center gap-4">
            {/* Plan badge */}
            {!loadingPlan && (
              <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                plan === 'pro'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-700/50'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {plan === 'pro' ? (
                  <>
                    <Crown className="h-3.5 w-3.5" />
                    Pro
                  </>
                ) : (
                  <>
                    <Zap className="h-3.5 w-3.5" />
                    Gratuit ({Math.max(0, 1 - freeLettersUsed)} restante)
                  </>
                )}
              </span>
            )}
            <span className="text-sm text-slate-400 hidden sm:inline">{userName}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = '/api/auth/signout')}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Payment message */}
        {paymentMsg && (
          <div className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            paymentMsg.startsWith('✓')
              ? 'bg-emerald-950/50 border-emerald-800/50 text-emerald-300'
              : 'bg-amber-950/50 border-amber-800/50 text-amber-300'
          }`}>
            {paymentMsg}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-rose-950/50 border border-rose-800/50 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        {/* Step: Paywall */}
        {step === 'paywall' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/20 border border-indigo-700/50">
                <Lock className="h-8 w-8 text-indigo-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Vous avez utilisé votre lettre gratuite</h1>
              <p className="text-slate-400">Passez au plan Pro pour générer des lettres en illimité</p>
            </div>

            <Card className="border-indigo-700/50 ring-1 ring-indigo-700/30 max-w-lg mx-auto">
              <CardContent className="p-8">
                <div className="mb-6 text-center">
                  <h2 className="mb-1 text-2xl font-bold text-white">Plan Pro</h2>
                  <p className="text-sm text-slate-400">Pour les chercheurs d'emploi actifs</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">15 000</span>
                    <span className="text-lg text-slate-400"> FCFA</span>
                    <span className="text-sm text-slate-500"> / mois</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    'Lettres illimitées',
                    'Export PDF professionnel',
                    '3 tons au choix (formel, créatif, direct)',
                    'Français & Anglais',
                    'Paiement Mobile Money (MTN, Moov, Orange)',
                    'Sans filigrane',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleUpgrade}
                  isLoading={paying}
                >
                  <Crown className="mr-2 h-5 w-5" />
                  Payer 15 000 FCFA via Notch Pay
                </Button>

                <p className="mt-4 text-center text-xs text-slate-500">
                  Paiement sécurisé via Notch Pay • Mobile Money ou carte bancaire
                </p>

                <button
                  onClick={() => setStep('input')}
                  className="mt-4 w-full text-center text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Retour
                </button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step: Input */}
        {step === 'input' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Générer une lettre de motivation</h1>
              <p className="text-slate-400">Importez votre CV et collez l'offre d'emploi</p>
            </div>

            {/* Free limit warning */}
            {isFreeExhausted && (
              <div className="rounded-lg bg-amber-950/50 border border-amber-800/50 px-4 py-3 text-sm text-amber-300 flex items-center justify-between">
                <span>Vous avez utilisé votre lettre gratuite. Passez Pro pour continuer.</span>
                <Button size="sm" onClick={() => setStep('paywall')}>
                  <Crown className="mr-1.5 h-4 w-4" />
                  Passer Pro
                </Button>
              </div>
            )}

            {/* CV Upload */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-400" />
                  <CardTitle>1. Votre CV</CardTitle>
                </div>
                <CardDescription>Importez un PDF ou collez votre CV en texte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 p-8 text-center transition-colors hover:border-indigo-600 hover:bg-slate-900"
                  >
                    <Upload className="mx-auto mb-2 h-8 w-8 text-slate-500" />
                    <p className="text-sm text-slate-400">
                      {cvFileName ? (
                        <span className="text-indigo-400 font-medium">{cvFileName}</span>
                      ) : (
                        'Glissez votre CV ici ou cliquez pour importer'
                      )}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">PDF ou TXT</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-slate-800" />
                    <span className="text-xs text-slate-500">OU</span>
                    <div className="h-px flex-1 bg-slate-800" />
                  </div>

                  <textarea
                    value={cvText}
                    onChange={(e) => {
                      setCvText(e.target.value);
                      setCvType('text');
                    }}
                    placeholder="Collez le texte de votre CV ici..."
                    rows={6}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Job Offer */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-violet-400" />
                  <CardTitle>2. Offre d'emploi</CardTitle>
                </div>
                <CardDescription>Collez le texte de l'offre d'emploi</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  value={jobOffer}
                  onChange={(e) => setJobOffer(e.target.value)}
                  placeholder="Collez ici le contenu de l'offre d'emploi (description du poste, exigences, nom de l'entreprise...)"
                  rows={8}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
                />
              </CardContent>
            </Card>

            {/* Tone & Language */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-emerald-400" />
                  <CardTitle>3. Style de la lettre</CardTitle>
                </div>
                <CardDescription>Choisissez le ton et la langue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Ton</label>
                    <div className="grid grid-cols-3 gap-3">
                      {tones.map((t) => (
                        <button
                          key={t.value}
                          onClick={() => setTone(t.value)}
                          className={`rounded-lg border p-3 text-center transition-colors ${
                            tone === t.value
                              ? 'border-indigo-600 bg-indigo-950/50 text-white'
                              : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
                          }`}
                        >
                          <p className="text-sm font-medium">{t.label}</p>
                          <p className="text-xs text-slate-500">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Langue</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setLanguage('fr')}
                        className={`rounded-lg border p-3 text-center transition-colors ${
                          language === 'fr'
                            ? 'border-indigo-600 bg-indigo-950/50 text-white'
                            : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        <p className="text-sm font-medium">Français</p>
                      </button>
                      <button
                        onClick={() => setLanguage('en')}
                        className={`rounded-lg border p-3 text-center transition-colors ${
                          language === 'en'
                            ? 'border-indigo-600 bg-indigo-950/50 text-white'
                            : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        <p className="text-sm font-medium">Anglais</p>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleGenerate}
              disabled={(!cvText && !cvBase64) || !jobOffer.trim()}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              {isFreeExhausted ? 'Passer Pro pour générer' : 'Générer ma lettre de motivation'}
            </Button>
          </div>
        )}

        {/* Step: Generating */}
        {step === 'generating' && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="mb-6 h-16 w-16 animate-spin text-indigo-400" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Génération de votre lettre...
            </h2>
            <p className="text-slate-400">
              L'IA analyse votre CV et l'offre d'emploi pour créer une lettre unique.
            </p>
          </div>
        )}

        {/* Step: Result */}
        {step === 'result' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Votre lettre de motivation</h1>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Nouvelle lettre
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <textarea
                  value={editableLetter}
                  onChange={(e) => setEditableLetter(e.target.value)}
                  rows={20}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm text-white leading-relaxed focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
                />
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleDownloadPDF}
                isLoading={generatingPdf}
                disabled={!editableLetter.trim()}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger PDF
              </Button>

              <Button
                variant="outline"
                onClick={handleCopy}
                disabled={!editableLetter.trim()}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-emerald-400" />
                    Copié !
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copier le texte
                  </>
                )}
              </Button>
            </div>

            {pdfUrl && (
              <p className="text-sm text-emerald-400">
                ✓ PDF généré avec succès. Vérifiez vos téléchargements.
              </p>
            )}

            {/* Upsell for free users */}
            {plan === 'free' && (
              <div className="rounded-lg bg-indigo-950/30 border border-indigo-800/50 px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-medium">Besoin de plus de lettres ?</p>
                  <p className="text-xs text-slate-400">Passez Pro pour des lettres illimitées à 15 000 FCFA/mois</p>
                </div>
                <Button size="sm" onClick={() => setStep('paywall')}>
                  <Crown className="mr-1.5 h-4 w-4" />
                  Passer Pro
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
