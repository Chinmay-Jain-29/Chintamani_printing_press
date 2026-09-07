'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { PortfolioItem, AppDatabase } from '@/lib/schema';
import { QuoteModal } from '@/components/quote/QuoteModal';

export default function PortfolioPage() {
  const { language, t, getLocalized } = useLanguage();
  const [data, setData] = useState<AppDatabase | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((res) => res.database && setData(res.database));
  }, []);

  const portfolio = data?.portfolio || [];

  const filterCategories = [
    { key: 'all', label_en: 'All Works', label_mr: 'सर्व कामे', label_hi: 'सभी कार्य' },
    { key: 'wedding', label_en: 'Wedding Cards', label_mr: 'लग्नपत्रिका', label_hi: 'शादी के कार्ड' },
    { key: 'visiting-cards', label_en: 'Visiting Cards', label_mr: 'व्हिजिटिंग कार्ड्स', label_hi: 'विज़िटिंग कार्ड्स' },
    { key: 'invitations', label_en: 'Invitations', label_mr: 'निमंत्रण पत्र', label_hi: 'निमंत्रण पत्र' },
    { key: 'business-printing', label_en: 'Business Printing', label_mr: 'व्यावसायिक मुद्रण', label_hi: 'व्यावसायिक मुद्रण' },
    { key: 'promotional', label_en: 'Promotional & Flex', label_mr: 'फ्लेक्स व जाहिरात', label_hi: 'फ्लेक्स व प्रचार' },
    { key: 'packaging', label_en: 'Packaging & Bags', label_mr: 'पिशव्या व पॅकेजिंग', label_hi: 'थैले व पैकेजिंग' },
  ];

  const filteredItems = portfolio.filter((item) => {
    if (!item.visible) return false;
    if (selectedFilter === 'all') return true;
    return item.category === selectedFilter;
  });

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
            Real Craftsmanship
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 900,
              color: '#ffffff',
              marginBottom: '16px',
            }}
          >
            {t('navPortfolio')}
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-inverse-muted)',
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            Explore actual examples of our printing and graphic designing work completed for clients in Dongaon, Mehekar, and Buldhana.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="container" style={{ paddingTop: '48px' }}>
        {/* Filter Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '16px',
            marginBottom: '36px',
            scrollbarWidth: 'none',
          }}
        >
          {filterCategories.map((cat) => {
            const isActive = selectedFilter === cat.key;
            const label =
              language === 'mr'
                ? cat.label_mr
                : language === 'hi'
                ? cat.label_hi
                : cat.label_en;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedFilter(cat.key)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? 'var(--accent-terracotta)' : 'var(--paper-card)',
                  color: isActive ? '#ffffff' : 'var(--text-primary)',
                  border: isActive ? '1px solid var(--accent-terracotta)' : '1px solid var(--paper-border)',
                  boxShadow: isActive ? '0 4px 12px rgba(194, 94, 46, 0.25)' : 'var(--shadow-sm)',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '64px 24px',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🖼️</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink-deep)', marginBottom: '8px' }}>
              No Works Found
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
              We are regularly updating our digital catalog. Contact us to see physical samples at our Dongaon shop!
            </p>
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className="btn btn-secondary"
            >
              View All Works
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '28px',
            }}
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="card"
                style={{
                  padding: '0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
                onClick={() => setActiveItem(item)}
              >
                <div
                  style={{
                    position: 'relative',
                    backgroundColor: 'var(--paper-ivory)',
                    aspectRatio: '16/11',
                    overflow: 'hidden',
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

                  {/* Badges */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      display: 'flex',
                      gap: '6px',
                    }}
                  >
                    {item.topWork && <span className="badge badge-top">★ Top Work</span>}
                    {item.featured && <span className="badge badge-featured">Featured</span>}
                  </div>
                </div>

                <div style={{ padding: '24px' }}>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--accent-terracotta)',
                      marginBottom: '6px',
                    }}
                  >
                    {item.category.toUpperCase()}
                  </div>

                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: 'var(--ink-deep)',
                      marginBottom: '8px',
                      lineHeight: 1.3,
                    }}
                  >
                    {getLocalized(item, 'title')}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      color: 'var(--text-secondary)',
                      marginBottom: '16px',
                    }}
                  >
                    {getLocalized(item, 'desc')}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      color: 'var(--accent-terracotta)',
                      fontWeight: 600,
                    }}
                  >
                    <span>Click to Zoom &amp; Inquire</span>
                    <span>🔍</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Zoom Modal */}
      {activeItem && (
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
            padding: '20px',
          }}
          onClick={() => setActiveItem(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--paper-card)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '820px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-run @next/next/no-img-element */}
            <img
              src={activeItem.imageUrl}
              alt={getLocalized(activeItem, 'title')}
              style={{ width: '100%', maxHeight: '550px', objectFit: 'contain', backgroundColor: '#0f172a' }}
            />
            <div style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <div>
                  <span className="badge badge-top" style={{ marginBottom: '8px' }}>
                    {activeItem.category.toUpperCase()}
                  </span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink-deep)', marginBottom: '8px' }}>
                    {getLocalized(activeItem, 'title')}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px' }}>
                    {getLocalized(activeItem, 'desc')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  style={{ fontSize: '1.4rem', color: 'var(--text-muted)', padding: '4px' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveItem(null);
                    setQuoteOpen(true);
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <span>📝 Request Quote for Similar Work</span>
                </button>

                <a
                  href={`https://wa.me/919421396905?text=${encodeURIComponent(`Namaskar! I saw your portfolio item "${activeItem.title_en}" on your website and would like to order something similar.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <span>💬 Discuss on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quote Modal */}
      <QuoteModal
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        services={data?.services || []}
      />
    </div>
  );
}
