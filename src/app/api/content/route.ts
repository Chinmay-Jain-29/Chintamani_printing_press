import { NextResponse } from 'next/server';
import { getDatabaseAsync, syncDatabaseFromCloud } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await syncDatabaseFromCloud();
    const db = await getDatabaseAsync();
    // Return database without sensitive admin password hashes/salts
    const safeData = {
      businessInfo: db.businessInfo,
      branding: db.branding,
      homepage: db.homepage,
      services: db.services.filter((s) => s.visible),
      portfolio: db.portfolio.filter((p) => p.visible),
      // Only approved reviews for public
      reviews: db.reviews.filter((r) => r.status === 'approved'),
      socialLinks: db.socialLinks,
      seo: db.seo,
      translations: db.translations,
    };
    return NextResponse.json({ database: safeData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch content' }, { status: 500 });
  }
}
