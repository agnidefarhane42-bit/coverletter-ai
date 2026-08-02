'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Upload,
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  Wand2,
  Briefcase,
  ClipboardPaste,
  LogOut,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { readFileAsBase64 } from '@/lib/utils';

type Tone = 'formal' | 'creative' | 'direct';
type Step = 'input' | 'generating' | 'result';

interface GenerateResponse {
  letter: string;
  metadata: {
    word_count: number;
    language: string;
  };
}

export default function DashboardClient({ userName }: { userName: string }) {
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
      setError('Veuillez coller l\'offre d\'emploi.');
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la génération.');
      setStep('input');
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
        throw new Error(data.error || 'Erreur lors de l\'export PDF.');
      }

      if (data.pdfUrl || data.url) {
        const url = data.pdfUrl || data.url;
        window.open(data.url, '_blank');
        setPdfUrl(data.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'export PDF.');
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
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            CoverLetter AI
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{userName}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/api/auth/signout'}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-lg bg-rose-950/50 border border-rose-800/50 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        {/* Step: Input */}
        {step === 'input' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Générer une lettre de motivation</h1>
              <p className="text-slate-400">Importez votre CV et collez l'offre d'emploi</p>
            </div>

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
              Générer ma lettre de motivation
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
                ✓ PDF généré. Le téléchargement a commencé dans un nouvel onglet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
