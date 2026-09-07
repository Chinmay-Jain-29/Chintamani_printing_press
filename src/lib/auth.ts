import crypto from 'crypto';
import { cookies } from 'next/headers';
import { getDatabase } from './db';
import { checkRateLimit as checkGlobalRateLimit, resetRateLimit as resetGlobalRateLimit } from './rateLimit';

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'chintamani-printing-press-secret-key-1999-secure';
export const COOKIE_NAME = 'admin_session_token';
const SESSION_DURATION_HOURS = 24;

export interface SessionPayload {
  userId: string;
  email: string;
  tokenVersion?: number;
  exp: number; // Unix timestamp in seconds
}

export function createToken(payload: SessionPayload): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    // Check token version against database to enforce instant session revocation on password changes
    const db = getDatabase();
    const currentVersion = db.admin.tokenVersion || 1;
    if (payload.tokenVersion && payload.tokenVersion < currentVersion) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function setAdminSession(userId: string, email: string): Promise<string> {
  const db = getDatabase();
  const tokenVersion = db.admin.tokenVersion || 1;
  const exp = Math.floor(Date.now() / 1000) + SESSION_DURATION_HOURS * 3600;
  const token = createToken({ userId, email, tokenVersion, exp });
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION_HOURS * 3600,
    path: '/',
  });
  return token;
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

// Re-export rate limiting utilities for backwards compatibility
export function checkRateLimit(key: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean {
  return checkGlobalRateLimit(key, maxAttempts, windowMs);
}

export function resetRateLimit(key: string): void {
  resetGlobalRateLimit(key);
}
