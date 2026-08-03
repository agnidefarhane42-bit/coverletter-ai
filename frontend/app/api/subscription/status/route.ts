import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const AUTH_API_URL = process.env.AUTH_API_URL || 'https://fable-2a6c9237.base44.app/functions/clAuth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const res = await fetch(AUTH_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get_user',
        email: session.user.email,
      }),
    });

    const data = await res.json();

    if (data.success && data.user) {
      return NextResponse.json({
        plan: data.user.plan || 'free',
        freeLettersUsed: data.user.freeLettersUsed || 0,
        subscriptionExpiry: data.user.subscriptionExpiry || null,
      });
    }

    return NextResponse.json({ plan: 'free', freeLettersUsed: 0 });
  } catch (error) {
    console.error('Subscription status error:', error);
    return NextResponse.json({ plan: 'free', freeLettersUsed: 0 });
  }
}

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Increment free letter usage
    const res = await fetch(AUTH_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'increment_free_usage',
        email: session.user.email,
      }),
    });

    const data = await res.json();

    if (data.success) {
      return NextResponse.json({ success: true, freeLettersUsed: data.freeLettersUsed });
    }

    return NextResponse.json({ success: false, error: data.error }, { status: 400 });
  } catch (error) {
    console.error('Increment usage error:', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
