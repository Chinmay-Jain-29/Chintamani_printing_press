'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const PILLAR_COLORS = [
  { color: '#2563EB', bg: 'rgba(37, 99, 235, 0.1)', border: 'rgba(37, 99, 235, 0.25)', glow: 'rgba(37, 99, 235, 0.18)' },
  { color: '#EC008C', bg: 'rgba(236, 0, 140, 0.1)', border: 'rgba(236, 0, 140, 0.25)', glow: 'rgba(236, 0, 140, 0.18)' },
  { color: '#D97706', bg: 'rgba(217, 119, 6, 0.1)', border: 'rgba(217, 119, 6, 0.25)', glow: 'rgba(217, 119, 6, 0.18)' },
  { color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.1)', border: 'rgba(124, 58, 237, 0.25)', glow: 'rgba(124, 58, 237, 0.18)' },
  { color: '#E11D48', bg: 'rgba(225, 29, 72, 0.1)', border: 'rgba(225, 29, 72, 0.25)', glow: 'rgba(225, 29, 72, 0.18)' },
  { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)', glow: 'rgba(16, 185, 129, 0.18)' },
];

export const WhyChooseUs: React.FC = () => {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: '🏛️',
      title: t('why1Title'),
      desc: t('why1Desc'),
    },
    {
      icon: '✨',
      title: t('why2Title'),
      desc: t('why2Desc'),
    },
    {
      icon: '🏷️',
      title: t('why3Title'),
      desc: t('why3Desc'),
    },
    {
      icon: '🎨',
      title: t('why4Title'),
      desc: t('why4Desc'),
    },
    {
      icon: '🤝',
      title: t('why5Title'),
      desc: t('why5Desc'),
    },
    {
      icon: '💬',
      title: t('why6Title'),
      desc: t('why6Desc'),
    },
  ];

  return (
    <section className="section" style={{ backgroundColor: '#F7F3EA', borderTop: '1px solid rgba(11, 31, 51, 0.08)' }}>
      <div className="container">
        <div className="section-header gsap-reveal-heading">
          <span className="section-badge">
            <span style={{ color: '#2563EB' }}>★</span>
            <span>{t('sectionWhySubtitle')}</span>
          </span>
          <h2 className="section-title">{t('sectionWhyTitle')}</h2>
        </div>

        <div
          className="gsap-stagger-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '26px',
          }}
        >
          {benefits.map((benefit, idx) => {
            const scheme = PILLAR_COLORS[idx % PILLAR_COLORS.length];

            return (
              <div
                key={idx}
                className="card gsap-card"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: `1px solid ${scheme.border}`,
                  display: 'flex',
                  gap: '18px',
                  padding: '28px 24px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = `0 16px 36px ${scheme.glow}`;
                  e.currentTarget.style.borderColor = scheme.color;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                  e.currentTarget.style.borderColor = scheme.border;
                }}
              >
                {/* Colorful left border indicator */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: '4px',
                    backgroundColor: scheme.color,
                  }}
                />

                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    backgroundColor: scheme.bg,
                    border: `1px solid ${scheme.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0,
                  }}
                >
                  {benefit.icon}
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: '1.12rem',
                      fontWeight: 800,
                      color: '#0B1F33',
                      marginBottom: '8px',
                      lineHeight: 1.3,
                    }}
                  >
                    {benefit.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.88rem',
                      lineHeight: 1.6,
                      color: '#525E6E',
                    }}
                  >
                    {benefit.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
