import { NextRequest, NextResponse } from 'next/server';
import { fetchReviewsAsync, insertReviewAsync, updateReviewAsync, deleteReviewAsync, syncDatabaseFromCloud } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { Review, ReviewStatus } from '@/lib/schema';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { sanitizeText, verifyRequestOrigin, getSafeErrorMessage } from '@/lib/security';

export const dynamic = 'force-dynamic';

// GET: Fetch reviews
export async function GET(req: NextRequest) {
  try {
    await syncDatabaseFromCloud();
    const session = await getAdminSession();

    // If admin session verified, allow filtering and viewing all reviews with status
    if (session) {
      const { searchParams } = new URL(req.url);
      const status = searchParams.get('status');
      let reviews = await fetchReviewsAsync(true);
      if (status && status !== 'all') {
        reviews = reviews.filter((r) => r.status === status);
      }
      reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return NextResponse.json({ reviews });
    }

    // Public visitor: return ONLY approved reviews
    const approved = await fetchReviewsAsync(false);
    approved.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ reviews: approved });
  } catch (error: unknown) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Failed to fetch reviews.') }, { status: 500 });
  }
}

// POST: Public review submission
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // Rate limit: max 5 reviews per 10 minutes per IP
    if (!checkRateLimit(`review_submit_${ip}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'You have submitted multiple reviews recently. Please wait a few minutes before submitting again.' },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Spam honeypot trap
    if (body.website_hp || body.hp_fax_num) {
      console.warn(`[SECURITY] Bot honeypot triggered on review submission from IP: ${ip}`);
      return NextResponse.json({
        success: true,
        message: 'Review submitted successfully and is awaiting moderation.',
      });
    }

    const { customerName, location, rating, reviewText, language } = body;

    if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }

    if (!reviewText || typeof reviewText !== 'string' || !reviewText.trim()) {
      return NextResponse.json({ error: 'Review message is required.' }, { status: 400 });
    }

    const numRating = Math.round(Number(rating) || 5);
    const clampedRating = Math.max(1, Math.min(5, numRating));

    const validLangs = ['en', 'mr', 'hi'];
    const chosenLang = validLangs.includes(language) ? language : 'en';

    const reviewId = `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newReview: Review = {
      id: reviewId,
      customerName: sanitizeText(customerName, 100),
      location: location ? sanitizeText(location, 100) : undefined,
      rating: clampedRating,
      reviewText: sanitizeText(reviewText, 1500),
      language: chosenLang as any,
      status: 'pending', // Strictly enforce pending status regardless of input payload
      featured: false, // Strictly enforce false regardless of input payload
      createdAt: new Date().toISOString(),
    };

    await insertReviewAsync(newReview);

    console.log(`[AUDIT] New customer review submitted: ${reviewId} (pending moderation) from IP: ${ip}`);

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully and is awaiting moderation.',
      review: newReview,
    });
  } catch (error: unknown) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Failed to submit review.') }, { status: 500 });
  }
}

// PATCH: Moderate review (Admin protected)
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
    const { id, status, featured, customerName, reviewText, location, rating } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Review ID is required.' }, { status: 400 });
    }

    const updates: Partial<Review> = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      updates.status = status as ReviewStatus;
    }
    if (featured !== undefined) {
      updates.featured = Boolean(featured);
    }
    if (customerName && typeof customerName === 'string') {
      updates.customerName = sanitizeText(customerName, 100);
    }
    if (reviewText && typeof reviewText === 'string') {
      updates.reviewText = sanitizeText(reviewText, 1500);
    }
    if (location !== undefined && typeof location === 'string') {
      updates.location = sanitizeText(location, 100);
    }
    if (rating !== undefined) {
      updates.rating = Math.max(1, Math.min(5, Math.round(Number(rating))));
    }

    const success = await updateReviewAsync(id, updates);
    if (!success) {
      return NextResponse.json({ error: 'Review not found or could not be updated.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Failed to update review.') }, { status: 500 });
  }
}

// DELETE: Delete review (Admin protected)
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
      return NextResponse.json({ error: 'Review ID is required.' }, { status: 400 });
    }

    await deleteReviewAsync(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'Failed to delete review.') }, { status: 500 });
  }
}
