import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const NOTCHPAY_API_URL = 'https://api.notchpay.co/payments';
const NOTCHPAY_KEY = process.env.NOTCHPAY_PUBLIC_KEY;
const AUTH_API_URL = process.env.AUTH_API_URL || 'https://fable-2a6c9237.base44.app/functions/clAuth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    const status = searchParams.get('status');

    if (!reference) {
      return NextResponse.redirect(new URL('/dashboard?payment=error', request.url));
    }

    // If Notch Pay redirected with a status, verify the payment
    if (!NOTCHPAY_KEY) {
      return NextResponse.redirect(new URL('/dashboard?payment=error', request.url));
    }

    const verifyRes = await fetch(`${NOTCHPAY_API_URL}/${reference}`, {
      headers: {
        Authorization: NOTCHPAY_KEY,
      },
    });

    const verifyData = await verifyRes.json();

    if (verifyData.transaction?.status === 'complete') {
      // Payment successful — update user plan to Pro
      const session = await auth();
      if (session?.user?.email) {
        // Update user plan via Base44 backend function
        await fetch(AUTH_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_plan',
            email: session.user.email,
            plan: 'pro',
            expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          }),
        });
      }

      return NextResponse.redirect(new URL('/dashboard?payment=success', request.url));
    } else if (verifyData.transaction?.status === 'failed' || status === 'canceled') {
      return NextResponse.redirect(new URL('/dashboard?payment=failed', request.url));
    } else {
      // Still processing
      return NextResponse.redirect(new URL('/dashboard?payment=pending', request.url));
    }
  } catch (error) {
    console.error('Notch Pay verify error:', error);
    return NextResponse.redirect(new URL('/dashboard?payment=error', request.url));
  }
}
