'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Service, ServiceCategory, AppDatabase } from '@/lib/schema';
import { QuoteModal } from '@/components/quote/QuoteModal';

const CATEGORY_COLORS: Record<string, { primary: string; bgLight: string; border: string; glow: string; icon: string }> = {
  printing: {
    primary: '#2563EB',
    bgLight: 'rgba(37, 99, 235, 0.06)',
    border: 'rgba(37, 99, 235, 0.25)',
    glow: 'rgba(37, 99, 235, 0.18)',
    icon: '🖨️',
  },
  designing: {
    primary: '#7C3AED',
    bgLight: 'rgba(124, 58, 237, 0.06)',
    border: 'rgba(124, 58, 237, 0.25)',
    glow: 'rgba(124, 58, 237, 0.18)',
    icon: '🎨',
  },
  other: {
    primary: '#059669',
    bgLight: 'rgba(5, 150, 105, 0.06)',
    border: 'rgba(5, 150, 105, 0.25)',
    glow: 'rgba(5, 150, 105, 0.18)',
    icon: '📦',
  },
  'coming-soon': {
    primary: '#EA580C',
    bgLight: 'rgba(234, 88, 12, 0.06)',
    border: 'rgba(234, 88, 12, 0.25)',
    glow: 'rgba(234, 88, 12, 0.18)',
    icon: '✨',
  },
};

export default function ServicesPage() {
  const { language, t, getLocalized } = useLanguage();
  const [data, setData] = useState<AppDatabase | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [targetService, setTargetService] = useState<string>('');

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((res) => {
        if (res.database) setData(res.database);
      });
  }, []);

  const services = data?.services || [];

  const categories: { id: ServiceCategory | 'all'; label: string }[] = [
    { id: 'all', label: language === 'mr' ? 'सर्व सेवा (All)' : language === 'hi' ? 'सभी सेवाएं' : 'All Services' },
    { id: 'printing', label: language === 'mr' ? 'मुद्रण (Printing)' : language === 'hi' ? 'मुद्रण' : 'Printing' },
    { id: 'designing', label: language === 'mr' ? 'डिझायनिंग (Designing)' : language === 'hi' ? 'डिज़ाइनिंग' : 'Designing' },
    { id: 'other', label: language === 'mr' ? 'इतर सेवा (Other)' : language === 'hi' ? 'अन्य' : 'Other Services' },
    { id: 'coming-soon', label: language === 'mr' ? 'लवकरच येत आहे' : language === 'hi' ? 'शीघ्र उपलब्ध' : 'Coming Soon' },
  ];

  const filteredServices = services.filter((s) => {
    if (!s.visible) return false;
    if (selectedCategory === 'all') return true;
    return s.category === selectedCategory;
  });

  const handleOpenQuote = (serviceName: string) => {
    setTargetService(serviceName);
    setQuoteModalOpen(true);
  };

  return (
    <div style={{ backgroundColor: '#FDFBF7', minHeight: '80vh', paddingBottom: '80px' }}>
      {/* Colorful Banner */}
      <section
        style={{
          backgroundColor: '#0B1F33',
          color: '#FFFFFF',
          paddingTop: '68px',
          paddingBottom: '68px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top Rainbow Spectrum Stripe */}
        <div className="cmyk-rainbow-stripe" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />

        {/* Ambient Glowing Color Orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '15%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 174, 239, 0.18) 0%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '15%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236, 0, 140, 0.18) 0%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(0, 174, 239, 0.15)',
              color: '#38BDF8',
              border: '1px solid rgba(0, 174, 239, 0.35)',
              fontSize: '0.8rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '16px',
            }}
          >
            <span>✦ COMPREHENSIVE PRINT CAPABILITIES</span>
          </span>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
              fontWeight: 900,
              color: '#FFFFFF',
              marginBottom: '16px',
              letterSpacing: '-0.02em',
            }}
          >
            {language === 'mr' ? (
              <>
                आमच्या मुद्रण व{' '}
                <span className="gradient-text-cmyk">डिझायनिंग सेवा</span>
              </>
            ) : language === 'hi' ? (
              <>
                हमारी मुद्रण व{' '}
                <span className="gradient-text-cmyk">डिज़ाइनिंग सेवाएं</span>
              </>
            ) : (
              <>
                Our Printing &amp;{' '}
                <span className="gradient-text-cmyk">Designing Services</span>
              </>
            )}
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#94A3B8',
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            {t('sectionServicesSubtitle')}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container" style={{ paddingTop: '48px' }}>
        {/* Category Selector Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '20px',
            marginBottom: '32px',
          }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.9rem',
                  fontWeight: isSelected ? 800 : 600,
                  whiteSpace: 'nowrap',
                  background: isSelected
                    ? 'linear-gradient(135deg, #0B1F33 0%, #1E3A8A 100%)'
                    : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#475569',
                  border: isSelected
                    ? '1px solid #00AEEF'
                    : '1px solid rgba(11, 31, 51, 0.12)',
                  boxShadow: isSelected
                    ? '0 4px 16px rgba(0, 174, 239, 0.25)'
                    : 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Services Cards Grid with Colorful Jewel Tones */}
        {filteredServices.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '64px 24px',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📦</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B1F33', marginBottom: '8px' }}>
              No Services Found in this Category
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '20px' }}>
              Please select another category or contact us directly for custom printing inquiries.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="btn btn-secondary"
            >
              Show All Services
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
            {filteredServices.map((service) => {
              const theme = CATEGORY_COLORS[service.category] || CATEGORY_COLORS.printing;

              return (
                <div
                  key={service.id}
                  id={service.slug}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '28px 24px',
                    borderRadius: '16px',
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${theme.border}`,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = `0 16px 36px ${theme.glow}`;
                    e.currentTarget.style.borderColor = theme.primary;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                    e.currentTarget.style.borderColor = theme.border;
                  }}
                >
                  {/* Colorful Top Accent Strip */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      backgroundColor: theme.primary,
                    }}
                  />

                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: theme.bgLight,
                          border: `1px solid ${theme.border}`,
                        }}
                      >
                        <span>{theme.icon}</span>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: theme.primary,
                          }}
                        >
                          {service.category.toUpperCase()}
                        </span>
                      </div>

                      {service.comingSoon ? (
                        <span className="badge badge-coming-soon">{t('badgeComingSoon')}</span>
                      ) : service.featured ? (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            color: '#FFFFFF',
                            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                            padding: '3px 8px',
                            borderRadius: '12px',
                          }}
                        >
                          FEATURED
                        </span>
                      ) : null}
                    </div>

                    <h3
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: '#0B1F33',
                        marginBottom: '12px',
                        lineHeight: 1.3,
                      }}
                    >
                      {getLocalized(service, 'name')}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.92rem',
                        lineHeight: 1.65,
                        color: '#525E6E',
                        marginBottom: '24px',
                      }}
                    >
                      {getLocalized(service, 'desc')}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      paddingTop: '20px',
                      borderTop: '1px solid rgba(11, 31, 51, 0.08)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenQuote(service.name_en)}
                      className="btn btn-secondary btn-sm"
                      style={{
                        flex: 1,
                        fontWeight: 700,
                        color: '#0B1F33',
                        border: `1px solid ${theme.border}`,
                        backgroundColor: theme.bgLight,
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = theme.primary;
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = theme.bgLight;
                        e.currentTarget.style.color = '#0B1F33';
                      }}
                    >
                      <span>📝 {t('navQuote')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quote Request Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        preselectedService={targetService}
      />
    </div>
  );
}
