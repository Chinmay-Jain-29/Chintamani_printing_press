'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { TimelineMilestone } from '@/lib/schema';

interface HeritageTimelineProps {
  timeline: TimelineMilestone[];
}

const MILESTONE_COLORS = [
  { color: '#2563EB', bg: 'rgba(37, 99, 235, 0.08)', border: 'rgba(37, 99, 235, 0.25)', glow: 'rgba(37, 99, 235, 0.2)' },
  { color: '#D97706', bg: 'rgba(217, 119, 6, 0.08)', border: 'rgba(217, 119, 6, 0.25)', glow: 'rgba(217, 119, 6, 0.2)' },
  { color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.08)', border: 'rgba(124, 58, 237, 0.25)', glow: 'rgba(124, 58, 237, 0.2)' },
  { color: '#059669', bg: 'rgba(5, 150, 105, 0.08)', border: 'rgba(5, 150, 105, 0.25)', glow: 'rgba(5, 150, 105, 0.2)' },
];

export const HeritageTimeline: React.FC<HeritageTimelineProps> = ({ timeline }) => {
  const { t, getLocalized } = useLanguage();

  return (
    <section
      style={{
        backgroundColor: '#F7F3EA',
        borderTop: '1px solid rgba(11, 31, 51, 0.08)',
        borderBottom: '1px solid rgba(11, 31, 51, 0.08)',
        paddingTop: '72px',
        paddingBottom: '72px',
        position: 'relative',
      }}
    >
      <div className="container">
        <div className="section-header gsap-reveal-heading">
          <span className="section-badge">
            <span style={{ color: '#D97706' }}>⏳</span>
            <span>{t('badgeEstablished')}</span>
          </span>
          <h2 className="section-title">{t('sectionHeritageTitle')}</h2>
          <p className="section-subtitle">{t('sectionHeritageSubtitle')}</p>
        </div>

        {/* Responsive Timeline Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            position: 'relative',
          }}
        >
          {timeline.map((item, index) => {
            const scheme = MILESTONE_COLORS[index % MILESTONE_COLORS.length];

            return (
              <div
                key={index}
                className="card gsap-timeline-item"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  padding: '28px 24px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: `1px solid ${scheme.border}`,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = `0 14px 32px ${scheme.glow}`;
                  e.currentTarget.style.borderColor = scheme.color;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                  e.currentTarget.style.borderColor = scheme.border;
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
                    backgroundColor: scheme.color,
                  }}
                />

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '16px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '1.45rem',
                      fontWeight: 900,
                      color: scheme.color,
                      letterSpacing: '-0.02em',
                      backgroundColor: scheme.bg,
                      padding: '2px 10px',
                      borderRadius: '8px',
                      border: `1px solid ${scheme.border}`,
                    }}
                  >
                    {item.year}
                  </span>
                  <span
                    style={{
                      height: '2px',
                      flex: 1,
                      backgroundColor: scheme.border,
                    }}
                  />
                </div>

                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#0B1F33',
                    marginBottom: '10px',
                    lineHeight: 1.3,
                  }}
                >
                  {getLocalized(item, 'title')}
                </h3>

                <p
                  style={{
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    color: '#525E6E',
                    marginTop: 'auto',
                  }}
                >
                  {getLocalized(item, 'desc')}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
