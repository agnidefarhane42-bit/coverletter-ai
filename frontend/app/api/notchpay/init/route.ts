import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const NOTCHPAY_API_URL = 'https://api.notchpay.co/payments';
const NOTCHPAY_KEY = process.env.NOTCHPAY_PUBLIC_KEY;

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    if (!NOTCHPAY_KEY) {
      return NextResponse.json({ error: 'Notch Pay non configuré' }, { status: 500 });
    }

    const body = await request.json();
    const { plan } = body; // 'pro_monthly'

    const plans: Record<string, { amount: number; description: string }> = {
      pro_monthly: {
        amount: 15000,
        description: 'CoverLetter AI Pro — Abonnement mensuel',
      },
    };

    const selectedPlan = plans[plan];
    if (!selectedPlan) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 });
    }

    // Generate unique reference
    const reference = `cla_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const callbackUrl = `${request.headers.get('origin') || 'https://frontend-beta-woad-49.vercel.app'}/api/notchpay/verify`;

    const res = await fetch(NOTCHPAY_API_URL, {
      method: 'POST',
      headers: {
        Authorization: NOTCHPAY_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: selectedPlan.amount,
        currency: 'XAF',
        customer: {
          name: session.user.name || 'Client',
          email: session.user.email,
        },
        description: selectedPlan.description,
        reference,
        callback: callbackUrl,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Notch Pay init error:', data);
      return NextResponse.json(
        { error: data.message || 'Erreur lors de l\'initialisation du paiement' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      authorizationUrl: data.authorization_url,
      reference: data.transaction?.reference || reference,
    });
  } catch (error: any) {
    console.error('Notch Pay init error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
