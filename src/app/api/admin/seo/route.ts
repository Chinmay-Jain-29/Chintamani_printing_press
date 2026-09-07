import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { sanitizeText, isValidSafeUrl, verifyRequestOrigin, getSafeErrorMessage } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDatabase();
  return NextResponse.json({ seo: db.seo, socialLinks: db.socialLinks });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!verifyRequestOrigin(req)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  try {
    const { seo, socialLinks } = await req.json();
    const db = getDatabase();

    if (seo) {
      if (seo.ogImage && !isValidSafeUrl(seo.ogImage)) {
        return NextResponse.json({ error: 'Invalid OpenGraph image URL.' }, { status: 400 });
      }

      db.seo = {
        ...db.seo,
        siteTitle_en: seo.siteTitle_en ? sanitizeText(seo.siteTitle_en, 150) : db.seo.siteTitle_en,
        siteTitle_mr: seo.siteTitle_mr ? sanitizeText(seo.siteTitle_mr, 150) : db.seo.siteTitle_mr,
        siteTitle_hi: seo.siteTitle_hi ? sanitizeText(seo.siteTitle_hi, 150) : db.seo.siteTitle_hi,
        metaDescription_en: seo.metaDescription_en ? sanitizeText(seo.metaDescription_en, 300) : db.seo.metaDescription_en,
        metaDescription_mr: seo.metaDescription_mr ? sanitizeText(seo.metaDescription_mr, 300) : db.seo.metaDescription_mr,
        metaDescription_hi: seo.metaDescription_hi ? sanitizeText(seo.metaDescription_hi, 300) : db.seo.metaDescription_hi,
        keywords_en: seo.keywords_en ? sanitizeText(seo.keywords_en, 400) : db.seo.keywords_en,
        keywords_mr: seo.keywords_mr ? sanitizeText(seo.keywords_mr, 400) : db.seo.keywords_mr,
        keywords_hi: seo.keywords_hi ? sanitizeText(seo.keywords_hi, 400) : db.seo.keywords_hi,
        ogImage: seo.ogImage ? String(seo.ogImage).trim() : db.seo.ogImage,
      };
    }

    if (socialLinks) {
      for (const [key, link] of Object.entries(socialLinks)) {
        if (link && typeof link === 'string' && link.trim() && !isValidSafeUrl(link)) {
          return NextResponse.json({ error: `Invalid URL format for ${key}.` }, { status: 400 });
        }
      }
      db.socialLinks = {
        ...db.socialLinks,
        ...socialLinks,
      };
    }

    saveDatabase(db);
    return NextResponse.json({ success: true, seo: db.seo, socialLinks: db.socialLinks });
  } catch (error: unknown) {
    console.error('Error updating SEO and social settings:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Failed to update SEO and social settings.') }, { status: 500 });
  }
}
