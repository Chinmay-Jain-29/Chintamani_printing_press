import { NextRequest, NextResponse } from 'next/server';
import { fetchServicesAsync, upsertServiceAsync, deleteServiceAsync } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { Service } from '@/lib/schema';
import { sanitizeText, isValidSafeUrl, verifyRequestOrigin, getSafeErrorMessage } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const services = await fetchServicesAsync();
  return NextResponse.json({ services });
}

// POST: Add or update service
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!verifyRequestOrigin(req)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  try {
    const service: Service = await req.json();
    const existingServices = await fetchServicesAsync();

    if (!service.name_en || typeof service.name_en !== 'string' || !service.name_en.trim()) {
      return NextResponse.json({ error: 'Service English name is required.' }, { status: 400 });
    }

    if (service.imageUrl && !isValidSafeUrl(service.imageUrl)) {
      return NextResponse.json({ error: 'Invalid image URL.' }, { status: 400 });
    }

    const validCategories: string[] = ['printing', 'designing', 'other', 'coming-soon'];
    const serviceCategory = validCategories.includes(service.category) ? service.category : 'printing';

    // Sanitize string inputs
    const sanitizedService: Service = {
      ...service,
      name_en: sanitizeText(service.name_en, 100),
      name_mr: service.name_mr ? sanitizeText(service.name_mr, 100) : '',
      name_hi: service.name_hi ? sanitizeText(service.name_hi, 100) : '',
      desc_en: service.desc_en ? sanitizeText(service.desc_en, 2000) : '',
      desc_mr: service.desc_mr ? sanitizeText(service.desc_mr, 2000) : '',
      desc_hi: service.desc_hi ? sanitizeText(service.desc_hi, 2000) : '',
      category: serviceCategory as any,
      icon: service.icon ? sanitizeText(service.icon, 50) : '🖨️',
      imageUrl: service.imageUrl ? String(service.imageUrl).trim() : undefined,
      visible: service.visible !== undefined ? Boolean(service.visible) : true,
      comingSoon: Boolean(service.comingSoon),
      featured: Boolean(service.featured),
    };

    if (!sanitizedService.id) {
      sanitizedService.id = `srv-${Date.now()}`;
      sanitizedService.slug =
        (sanitizedService.slug || sanitizedService.name_en)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .slice(0, 80);
      sanitizedService.sortOrder = existingServices.length + 1;
    }

    await upsertServiceAsync(sanitizedService);
    const updatedServices = await fetchServicesAsync();
    return NextResponse.json({ success: true, services: updatedServices });
  } catch (error: unknown) {
    console.error('Error saving service:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Failed to save service.') }, { status: 500 });
  }
}

// DELETE: Remove service
export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!verifyRequestOrigin(req)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Service ID is required.' }, { status: 400 });
    }

    await deleteServiceAsync(id);
    const updatedServices = await fetchServicesAsync();
    return NextResponse.json({ success: true, services: updatedServices });
  } catch (error: unknown) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Failed to delete service.') }, { status: 500 });
  }
}
