import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { fetchAdminUserAsync, updateAdminUserAsync, hashPassword } from '@/lib/db';
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

    const admin = await fetchAdminUserAsync();

    // Check expiration
    if (admin.resetExpires && new Date(admin.resetExpires).getTime() < Date.now()) {
      await updateAdminUserAsync({
        id: admin.id,
        resetTokenHash: undefined,
        resetExpires: undefined,
      });
      return NextResponse.json({ error: 'Reset PIN has expired. Please request a new one.' }, { status: 400 });
    }

    // Verify token using timingSafeEqual
    let isTokenValid = false;
    const inputHash = crypto.createHash('sha256').update(cleanToken).digest('hex');

    if (admin.resetTokenHash) {
      const inputBuf = Buffer.from(inputHash, 'hex');
      const storedBuf = Buffer.from(admin.resetTokenHash, 'hex');
      if (inputBuf.length === storedBuf.length && crypto.timingSafeEqual(inputBuf, storedBuf)) {
        isTokenValid = true;
      }
    } else if (admin.resetToken) {
      // Legacy plaintext fallback
      isTokenValid = cleanToken === admin.resetToken.trim();
    }

    if (!isTokenValid) {
      console.warn(`[SECURITY WARNING] Invalid password reset PIN attempted from IP: ${ip}`);
      return NextResponse.json({ error: 'Invalid or expired reset PIN.' }, { status: 400 });
    }

    // Hash new password using 100,000 iterations PBKDF2 SHA-512
    const { hash, salt } = hashPassword(newPassword);

    // Update credentials, clear reset tokens, and increment tokenVersion to revoke all active sessions
    await updateAdminUserAsync({
      id: admin.id,
      passwordHash: hash,
      salt: salt,
      resetTokenHash: undefined,
      resetExpires: undefined,
      tokenVersion: (admin.tokenVersion || 1) + 1,
    });

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
