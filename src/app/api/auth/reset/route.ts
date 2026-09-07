import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDatabase, saveDatabase, hashPassword } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { getSafeErrorMessage } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // Rate limit: max 5 reset attempts per 15 minutes per IP
    if (!checkRateLimit(`reset_pw_${ip}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many password reset attempts. Please wait 15 minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { token, newPassword } = body;

    if (!token || !newPassword || typeof token !== 'string' || typeof newPassword !== 'string') {
      return NextResponse.json({ error: 'Reset PIN and new password are required.' }, { status: 400 });
    }

    const cleanToken = token.trim();
    if (cleanToken.length < 4 || cleanToken.length > 32) {
      return NextResponse.json({ error: 'Invalid reset PIN.' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    if (newPassword.length > 256) {
      return NextResponse.json({ error: 'Password exceeds maximum allowed length.' }, { status: 400 });
    }

    const db = getDatabase();

    // Check expiration
    if (db.admin.resetExpires && new Date(db.admin.resetExpires).getTime() < Date.now()) {
      delete db.admin.resetTokenHash;
      delete db.admin.resetToken;
      delete db.admin.resetExpires;
      saveDatabase(db);
      return NextResponse.json({ error: 'Reset PIN has expired. Please request a new one.' }, { status: 400 });
    }

    // Verify token using timingSafeEqual
    let isTokenValid = false;
    const inputHash = crypto.createHash('sha256').update(cleanToken).digest('hex');

    if (db.admin.resetTokenHash) {
      const inputBuf = Buffer.from(inputHash, 'hex');
      const storedBuf = Buffer.from(db.admin.resetTokenHash, 'hex');
      if (inputBuf.length === storedBuf.length && crypto.timingSafeEqual(inputBuf, storedBuf)) {
        isTokenValid = true;
      }
    } else if (db.admin.resetToken) {
      // Legacy plaintext fallback
      isTokenValid = cleanToken === db.admin.resetToken.trim();
    }

    if (!isTokenValid) {
      console.warn(`[SECURITY WARNING] Invalid password reset PIN attempted from IP: ${ip}`);
      return NextResponse.json({ error: 'Invalid or expired reset PIN.' }, { status: 400 });
    }

    // Hash new password using 100,000 iterations PBKDF2 SHA-512
    const { hash, salt } = hashPassword(newPassword);
    db.admin.passwordHash = hash;
    db.admin.salt = salt;

    // Single-use enforcement: remove reset tokens immediately
    delete db.admin.resetTokenHash;
    delete db.admin.resetToken;
    delete db.admin.resetExpires;

    // Increment tokenVersion to revoke all active sessions immediately
    db.admin.tokenVersion = (db.admin.tokenVersion || 1) + 1;

    saveDatabase(db);

    console.log(`[SECURITY AUDIT] Admin password was reset successfully from IP: ${ip}. All prior sessions revoked.`);

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully. All existing sessions revoked. You can now log in.',
    });
  } catch (error: unknown) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: getSafeErrorMessage(error, 'Password reset failed.') },
      { status: 500 }
    );
  }
}
