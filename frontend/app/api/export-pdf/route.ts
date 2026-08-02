import { NextResponse } from 'next/server';
import { generateCoverLetterPDF } from '@/lib/docengine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { letter, userName } = body;

    if (!letter || typeof letter !== 'string' || !letter.trim()) {
      return NextResponse.json(
        { error: 'Le contenu de la lettre est requis pour générer le PDF.' },
        { status: 400 }
      );
    }

    const pdfUrl = await generateCoverLetterPDF(letter, userName || 'Candidat');

    return NextResponse.json({ pdfUrl });
  } catch (error: any) {
    console.error('PDF Export Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'Échec de la génération du document PDF.' },
      { status: 500 }
    );
  }
}
