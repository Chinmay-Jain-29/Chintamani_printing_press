'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { AppDatabase } from '@/lib/schema';
import { QuoteModal } from '@/components/quote/QuoteModal';

export default function ContactPage() {
  const { language, t } = useLanguage();
  const [data, setData] = useState<AppDatabase | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((res) => res.database && setData(res.database));
  }, []);

  const business = data?.businessInfo;
  const phone1 = business?.phone1 || '9421396905';
  const phone2 = business?.phone2 || '9834853851';
  const whatsapp = business?.whatsapp || '9421396905';
  const email = business?.email || 'chintamanidongaon@gmail.com';
  const hours =
    language === 'mr'
      ? business?.businessHours_mr || 'सकाळी ८:०० ते रात्री ८:३० (सर्व दिवस)'
      : language === 'hi'
      ? business?.businessHours_hi || 'सुबह ८:०० से रात ८:३० (सभी दिन)'
      : business?.businessHours_en || '8:00 AM – 8:30 PM (All Days)';

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
            Visit Our Shop
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 900,
              color: '#ffffff',
              marginBottom: '16px',
            }}
          >
            {t('navContact')}
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-inverse-muted)',
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            {t('sectionContactSubtitle')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container" style={{ paddingTop: '48px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
          }}
        >
          {/* Card 1: Official Business Identity & Address */}
          <div
            className="card card-print-accent"
            style={{
              padding: '36px',
              backgroundColor: 'var(--paper-card)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span className="badge badge-featured" style={{ marginBottom: '12px' }}>
                Established 1999
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--ink-deep)', marginBottom: '4px' }}>
                {business?.name || 'NEW CHINTAMANI PRINTING PRESS'}
              </h2>
              <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Proprietor: <strong>{business?.owner || 'Mr. Prakash Devendra Jain'}</strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '14px' }}>
                  <span style={{ fontSize: '1.4rem' }}>📍</span>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink-deep)', marginBottom: '4px' }}>
                      Shop Location
                    </h3>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      Shrikant Talkies Road, Bus Stand,<br />
                      At. Dongaon, Tq. Mehekar,<br />
                      Dist. Buldhana, Maharashtra – 443303
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <span style={{ fontSize: '1.4rem' }}>⏰</span>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink-deep)', marginBottom: '4px' }}>
                      {t('hoursLabel')}
                    </h3>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                      {hours}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <span style={{ fontSize: '1.4rem' }}>📞</span>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink-deep)', marginBottom: '4px' }}>
                      Contact Numbers
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
                      <a href={`tel:${phone1}`} className="btn btn-secondary btn-sm">
                        📞 {phone1}
                      </a>
                      <a href={`tel:${phone2}`} className="btn btn-secondary btn-sm">
                        📞 {phone2}
                      </a>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <span style={{ fontSize: '1.4rem' }}>💬</span>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink-deep)', marginBottom: '4px' }}>
                      WhatsApp Direct
                    </h3>
                    <a
                      href={`https://wa.me/91${whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp btn-sm"
                      style={{ marginTop: '4px' }}
                    >
                      <span>💬 Chat with Mr. Prakash Jain ({whatsapp})</span>
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <span style={{ fontSize: '1.4rem' }}>✉️</span>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink-deep)', marginBottom: '4px' }}>
                      Email Inquiries
                    </h3>
                    <a href={`mailto:${email}`} style={{ fontSize: '0.92rem', color: 'var(--accent-terracotta)', fontWeight: 600 }}>
                      {email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ paddingTop: '28px', marginTop: '28px', borderTop: '1px solid var(--paper-border)' }}>
              <button
                type="button"
                onClick={() => setQuoteOpen(true)}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                <span>📝 Request an Estimate Online</span>
              </button>
            </div>
          </div>

          {/* Card 2: Location Map / Area Guide */}
          <div
            className="card"
            style={{
              padding: '0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '440px',
            }}
          >
            {business?.googleMapsUrl ? (
              <iframe
                title="Shop Location on Google Maps"
                src={business.googleMapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '440px', flex: 1 }}
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <div
                style={{
                  padding: '48px 32px',
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
                    width: '72px',
                    height: '72px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--accent-terracotta-light)',
                    color: 'var(--accent-terracotta)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    marginBottom: '20px',
                  }}
                >
                  📍
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink-deep)', marginBottom: '10px' }}>
                  Finding Our Press in Dongaon
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.65, maxWidth: '440px', marginBottom: '24px' }}>
                  Our printing press is centrally located right on <strong>Shrikant Talkies Road</strong> adjacent to the Bus Stand in Dongaon. Whether coming from Mehekar or Buldhana, we are within immediate walking distance from the bus stop.
                </p>

                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    gap: '6px',
                    padding: '14px 20px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--paper-card)',
                    border: '1px solid var(--paper-border)',
                    fontSize: '0.88rem',
                    color: 'var(--ink-800)',
                    textAlign: 'left',
                  }}
                >
                  <div>✓ <strong>Bus Stand:</strong> 2-minute walk</div>
                  <div>✓ <strong>Shrikant Talkies Road:</strong> Direct roadside entrance</div>
                  <div>✓ <strong>Parking:</strong> Two-wheeler and car parking available</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <QuoteModal
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        services={data?.services || []}
      />
    </div>
  );
}
