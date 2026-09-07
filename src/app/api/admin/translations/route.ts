import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { sanitizeText, verifyRequestOrigin, getSafeErrorMessage } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDatabase();
  return NextResponse.json({ translations: db.translations });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!verifyRequestOrigin(req)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  try {
    const { translations } = await req.json();
    if (!translations || typeof translations !== 'object') {
      return NextResponse.json({ error: 'Invalid translations payload.' }, { status: 400 });
    }

    const db = getDatabase();

    // Sanitize translations object
    const sanitizedTranslations: Record<string, Record<string, string>> = { ...db.translations };
    for (const [key, langMap] of Object.entries(translations)) {
      if (typeof langMap === 'object' && langMap !== null) {
        sanitizedTranslations[key] = sanitizedTranslations[key] || {};
        for (const [lang, val] of Object.entries(langMap as Record<string, unknown>)) {
          if (typeof val === 'string') {
            sanitizedTranslations[key][lang] = sanitizeText(val, 500);
          }
        }
      }
    }

    db.translations = sanitizedTranslations as any;
    saveDatabase(db);

    return NextResponse.json({ success: true, translations: db.translations });
  } catch (error: unknown) {
    console.error('Error updating translations:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Failed to update translations.') }, { status: 500 });
  }
}
