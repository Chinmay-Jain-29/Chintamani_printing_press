import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { sanitizeText, isValidPhone, isValidEmail, isValidSafeUrl, verifyRequestOrigin, getSafeErrorMessage } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDatabase();
  return NextResponse.json({ businessInfo: db.businessInfo });
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

    if (body.email && !isValidEmail(body.email)) {
      return NextResponse.json({ error: 'Invalid business email address.' }, { status: 400 });
    }

    if (body.phone1 && !isValidPhone(body.phone1)) {
      return NextResponse.json({ error: 'Invalid primary phone number.' }, { status: 400 });
    }

    if (body.googleMapsUrl && !isValidSafeUrl(body.googleMapsUrl)) {
      return NextResponse.json({ error: 'Invalid Google Maps URL.' }, { status: 400 });
    }

    if (body.ownerPhotoUrl && !isValidSafeUrl(body.ownerPhotoUrl)) {
      return NextResponse.json({ error: 'Invalid owner photo URL.' }, { status: 400 });
    }

    db.businessInfo = {
      ...db.businessInfo,
      name: body.name ? sanitizeText(body.name, 120) : db.businessInfo.name,
      owner: body.owner ? sanitizeText(body.owner, 100) : db.businessInfo.owner,
      establishedYear: Number(body.establishedYear) || 1999,
      tagline_en: body.tagline_en ? sanitizeText(body.tagline_en, 200) : db.businessInfo.tagline_en,
      tagline_mr: body.tagline_mr ? sanitizeText(body.tagline_mr, 200) : db.businessInfo.tagline_mr,
      tagline_hi: body.tagline_hi ? sanitizeText(body.tagline_hi, 200) : db.businessInfo.tagline_hi,
      address: body.address ? sanitizeText(body.address, 200) : db.businessInfo.address,
      taluka: body.taluka ? sanitizeText(body.taluka, 100) : db.businessInfo.taluka,
      district: body.district ? sanitizeText(body.district, 100) : db.businessInfo.district,
      state: body.state ? sanitizeText(body.state, 100) : db.businessInfo.state,
      pincode: body.pincode ? sanitizeText(body.pincode, 10) : db.businessInfo.pincode,
      phone1: body.phone1 ? sanitizeText(body.phone1, 20) : db.businessInfo.phone1,
      phone2: body.phone2 ? sanitizeText(body.phone2, 20) : db.businessInfo.phone2,
      whatsapp: body.whatsapp ? sanitizeText(body.whatsapp, 20) : db.businessInfo.whatsapp,
      email: body.email ? sanitizeText(body.email, 120) : db.businessInfo.email,
      businessHours_en: body.businessHours_en ? sanitizeText(body.businessHours_en, 100) : db.businessInfo.businessHours_en,
      businessHours_mr: body.businessHours_mr ? sanitizeText(body.businessHours_mr, 100) : db.businessInfo.businessHours_mr,
      businessHours_hi: body.businessHours_hi ? sanitizeText(body.businessHours_hi, 100) : db.businessInfo.businessHours_hi,
      googleMapsUrl: body.googleMapsUrl ? String(body.googleMapsUrl).trim() : '',
      ownerTitle_en: body.ownerTitle_en ? sanitizeText(body.ownerTitle_en, 100) : db.businessInfo.ownerTitle_en,
      ownerTitle_mr: body.ownerTitle_mr ? sanitizeText(body.ownerTitle_mr, 100) : db.businessInfo.ownerTitle_mr,
      ownerTitle_hi: body.ownerTitle_hi ? sanitizeText(body.ownerTitle_hi, 100) : db.businessInfo.ownerTitle_hi,
      ownerBio_en: body.ownerBio_en ? sanitizeText(body.ownerBio_en, 2000) : db.businessInfo.ownerBio_en,
      ownerBio_mr: body.ownerBio_mr ? sanitizeText(body.ownerBio_mr, 2000) : db.businessInfo.ownerBio_mr,
      ownerBio_hi: body.ownerBio_hi ? sanitizeText(body.ownerBio_hi, 2000) : db.businessInfo.ownerBio_hi,
      ownerPhotoUrl: body.ownerPhotoUrl ? String(body.ownerPhotoUrl).trim() : db.businessInfo.ownerPhotoUrl,
    };

    saveDatabase(db);
    return NextResponse.json({ success: true, businessInfo: db.businessInfo });
  } catch (error: unknown) {
    console.error('Error updating business info:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Failed to update business info.') }, { status: 500 });
  }
}
