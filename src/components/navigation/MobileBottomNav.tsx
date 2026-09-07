'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  // Don't show bottom nav on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const items = [
    {
      href: '/',
      label: t('navHome'),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      href: '/services',
      label: t('navServices'),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M7 7h10" />
          <path d="M7 12h10" />
          <path d="M7 17h10" />
        </svg>
      ),
    },
    {
      href: '/portfolio',
      label: t('navPortfolio'),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      ),
    },
    {
      href: '/quote',
      label: t('navQuote'),
      isHighlight: true,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      href: '/contact',
      label: t('navContact'),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="Mobile Bottom Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--paper-border)',
        boxShadow: '0 -4px 16px rgba(15, 23, 42, 0.06)',
        paddingBottom: 'var(--bottom-safe-area)',
        height: 'calc(var(--mobile-nav-height) + var(--bottom-safe-area))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              padding: '8px 0',
              color: isActive
                ? 'var(--accent-terracotta)'
                : item.isHighlight
                ? 'var(--ink-deep)'
                : 'var(--text-secondary)',
              transition: 'all var(--transition-fast)',
              position: 'relative',
              textDecoration: 'none',
              minHeight: '48px',
            }}
          >
            {/* Active pip indicator on top */}
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  width: '24px',
                  height: '3px',
                  backgroundColor: 'var(--accent-terracotta)',
                  borderRadius: '0 0 3px 3px',
                }}
              />
            )}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'currentColor',
              }}
            >
              {item.icon}
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: isActive ? 700 : 500,
                lineHeight: 1.1,
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}

      <style jsx>{`
        @media (min-width: 769px) {
          .mobile-bottom-nav {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};
