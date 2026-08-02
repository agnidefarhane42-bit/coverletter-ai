import { NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/users';

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
        { error: 'Le mot de passe doit contenir au moins 6 caractères.' },
        { status: 400 }
      );
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cet e-mail existe déjà.' },
        { status: 400 }
      );
    }

    const newUser = await createUser({ name, email, password });

    return NextResponse.json(
      {
        success: true,
        message: 'Compte créé avec succès.',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue lors de l’inscription.' },
      { status: 500 }
    );
  }
}
