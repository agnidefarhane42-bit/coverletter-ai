import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cv_content, cv_type, job_offer, tone, language } = body;

    if (!cv_content || !job_offer) {
      return NextResponse.json(
        { error: 'Le contenu du CV et l’offre d’emploi sont requis.' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const targetEndpoint = `${backendUrl.replace(/\/$/, '')}/api/generate`;

    const backendResponse = await fetch(targetEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cv_content,
        cv_type: cv_type || 'text',
        job_offer,
        tone: tone || 'formal',
        language: language || 'fr',
      }),
    });

    const data = await backendResponse.json().catch(() => null);

    if (!backendResponse.ok) {
      const errorMessage =
        data?.detail || data?.error || `Erreur du serveur backend (${backendResponse.status})`;
      return NextResponse.json(
        { error: errorMessage },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Backend proxy error in /api/generate:', error);
    return NextResponse.json(
      {
        error:
          error.message ||
          'Impossible de contacter le service de génération. Veuillez vérifier que le serveur backend est en cours d’exécution.',
      },
      { status: 502 }
    );
  }
}
