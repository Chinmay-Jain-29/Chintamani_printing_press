'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Review, AppDatabase } from '@/lib/schema';
import { ReviewModal } from '@/components/reviews/ReviewModal';

export default function ReviewsPage() {
  const { language, t } = useLanguage();
  const [data, setData] = useState<AppDatabase | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchContent = () => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((res) => res.database && setData(res.database));
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const reviews = data?.reviews || [];
  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  const avgRating =
    approvedReviews.length > 0
      ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
      : '5.0';

  return (
    <div style={{ backgroundColor: 'var(--paper-cream)', minHeight: '80vh', paddingBottom: '80px' }}>
      {/* Banner */}
      <section
        style={{
          backgroundColor: 'var(--ink-deep)',
          color: '#ffffff',
          paddingTop: '64px',
          paddingBottom: '64px',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <span className="badge badge-top" style={{ marginBottom: '16px' }}>
            Customer Satisfaction
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 900,
              color: '#ffffff',
              marginBottom: '16px',
            }}
          >
            {t('sectionReviewsTitle')}
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-inverse-muted)',
              maxWidth: '640px',
              margin: '0 auto 24px auto',
            }}
          >
            {t('sectionReviewsSubtitle')}
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="btn btn-primary btn-lg"
          >
            <span>✍️ {t('btnShareReview')}</span>
          </button>
        </div>
      </section>

      {/* Main Container */}
      <div className="container" style={{ paddingTop: '48px' }}>
        {/* Rating Summary Bar */}
        <div
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '40px',
            padding: '24px 32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                fontSize: '3rem',
                fontWeight: 900,
                color: 'var(--ink-deep)',
                lineHeight: 1,
              }}
            >
              {avgRating}
            </div>
            <div>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ color: 'var(--accent-gold)', fontSize: '1.4rem' }}>
                    ★
                  </span>
                ))}
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Based on {approvedReviews.length} verified customer review{approvedReviews.length === 1 ? '' : 's'}
              </div>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn btn-secondary"
            >
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {approvedReviews.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '64px 24px',
              maxWidth: '520px',
              margin: '0 auto',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--ink-deep)', marginBottom: '8px' }}>
              No Reviews Published Yet
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Have you experienced our printing services in Dongaon? Share your feedback today!
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn btn-primary"
            >
              <span>{t('btnShareReview')}</span>
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {approvedReviews.map((review) => (
              <div
                key={review.id}
                className="card card-print-accent"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '28px',
                }}
              >
                <div>
                  {/* Rating Stars */}
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        style={{
                          color: i < review.rating ? 'var(--accent-gold)' : 'var(--paper-border)',
                          fontSize: '1.25rem',
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <p
                    style={{
                      fontSize: '0.96rem',
                      lineHeight: 1.68,
                      color: 'var(--ink-900)',
                      fontStyle: 'italic',
                      marginBottom: '24px',
                    }}
                  >
                    “{review.reviewText}”
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--paper-divider)',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--accent-terracotta-light)',
                      color: 'var(--accent-terracotta)',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      flexShrink: 0,
                    }}
                  >
                    {review.customerName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--ink-deep)' }}>
                      {review.customerName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {review.location ? `${review.location} • Verified Customer` : 'Verified Customer'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccessSubmitted={fetchContent}
      />
    </div>
  );
}
