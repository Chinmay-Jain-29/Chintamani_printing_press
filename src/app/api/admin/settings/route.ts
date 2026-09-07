import { NextRequest, NextResponse } from 'next/server';
import { fetchAdminUserAsync, updateAdminUserAsync, hashPassword, verifyPassword } from '@/lib/db';
import { getAdminSession, setAdminSession } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { isValidEmail, verifyRequestOrigin, getSafeErrorMessage } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!verifyRequestOrigin(req)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  const ip = getClientIp(req);
  if (!checkRateLimit(`admin_settings_${session.userId}_${ip}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many settings change attempts. Please wait 15 minutes.' }, { status: 429 });
  }

  try {
    const { currentPassword, newEmail, newPassword } = await req.json();

    if (!currentPassword || typeof currentPassword !== 'string') {
      return NextResponse.json({ error: 'Current password is required to confirm changes.' }, { status: 400 });
    }

    const admin = await fetchAdminUserAsync();
    const isCurrentValid = verifyPassword(currentPassword, admin.passwordHash, admin.salt);

    if (!isCurrentValid) {
      console.warn(`[SECURITY WARNING] Failed admin password verification in settings from IP: ${ip}`);
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
    }

    const updates: any = {};

    if (newEmail && typeof newEmail === 'string' && newEmail.trim()) {
      const cleanEmail = newEmail.trim().toLowerCase();
      if (!isValidEmail(cleanEmail)) {
        return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
      }
      updates.email = cleanEmail;
    }

    if (newPassword && typeof newPassword === 'string' && newPassword.trim()) {
      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters long.' }, { status: 400 });
      }
      if (newPassword.length > 256) {
        return NextResponse.json({ error: 'New password exceeds maximum length.' }, { status: 400 });
      }

      // Hash with 100,000 PBKDF2 SHA-512 iterations
      const { hash, salt } = hashPassword(newPassword);
      updates.passwordHash = hash;
      updates.salt = salt;

      // Invalidate all previously issued tokens
      updates.tokenVersion = (admin.tokenVersion || 1) + 1;
    }

    await updateAdminUserAsync({ id: admin.id, ...updates });
    const finalEmail = updates.email || admin.email;

    // Issue refreshed session cookie
    await setAdminSession(admin.id, finalEmail);

    console.log(`[SECURITY AUDIT] Admin credentials updated successfully from IP: ${ip}`);

    return NextResponse.json({ success: true, email: finalEmail, message: 'Settings updated successfully.' });
  } catch (error: unknown) {
    console.error('Error updating admin settings:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Failed to update credentials.') }, { status: 500 });
  }
}
