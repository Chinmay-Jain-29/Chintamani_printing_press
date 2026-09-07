import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, verifyPassword } from '@/lib/db';
import { setAdminSession } from '@/lib/auth';
import { checkRateLimit, resetRateLimit, getClientIp } from '@/lib/rateLimit';
import { getSafeErrorMessage } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // Rate limit by IP: max 5 attempts per 15 minutes
    if (!checkRateLimit(`login_ip_${ip}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many failed login attempts. Please wait 15 minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail.length > 254 || password.length > 256) {
      return NextResponse.json({ error: 'Invalid input length.' }, { status: 400 });
    }

    // Rate limit by targeted email as well: max 5 attempts per 15 minutes
    if (!checkRateLimit(`login_email_${cleanEmail}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many failed login attempts. Please wait 15 minutes before trying again.' },
        { status: 429 }
      );
    }

    const db = getDatabase();
    const admin = db.admin;

    const emailMatches = cleanEmail === admin.email.toLowerCase().trim();
    // Timing-safe password verification: if email doesn't match, verify against dummy to equalize timing
    const isValid = emailMatches
      ? verifyPassword(password, admin.passwordHash, admin.salt)
      : verifyPassword(password, admin.passwordHash, admin.salt);

    if (!emailMatches || !isValid) {
      console.warn(`[SECURITY WARNING] Failed admin login attempt from IP: ${ip} for email: ${cleanEmail}`);
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Successful login: reset rate limits and establish secure session
    resetRateLimit(`login_ip_${ip}`);
    resetRateLimit(`login_email_${cleanEmail}`);
    await setAdminSession(admin.id, admin.email);

    console.log(`[SECURITY AUDIT] Admin successfully logged in from IP: ${ip}`);

    return NextResponse.json({
      success: true,
      user: { id: admin.id, email: admin.email },
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Login failed.') }, { status: 500 });
  }
}
