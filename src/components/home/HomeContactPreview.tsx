'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { BusinessInfo } from '@/lib/schema';

interface HomeContactProps {
  business: BusinessInfo;
  onOpenQuoteModal: () => void;
}

export const HomeContactPreview: React.FC<HomeContactProps> = ({ business, onOpenQuoteModal }) => {
  const { language, t } = useLanguage();

  const hours =
    language === 'mr'
      ? business.businessHours_mr
      : language === 'hi'
      ? business.businessHours_hi
      : business.businessHours_en;

  return (
    <section className="section" style={{ backgroundColor: 'var(--paper-ivory)', borderTop: '1px solid var(--paper-border)' }}>
      <div className="container">
        <div className="section-header">
          <span className="badge badge-featured" style={{ marginBottom: '12px' }}>
            {language === 'mr' ? 'भेट द्या किंवा संपर्क करा' : language === 'hi' ? 'दुकान पर पधारें या संपर्क करें' : 'Visit Or Reach Out'}
          </span>
          <h2 className="section-title">{t('sectionContactTitle')}</h2>
          <p className="section-subtitle">{t('sectionContactSubtitle')}</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '32px',
          }}
          className="contact-preview-grid"
        >
          {/* Left Column: Business Card & Contacts */}
          <div
            className="card"
            style={{
              padding: '36px',
              backgroundColor: 'var(--paper-card)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ marginBottom: '20px' }}>
                <span className="badge badge-top" style={{ marginBottom: '8px' }}>
                  Estd. 1999 • Dongaon
                </span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--ink-deep)', lineHeight: 1.2 }}>
                  {business.name}
                </h3>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Proprietor: <strong>{business.owner}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem', color: 'var(--accent-terracotta)' }}>📍</span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--ink-deep)' }}>
                      Shop Address:
                    </strong>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {business.address},<br />
                      At. Dongaon, Tq. {business.taluka},<br />
                      Dist. {business.district}, Maharashtra – {business.pincode}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem', color: 'var(--accent-terracotta)' }}>⏰</span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--ink-deep)' }}>
                      {t('hoursLabel')}:
                    </strong>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {hours}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem', color: 'var(--accent-terracotta)' }}>📞</span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--ink-deep)' }}>
                      Direct Phone:
                    </strong>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '2px' }}>
                      <a href={`tel:${business.phone1}`} style={{ color: 'var(--ink-deep)', fontWeight: 700 }}>
                        +91 {business.phone1}
                      </a>
                      <span>•</span>
                      <a href={`tel:${business.phone2}`} style={{ color: 'var(--ink-deep)', fontWeight: 700 }}>
                        +91 {business.phone2}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              <a href={`tel:${business.phone1}`} className="btn btn-secondary">
                <span>📞</span>
                <span>{t('btnCallNow')}</span>
              </a>
              <a
                href={`https://wa.me/91${business.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </a>
              <button type="button" onClick={onOpenQuoteModal} className="btn btn-primary">
                <span>📝</span>
                <span>{t('navQuote')}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Google Map or Elegant Local Area Landmark Showcase */}
          <div
            style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--paper-border)',
              backgroundColor: 'var(--paper-card)',
              minHeight: '340px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {business.googleMapsUrl ? (
              <iframe
                title="New Chintamani Printing Press Location Map"
                src={business.googleMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '360px', flex: 1 }}
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <div
                style={{
                  padding: '36px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  flex: 1,
                  backgroundColor: 'var(--paper-cream)',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--accent-terracotta-light)',
                    color: 'var(--accent-terracotta)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    marginBottom: '16px',
                  }}
                >
                  📍
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink-deep)', marginBottom: '8px' }}>
                  Conveniently Located at Bus Stand Road
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '420px', marginBottom: '20px' }}>
                  Our workshop is situated right opposite Shrikant Talkies Road near the Central Bus Stand in Dongaon, easily accessible from Mehekar, Janephal, and surrounding villages.
                </p>
                <div
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--paper-ivory)',
                    border: '1px solid var(--paper-border)',
                    fontSize: '0.85rem',
                    color: 'var(--ink-700)',
                    fontWeight: 600,
                  }}
                >
                  🗺️ Map coordinates can be updated anytime from the Admin Dashboard
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 992px) {
          .contact-preview-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
