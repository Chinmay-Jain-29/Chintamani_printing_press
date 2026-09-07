import { NextRequest, NextResponse } from 'next/server';
import { fetchSiteSettingAsync, saveSiteSettingAsync, initialBusinessInfo } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { BusinessInfo } from '@/lib/schema';
import { sanitizeText, isValidPhone, isValidEmail, isValidSafeUrl, verifyRequestOrigin, getSafeErrorMessage } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const businessInfo = await fetchSiteSettingAsync<BusinessInfo>('business_info', initialBusinessInfo);
  return NextResponse.json({ businessInfo });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!verifyRequestOrigin(req)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const current = await fetchSiteSettingAsync<BusinessInfo>('business_info', initialBusinessInfo);

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

    const updated: BusinessInfo = {
      ...current,
      name: body.name ? sanitizeText(body.name, 120) : current.name,
      owner: body.owner ? sanitizeText(body.owner, 100) : current.owner,
      establishedYear: Number(body.establishedYear) || 1999,
      tagline_en: body.tagline_en ? sanitizeText(body.tagline_en, 200) : current.tagline_en,
      tagline_mr: body.tagline_mr ? sanitizeText(body.tagline_mr, 200) : current.tagline_mr,
      tagline_hi: body.tagline_hi ? sanitizeText(body.tagline_hi, 200) : current.tagline_hi,
      address: body.address ? sanitizeText(body.address, 200) : current.address,
      taluka: body.taluka ? sanitizeText(body.taluka, 100) : current.taluka,
      district: body.district ? sanitizeText(body.district, 100) : current.district,
      state: body.state ? sanitizeText(body.state, 100) : current.state,
      pincode: body.pincode ? sanitizeText(body.pincode, 10) : current.pincode,
      phone1: body.phone1 ? sanitizeText(body.phone1, 20) : current.phone1,
      phone2: body.phone2 ? sanitizeText(body.phone2, 20) : current.phone2,
      whatsapp: body.whatsapp ? sanitizeText(body.whatsapp, 20) : current.whatsapp,
      email: body.email ? sanitizeText(body.email, 120) : current.email,
      businessHours_en: body.businessHours_en ? sanitizeText(body.businessHours_en, 100) : current.businessHours_en,
      businessHours_mr: body.businessHours_mr ? sanitizeText(body.businessHours_mr, 100) : current.businessHours_mr,
      businessHours_hi: body.businessHours_hi ? sanitizeText(body.businessHours_hi, 100) : current.businessHours_hi,
      googleMapsUrl: body.googleMapsUrl ? String(body.googleMapsUrl).trim() : '',
      ownerTitle_en: body.ownerTitle_en ? sanitizeText(body.ownerTitle_en, 100) : current.ownerTitle_en,
      ownerTitle_mr: body.ownerTitle_mr ? sanitizeText(body.ownerTitle_mr, 100) : current.ownerTitle_mr,
      ownerTitle_hi: body.ownerTitle_hi ? sanitizeText(body.ownerTitle_hi, 100) : current.ownerTitle_hi,
      ownerBio_en: body.ownerBio_en ? sanitizeText(body.ownerBio_en, 2000) : current.ownerBio_en,
      ownerBio_mr: body.ownerBio_mr ? sanitizeText(body.ownerBio_mr, 2000) : current.ownerBio_mr,
      ownerBio_hi: body.ownerBio_hi ? sanitizeText(body.ownerBio_hi, 2000) : current.ownerBio_hi,
      ownerPhotoUrl: body.ownerPhotoUrl ? String(body.ownerPhotoUrl).trim() : current.ownerPhotoUrl,
    };

    await saveSiteSettingAsync('business_info', updated);
    return NextResponse.json({ success: true, businessInfo: updated });
  } catch (error: unknown) {
    console.error('Error updating business info:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Failed to update business info.') }, { status: 500 });
  }
}
