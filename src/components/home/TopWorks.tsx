'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { PortfolioItem } from '@/lib/schema';

interface TopWorksProps {
  portfolio: PortfolioItem[];
}

export const TopWorks: React.FC<TopWorksProps> = ({ portfolio }) => {
  const { t, getLocalized } = useLanguage();
  const [activePreview, setActivePreview] = useState<PortfolioItem | null>(null);

  // Filter visible items marked as topWork (or featured if none marked as topWork)
  const topItems = portfolio
    .filter((p) => p.visible && (p.topWork || p.featured))
    .slice(0, 6);

  if (topItems.length === 0) {
    return null;
  }

  return (
    <section className="section" style={{ backgroundColor: 'var(--paper-cream)' }}>
      <div className="container">
        <div className="section-header gsap-reveal-heading">
          <span className="badge badge-top" style={{ marginBottom: '12px' }}>
            {t('badgeTopWork')}
          </span>
          <h2 className="section-title">{t('sectionTopWorksTitle')}</h2>
          <p className="section-subtitle">{t('sectionTopWorksSubtitle')}</p>
        </div>

        {/* Masonry-inspired grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
            marginBottom: '40px',
          }}
        >
          {topItems.map((item) => (
            <div
              key={item.id}
              className="card gsap-portfolio-card"
              style={{
                padding: '0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
              }}
              onClick={() => setActivePreview(item)}
            >
              <div
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--paper-ivory)',
                  overflow: 'hidden',
                  aspectRatio: '16/11',
                }}
              >
                {/* eslint-disable-next-run @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={getLocalized(item, 'title')}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform var(--transition-normal)',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    display: 'flex',
                    gap: '6px',
                  }}
                >
                  <span className="badge badge-top">⭐ Top Work</span>
                </div>
              </div>

              <div style={{ padding: '20px' }}>
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: 'var(--ink-deep)',
                    marginBottom: '8px',
                  }}
                >
                  {getLocalized(item, 'title')}
                </h3>
                <p
                  style={{
                    fontSize: '0.88rem',
                    lineHeight: 1.55,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {getLocalized(item, 'desc')}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/portfolio" className="btn btn-secondary btn-lg">
            <span>{t('btnViewPortfolio')}</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Lightbox / Zoom Modal for Top Work */}
      {activePreview && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 120,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setActivePreview(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--paper-card)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '800px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-run @next/next/no-img-element */}
            <img
              src={activePreview.imageUrl}
              alt={getLocalized(activePreview, 'title')}
              style={{ width: '100%', maxHeight: '550px', objectFit: 'contain', backgroundColor: '#000' }}
            />
            <div style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--ink-deep)', marginBottom: '8px' }}>
                {getLocalized(activePreview, 'title')}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px' }}>
                {getLocalized(activePreview, 'desc')}
              </p>
              <button
                type="button"
                onClick={() => setActivePreview(null)}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
