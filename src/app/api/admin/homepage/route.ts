import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { sanitizeText, isValidSafeUrl, verifyRequestOrigin, getSafeErrorMessage } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDatabase();
  return NextResponse.json({ homepage: db.homepage });
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

    if (body.hero?.heroImageUrl && !isValidSafeUrl(body.hero.heroImageUrl)) {
      return NextResponse.json({ error: 'Invalid hero image URL.' }, { status: 400 });
    }
    if (body.hero?.primaryCtaLink && !isValidSafeUrl(body.hero.primaryCtaLink)) {
      return NextResponse.json({ error: 'Invalid primary CTA link.' }, { status: 400 });
    }
    if (body.hero?.secondaryCtaLink && !isValidSafeUrl(body.hero.secondaryCtaLink)) {
      return NextResponse.json({ error: 'Invalid secondary CTA link.' }, { status: 400 });
    }

    db.homepage = {
      ...db.homepage,
      ...body,
      hero: {
        ...db.homepage.hero,
        ...(body.hero || {}),
        badge_en: body.hero?.badge_en ? sanitizeText(body.hero.badge_en, 100) : db.homepage.hero.badge_en,
        badge_mr: body.hero?.badge_mr ? sanitizeText(body.hero.badge_mr, 100) : db.homepage.hero.badge_mr,
        badge_hi: body.hero?.badge_hi ? sanitizeText(body.hero.badge_hi, 100) : db.homepage.hero.badge_hi,
        title_en: body.hero?.title_en ? sanitizeText(body.hero.title_en, 200) : db.homepage.hero.title_en,
        title_mr: body.hero?.title_mr ? sanitizeText(body.hero.title_mr, 200) : db.homepage.hero.title_mr,
        title_hi: body.hero?.title_hi ? sanitizeText(body.hero.title_hi, 200) : db.homepage.hero.title_hi,
        subtitle_en: body.hero?.subtitle_en ? sanitizeText(body.hero.subtitle_en, 400) : db.homepage.hero.subtitle_en,
        subtitle_mr: body.hero?.subtitle_mr ? sanitizeText(body.hero.subtitle_mr, 400) : db.homepage.hero.subtitle_mr,
        subtitle_hi: body.hero?.subtitle_hi ? sanitizeText(body.hero.subtitle_hi, 400) : db.homepage.hero.subtitle_hi,
      },
    };

    saveDatabase(db);
    return NextResponse.json({ success: true, homepage: db.homepage });
  } catch (error: unknown) {
    console.error('Error updating homepage settings:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Failed to update homepage settings.') }, { status: 500 });
  }
}
