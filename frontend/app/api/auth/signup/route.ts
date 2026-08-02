import { NextResponse } from 'next/server';

const AUTH_API_URL = process.env.AUTH_API_URL || "https://fable-2a6c9237.base44.app/functions/clAuth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Veuillez remplir tous les champs obligatoires (nom, e-mail, mot de passe).' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caracteres.' },
        { status: 400 }
      );
    }

    const res = await fetch(AUTH_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'signup',
        name,
        email,
        password,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error || `Erreur lors de linscription (${res.status})` },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Compte cree avec succes.',
      user: data.user,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue lors de linscription.' },
      { status: 500 }
    );
  }
}
