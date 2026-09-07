import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { QuoteRequest } from '@/lib/schema';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { sanitizeText, isValidPhone, isValidEmail, verifyRequestOrigin, getSafeErrorMessage } from '@/lib/security';

export const dynamic = 'force-dynamic';

// GET: List quotes (Admin protected)
export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDatabase();
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase().trim();

    let quotes = [...db.quotes];

    if (statusFilter && statusFilter !== 'all') {
      quotes = quotes.filter((q) => q.status === statusFilter);
    }

    if (search && search.length < 100) {
      quotes = quotes.filter(
        (q) =>
          q.customerName.toLowerCase().includes(search) ||
          q.phone.includes(search) ||
          q.service.toLowerCase().includes(search) ||
          q.id.toLowerCase().includes(search)
      );
    }

    // Sort latest first
    quotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ quotes });
  } catch (error: unknown) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Failed to retrieve quotes.') }, { status: 500 });
  }
}

// POST: Public quote submission
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // Rate limit: max 5 quotes per 10 minutes per IP
    if (!checkRateLimit(`quote_submit_${ip}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'You have submitted multiple quote requests recently. Please wait a few minutes before submitting again.' },
        { status: 429 }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Please provide valid form details.' }, { status: 400 });
    }

    // Spam honeypot trap: if bot filled hidden fields, silently discard
    if (body.website_hp || body.hp_fax_num) {
      console.warn(`[SECURITY] Bot honeypot triggered from IP: ${ip}`);
      return NextResponse.json({ success: true, quote: { id: 'CP-2026-BOT' } });
    }

    const { customerName, phone, whatsapp, email, service, quantity, sizeSpecification, requirements, preferredContact } = body;

    if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
      return NextResponse.json({ error: 'Customer name is required.' }, { status: 400 });
    }

    if (!phone || typeof phone !== 'string' || !isValidPhone(phone)) {
      return NextResponse.json({ error: 'A valid phone number is required.' }, { status: 400 });
    }

    if (email && (typeof email !== 'string' || !isValidEmail(email))) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (whatsapp && (typeof whatsapp !== 'string' || !isValidPhone(whatsapp))) {
      return NextResponse.json({ error: 'Please enter a valid WhatsApp number.' }, { status: 400 });
    }

    const db = getDatabase();

    // Auto-generate reference ID: CP-2026-XXXX
    const nextNumber = (db.quotes.length + 1).toString().padStart(3, '0');
    const quoteId = `CP-2026-${Date.now().toString().slice(-4)}${nextNumber}`;

    const validContactMethods: ('Phone' | 'WhatsApp' | 'Email')[] = ['WhatsApp', 'Phone', 'Email'];
    const contactMethod: 'Phone' | 'WhatsApp' | 'Email' = validContactMethods.includes(preferredContact)
      ? preferredContact
      : 'WhatsApp';

    const newQuote: QuoteRequest = {
      id: quoteId,
      customerName: sanitizeText(customerName, 100),
      phone: sanitizeText(phone, 25),
      whatsapp: whatsapp ? sanitizeText(whatsapp, 25) : undefined,
      email: email ? sanitizeText(email, 120) : undefined,
      service: sanitizeText(service || 'General Printing Inquiry', 100),
      quantity: quantity ? sanitizeText(quantity, 50) : undefined,
      sizeSpecification: sizeSpecification ? sanitizeText(sizeSpecification, 100) : undefined,
      requirements: requirements ? sanitizeText(requirements, 2000) : '',
      preferredContact: contactMethod,
      status: 'New',
      internalNotes: '',
      createdAt: new Date().toISOString(),
    };

    db.quotes.unshift(newQuote);

    // Save database safely: disk persistence issues should never abort a registered quote
    try {
      saveDatabase(db);
    } catch (saveErr) {
      console.warn('[DB] Warning: Could not persist quote to disk:', saveErr);
    }

    console.log(`[AUDIT] New quote request received: ${quoteId} from IP: ${ip}`);

    return NextResponse.json({ success: true, quote: newQuote });
  } catch (error: unknown) {
    console.error('Error submitting quote:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Failed to submit quote request. Please contact us directly via WhatsApp or Call.') }, { status: 500 });
  }
}

// PATCH: Update quote status / notes (Admin protected)
export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!verifyRequestOrigin(req)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, status, internalNotes } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Valid quote ID is required.' }, { status: 400 });
    }

    const db = getDatabase();
    const quoteIndex = db.quotes.findIndex((q) => q.id === id);

    if (quoteIndex === -1) {
      return NextResponse.json({ error: 'Quote not found.' }, { status: 404 });
    }

    const allowedStatuses = ['New', 'Contacted', 'Quoted', 'In Progress', 'Completed', 'Cancelled'];
    if (status && allowedStatuses.includes(status)) {
      db.quotes[quoteIndex].status = status as any;
    }
    if (internalNotes !== undefined && typeof internalNotes === 'string') {
      db.quotes[quoteIndex].internalNotes = sanitizeText(internalNotes, 3000);
    }
    db.quotes[quoteIndex].updatedAt = new Date().toISOString();

    saveDatabase(db);
    return NextResponse.json({ success: true, quote: db.quotes[quoteIndex] });
  } catch (error: unknown) {
    console.error('Error updating quote:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Failed to update quote.') }, { status: 500 });
  }
}

// DELETE: Remove quote (Admin protected)
export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!verifyRequestOrigin(req)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Quote ID is required.' }, { status: 400 });
    }

    const db = getDatabase();
    db.quotes = db.quotes.filter((q) => q.id !== id);
    saveDatabase(db);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting quote:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Failed to delete quote.') }, { status: 500 });
  }
}
