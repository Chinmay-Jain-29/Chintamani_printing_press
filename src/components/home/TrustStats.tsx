'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { TrustStat } from '@/lib/schema';

interface TrustStatsProps {
  stats: TrustStat[];
}

const STAT_COLORS = [
  { text: '#38BDF8', glow: 'rgba(56, 189, 248, 0.4)', icon: '⏳' }, // Electric Cyan / Years
  { text: '#FBBF24', glow: 'rgba(251, 191, 36, 0.4)', icon: '🏛️' }, // Sunburst Gold / 1999
  { text: '#F43F5E', glow: 'rgba(244, 63, 94, 0.4)', icon: '📦' }, // Vibrant Magenta / Products
  { text: '#34D399', glow: 'rgba(52, 211, 153, 0.4)', icon: '🤝' }, // Emerald / Trust
];

export const TrustStats: React.FC<TrustStatsProps> = ({ stats }) => {
  const { getLocalized } = useLanguage();

  if (!stats || stats.length === 0) return null;

  return (
    <section
      style={{
        backgroundColor: '#0B1F33',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Rainbow Spectrum Hairline */}
      <div className="cmyk-rainbow-stripe" />

      <div className="container" style={{ paddingTop: '52px', paddingBottom: '52px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
            textAlign: 'center',
          }}
        >
          {stats.map((item, index) => {
            const colorScheme = STAT_COLORS[index % STAT_COLORS.length];

            return (
              <div
                key={item.id}
                style={{
                  padding: '24px 20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.3s ease, border-color 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = colorScheme.text;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>
                  {colorScheme.icon}
                </div>

                <div
                  className="gsap-stat-counter"
                  data-target={item.value}
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 'clamp(2.4rem, 4.2vw, 3.4rem)',
                    fontWeight: 900,
                    color: colorScheme.text,
                    textShadow: `0 4px 18px ${colorScheme.glow}`,
                    lineHeight: 1.1,
                    marginBottom: '8px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {item.value}
                </div>

                <div
                  style={{
                    fontSize: '0.98rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {getLocalized(item, 'label')}
                </div>

                <div
                  style={{
                    fontSize: '0.84rem',
                    color: '#94A3B8',
                    lineHeight: 1.45,
                  }}
                >
                  {getLocalized(item, 'description')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
