'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Review } from '@/lib/schema';

interface HomeReviewsProps {
  reviews: Review[];
  onOpenReviewModal: () => void;
}

export const HomeReviews: React.FC<HomeReviewsProps> = ({ reviews, onOpenReviewModal }) => {
  const { language, t } = useLanguage();

  // Only display approved reviews
  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  // Compute average rating
  const avgRating =
    approvedReviews.length > 0
      ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
      : '5.0';

  return (
    <section className="section" style={{ backgroundColor: 'var(--paper-cream)' }}>
      <div className="container">
        <div className="section-header gsap-reveal-heading">
          <span className="badge badge-top" style={{ marginBottom: '12px' }}>
            ★ {avgRating} / 5.0 Rating
          </span>
          <h2 className="section-title">{t('sectionReviewsTitle')}</h2>
          <p className="section-subtitle">{t('sectionReviewsSubtitle')}</p>
        </div>

        {approvedReviews.length === 0 ? (
          /* Empty state */
          <div
            className="card"
            style={{
              textAlign: 'center',
              maxWidth: '560px',
              margin: '0 auto',
              padding: '48px 24px',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✍️</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink-deep)', marginBottom: '8px' }}>
              Be the First to Review Us!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Have you recently worked with New Chintamani Printing Press? We value your honest feedback!
            </p>
            <button type="button" onClick={onOpenReviewModal} className="btn btn-primary">
              <span>{t('btnShareReview')}</span>
            </button>
          </div>
        ) : (
          <div>
            <div
              className="gsap-stagger-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '40px',
              }}
            >
              {approvedReviews.slice(0, 3).map((review) => (
                <div
                  key={review.id}
                  className="card card-print-accent gsap-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Stars */}
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          style={{
                            color: i < review.rating ? 'var(--accent-gold)' : 'var(--paper-border)',
                            fontSize: '1.2rem',
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <p
                      style={{
                        fontSize: '0.94rem',
                        lineHeight: 1.65,
                        color: 'var(--ink-900)',
                        fontStyle: 'italic',
                        marginBottom: '20px',
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
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--accent-terracotta-light)',
                        color: 'var(--accent-terracotta)',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                      }}
                    >
                      {review.customerName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--ink-deep)' }}>
                        {review.customerName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {review.location || 'Verified Customer • Dongaon'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions: All reviews + Share review */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button type="button" onClick={onOpenReviewModal} className="btn btn-primary btn-lg">
                <span>✍️</span>
                <span>{t('btnShareReview')}</span>
              </button>
              <Link href="/reviews" className="btn btn-secondary btn-lg">
                <span>View All Reviews</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
