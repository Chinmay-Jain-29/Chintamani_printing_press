import { NextRequest, NextResponse } from 'next/server';
import { fetchPortfolioAsync, upsertPortfolioAsync, deletePortfolioAsync } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { PortfolioItem } from '@/lib/schema';
import { sanitizeText, isValidSafeUrl, verifyRequestOrigin, getSafeErrorMessage } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const portfolio = await fetchPortfolioAsync();
  return NextResponse.json({ portfolio });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!verifyRequestOrigin(req)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  try {
    const item: PortfolioItem = await req.json();
    const existing = await fetchPortfolioAsync();

    if (!item.title_en || typeof item.title_en !== 'string' || !item.title_en.trim()) {
      return NextResponse.json({ error: 'Work title is required.' }, { status: 400 });
    }

    if (item.imageUrl && !isValidSafeUrl(item.imageUrl)) {
      return NextResponse.json({ error: 'Invalid image URL.' }, { status: 400 });
    }

    const validCategories = [
      'visiting-cards',
      'wedding',
      'invitations',
      'business-printing',
      'promotional',
      'packaging',
      'other',
    ];
    const itemCategory = validCategories.includes(item.category) ? item.category : 'other';

    const sanitizedItem: PortfolioItem = {
      ...item,
      title_en: sanitizeText(item.title_en, 100),
      title_mr: item.title_mr ? sanitizeText(item.title_mr, 100) : '',
      title_hi: item.title_hi ? sanitizeText(item.title_hi, 100) : '',
      category: itemCategory as any,
      desc_en: item.desc_en ? sanitizeText(item.desc_en, 500) : '',
      desc_mr: item.desc_mr ? sanitizeText(item.desc_mr, 500) : '',
      desc_hi: item.desc_hi ? sanitizeText(item.desc_hi, 500) : '',
      topWork: Boolean(item.topWork),
      featured: Boolean(item.featured),
      visible: item.visible !== undefined ? Boolean(item.visible) : true,
    };

    if (!sanitizedItem.id) {
      sanitizedItem.id = `port-${Date.now()}`;
      sanitizedItem.sortOrder = existing.length + 1;
    }

    await upsertPortfolioAsync(sanitizedItem);
    const updated = await fetchPortfolioAsync();
    return NextResponse.json({ success: true, portfolio: updated });
  } catch (error: unknown) {
    console.error('Error saving portfolio item:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Failed to save portfolio item.') }, { status: 500 });
  }
}

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
      return NextResponse.json({ error: 'Portfolio item ID is required.' }, { status: 400 });
    }

    await deletePortfolioAsync(id);
    const updated = await fetchPortfolioAsync();
    return NextResponse.json({ success: true, portfolio: updated });
  } catch (error: unknown) {
    console.error('Error deleting portfolio item:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Failed to delete portfolio item.') }, { status: 500 });
  }
}
