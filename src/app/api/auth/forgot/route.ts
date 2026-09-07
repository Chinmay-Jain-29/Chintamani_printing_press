import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { fetchAdminUserAsync, updateAdminUserAsync } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { getSafeErrorMessage } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // Rate limit: max 3 requests per 15 minutes per IP
    if (!checkRateLimit(`forgot_pw_${ip}`, 3, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many password reset requests. Please wait 15 minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail.length > 254) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const admin = await fetchAdminUserAsync();

    // Constant message regardless of whether email matches to prevent account enumeration
    const genericResponse = {
      success: true,
      message: 'If the provided email matches our admin records, a recovery PIN has been generated.',
    };

    if (cleanEmail !== admin.email.toLowerCase().trim()) {
      return NextResponse.json(genericResponse);
    }

    // Generate cryptographically secure 6-digit PIN
    const resetPin = crypto.randomInt(100000, 1000000).toString();
    // Expiration: 15 minutes
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // Store SHA-256 hash of the PIN rather than plaintext
    const resetTokenHash = crypto.createHash('sha256').update(resetPin).digest('hex');

    await updateAdminUserAsync({
      id: admin.id,
      resetTokenHash,
      resetExpires: expires,
    });

    console.log(`[SECURITY AUDIT] Password recovery PIN generated for admin account from IP ${ip}. (Expires in 15 mins)`);

    // In production, NEVER expose PIN in response. In local development, provide debugPin for local admin setup.
    const isDev = process.env.NODE_ENV !== 'production';
    return NextResponse.json({
      ...genericResponse,
      debugPin: isDev ? resetPin : undefined,
    });
  } catch (error: unknown) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: getSafeErrorMessage(error, 'Password reset request failed.') },
      { status: 500 }
    );
  }
}
