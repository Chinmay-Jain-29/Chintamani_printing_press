'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Service } from '@/lib/schema';

interface FeaturedServicesProps {
  services: Service[];
  onOpenQuoteModal: (serviceName?: string) => void;
}

// Curated vibrant color spectrum for printing categories
const CARD_PALETTES = [
  {
    primary: '#E11D48', // Rose / Wedding Crimson
    bgLight: 'rgba(225, 29, 72, 0.06)',
    border: 'rgba(225, 29, 72, 0.25)',
    glow: 'rgba(225, 29, 72, 0.18)',
    icon: '💌',
  },
  {
    primary: '#2563EB', // Sapphire Blue / Visiting Cards
    bgLight: 'rgba(37, 99, 235, 0.06)',
    border: 'rgba(37, 99, 235, 0.25)',
    glow: 'rgba(37, 99, 235, 0.18)',
    icon: '💳',
  },
  {
    primary: '#EA580C', // Sunburst Orange / Flex Banners
    bgLight: 'rgba(234, 88, 12, 0.06)',
    border: 'rgba(234, 88, 12, 0.25)',
    glow: 'rgba(234, 88, 12, 0.18)',
    icon: '🚩',
  },
  {
    primary: '#059669', // Emerald Green / Bill Books & Accounts
    bgLight: 'rgba(5, 150, 105, 0.06)',
    border: 'rgba(5, 150, 105, 0.25)',
    glow: 'rgba(5, 150, 105, 0.18)',
    icon: '📖',
  },
  {
    primary: '#7C3AED', // Vivid Violet / Non-Woven Carry Bags
    bgLight: 'rgba(124, 58, 237, 0.06)',
    border: 'rgba(124, 58, 237, 0.25)',
    glow: 'rgba(124, 58, 237, 0.18)',
    icon: '🛍️',
  },
  {
    primary: '#0284C7', // Electric Cyan / Flyers & Brochures
    bgLight: 'rgba(2, 132, 199, 0.06)',
    border: 'rgba(2, 132, 199, 0.25)',
    glow: 'rgba(2, 132, 199, 0.18)',
    icon: '📄',
  },
  {
    primary: '#D97706', // Warm Gold / Stickers & Labels
    bgLight: 'rgba(217, 119, 6, 0.06)',
    border: 'rgba(217, 119, 6, 0.25)',
    glow: 'rgba(217, 119, 6, 0.18)',
    icon: '🏷️',
  },
  {
    primary: '#0D9488', // Teal / Color Xerox & Lamination
    bgLight: 'rgba(13, 148, 136, 0.06)',
    border: 'rgba(13, 148, 136, 0.25)',
    glow: 'rgba(13, 148, 136, 0.18)',
    icon: '🖨️',
  },
];

export const FeaturedServices: React.FC<FeaturedServicesProps> = ({ services, onOpenQuoteModal }) => {
  const { language, t, getLocalized } = useLanguage();

  // Filter only visible & featured items (limit to 8)
  const featuredList = services
    .filter((s) => s.visible && s.featured)
    .slice(0, 8);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'printing':
        return language === 'mr' ? 'मुद्रण (Printing)' : language === 'hi' ? 'मुद्रण (Printing)' : 'Printing';
      case 'designing':
        return language === 'mr' ? 'डिझायनिंग (Designing)' : language === 'hi' ? 'डिज़ाइनिंग' : 'Designing';
      case 'other':
        return language === 'mr' ? 'इतर सेवा (Other)' : language === 'hi' ? 'अन्य सेवाएं' : 'Other Services';
      case 'coming-soon':
        return language === 'mr' ? 'लवकरच येत आहे' : language === 'hi' ? 'शीघ्र उपलब्ध' : 'Coming Soon';
      default:
        return category;
    }
  };

  return (
    <section className="section" style={{ backgroundColor: '#FDFBF7', position: 'relative' }}>
      {/* Subtle colorful background tint */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1200px',
          height: '100%',
          backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(0, 174, 239, 0.05) 0%, transparent 40%), radial-gradient(circle at 10% 70%, rgba(236, 0, 140, 0.04) 0%, transparent 40%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-header gsap-reveal-heading">
          <span className="section-badge">
            <span style={{ color: '#EC008C' }}>✦</span>
            <span>{language === 'mr' ? 'आमची खास वैशिष्ट्ये' : language === 'hi' ? 'हमारी प्रमुख सेवाएं' : 'Craft & Capabilities'}</span>
          </span>
          <h2 className="section-title">{t('sectionServicesTitle')}</h2>
          <p className="section-subtitle">{t('sectionServicesSubtitle')}</p>
        </div>

        {/* Services Grid with Vibrant Jewel-Tone Cards */}
        <div
          className="gsap-stagger-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '26px',
            marginBottom: '48px',
          }}
        >
          {featuredList.map((service, index) => {
            const palette = CARD_PALETTES[index % CARD_PALETTES.length];

            return (
              <div
                key={service.id}
                className="card gsap-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: `1px solid ${palette.border}`,
                  padding: '28px 24px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = `0 16px 36px ${palette.glow}`;
                  e.currentTarget.style.borderColor = palette.primary;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                  e.currentTarget.style.borderColor = palette.border;
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
                    backgroundColor: palette.primary,
                  }}
                />

                <div>
                  {/* Category Header with Icon Pill */}
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
                        gap: '8px',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: palette.bgLight,
                        border: `1px solid ${palette.border}`,
                      }}
                    >
                      <span style={{ fontSize: '0.9rem' }}>{palette.icon}</span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          color: palette.primary,
                        }}
                      >
                        {getCategoryLabel(service.category)}
                      </span>
                    </div>

                    {service.comingSoon ? (
                      <span className="badge badge-coming-soon">{t('badgeComingSoon')}</span>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          color: palette.primary,
                          backgroundColor: palette.bgLight,
                          padding: '3px 8px',
                          borderRadius: '12px',
                          border: `1px solid ${palette.border}`,
                        }}
                      >
                        FEATURED
                      </span>
                    )}
                  </div>

                  <h3
                    style={{
                      fontSize: '1.24rem',
                      fontWeight: 800,
                      color: '#0B1F33',
                      marginBottom: '10px',
                      lineHeight: 1.3,
                    }}
                  >
                    {getLocalized(service, 'name')}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      color: '#525E6E',
                      marginBottom: '22px',
                    }}
                  >
                    {getLocalized(service, 'desc')}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(11, 31, 51, 0.08)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onOpenQuoteModal(service.name_en)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      width: '100%',
                      fontWeight: 700,
                      color: '#0B1F33',
                      border: `1px solid ${palette.border}`,
                      backgroundColor: palette.bgLight,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = palette.primary;
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = palette.bgLight;
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

        {/* View All Services CTA Button */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/services" className="btn btn-primary btn-lg">
            <span>{t('btnViewAllServices')}</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
