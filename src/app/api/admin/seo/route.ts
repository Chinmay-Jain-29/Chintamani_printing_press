import { NextRequest, NextResponse } from 'next/server';
import { fetchSiteSettingAsync, saveSiteSettingAsync, initialSeo, initialSocialLinks } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { SeoSettings, SocialLinks } from '@/lib/schema';
import { sanitizeText, isValidSafeUrl, verifyRequestOrigin, getSafeErrorMessage } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const seo = await fetchSiteSettingAsync<SeoSettings>('seo_settings', initialSeo);
  const socialLinks = await fetchSiteSettingAsync<SocialLinks>('social_links', initialSocialLinks);
  return NextResponse.json({ seo, socialLinks });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!verifyRequestOrigin(req)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  try {
    const { seo, socialLinks } = await req.json();
    let currentSeo = await fetchSiteSettingAsync<SeoSettings>('seo_settings', initialSeo);
    let currentSocial = await fetchSiteSettingAsync<SocialLinks>('social_links', initialSocialLinks);

    if (seo) {
      if (seo.ogImage && !isValidSafeUrl(seo.ogImage)) {
        return NextResponse.json({ error: 'Invalid OpenGraph image URL.' }, { status: 400 });
      }

      currentSeo = {
        ...currentSeo,
        siteTitle_en: seo.siteTitle_en ? sanitizeText(seo.siteTitle_en, 150) : currentSeo.siteTitle_en,
        siteTitle_mr: seo.siteTitle_mr ? sanitizeText(seo.siteTitle_mr, 150) : currentSeo.siteTitle_mr,
        siteTitle_hi: seo.siteTitle_hi ? sanitizeText(seo.siteTitle_hi, 150) : currentSeo.siteTitle_hi,
        metaDescription_en: seo.metaDescription_en ? sanitizeText(seo.metaDescription_en, 300) : currentSeo.metaDescription_en,
        metaDescription_mr: seo.metaDescription_mr ? sanitizeText(seo.metaDescription_mr, 300) : currentSeo.metaDescription_mr,
        metaDescription_hi: seo.metaDescription_hi ? sanitizeText(seo.metaDescription_hi, 300) : currentSeo.metaDescription_hi,
        keywords_en: seo.keywords_en ? sanitizeText(seo.keywords_en, 400) : currentSeo.keywords_en,
        keywords_mr: seo.keywords_mr ? sanitizeText(seo.keywords_mr, 400) : currentSeo.keywords_mr,
        keywords_hi: seo.keywords_hi ? sanitizeText(seo.keywords_hi, 400) : currentSeo.keywords_hi,
        ogImage: seo.ogImage ? String(seo.ogImage).trim() : currentSeo.ogImage,
      };
      await saveSiteSettingAsync('seo_settings', currentSeo);
    }

    if (socialLinks) {
      for (const [key, link] of Object.entries(socialLinks)) {
        if (link && typeof link === 'string' && link.trim() && !isValidSafeUrl(link)) {
          return NextResponse.json({ error: `Invalid URL format for ${key}.` }, { status: 400 });
        }
      }
      currentSocial = {
        ...currentSocial,
        ...socialLinks,
      };
      await saveSiteSettingAsync('social_links', currentSocial);
    }

    return NextResponse.json({ success: true, seo: currentSeo, socialLinks: currentSocial });
  } catch (error: unknown) {
    console.error('Error updating SEO and social settings:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Failed to update SEO and social settings.') }, { status: 500 });
  }
}
