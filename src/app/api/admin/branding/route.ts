import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { sanitizeText, isValidSafeUrl, verifyRequestOrigin, getSafeErrorMessage } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDatabase();
  return NextResponse.json({ branding: db.branding });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!verifyRequestOrigin(req)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const db = getDatabase();

    if (body.logoUrl && !isValidSafeUrl(body.logoUrl)) {
      return NextResponse.json({ error: 'Invalid logo URL.' }, { status: 400 });
    }
    if (body.darkLogoUrl && !isValidSafeUrl(body.darkLogoUrl)) {
      return NextResponse.json({ error: 'Invalid dark logo URL.' }, { status: 400 });
    }

    db.branding = {
      ...db.branding,
      logoUrl: body.logoUrl ? String(body.logoUrl) : null,
      darkLogoUrl: body.darkLogoUrl ? String(body.darkLogoUrl) : null,
      useDefaultVectorLogo: Boolean(body.useDefaultVectorLogo),
      altText: body.altText ? sanitizeText(body.altText, 150) : 'New Chintamani Printing Press Logo',
    };

    saveDatabase(db);
    return NextResponse.json({ success: true, branding: db.branding });
  } catch (error: unknown) {
    console.error('Error updating branding:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Failed to update branding.') }, { status: 500 });
  }
}
