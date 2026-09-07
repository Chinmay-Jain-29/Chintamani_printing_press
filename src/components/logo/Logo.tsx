'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'compact' | 'mark-only';
  mode?: 'dark' | 'light';
  customLogoUrl?: string | null;
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  mode = 'light',
  customLogoUrl,
  className = '',
  showTagline = true,
}) => {
  const isLight = mode === 'light';
  const primaryTextColor = isLight ? '#0B1F33' : '#F7F3EA';
  const secondaryTextColor = isLight ? '#C9A227' : '#E0BA3F';
  const subtextColor = isLight ? '#525E6E' : '#A8B8C9';

  // If a custom logo has been uploaded by the admin, render it
  if (customLogoUrl) {
    return (
      <Link href="/" className={`inline-flex items-center gap-3 ${className}`} aria-label="New Chintamani Printing Press">
        {/* eslint-disable-next-run @next/next/no-img-element */}
        <img
          src={customLogoUrl}
          alt="New Chintamani Printing Press"
          style={{ maxHeight: variant === 'compact' ? '40px' : '52px', objectFit: 'contain' }}
        />
      </Link>
    );
  }

  // Original bespoke vector logo in Deep Navy + Warm Gold
  return (
    <Link
      href="/"
      className={`logo-link ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none',
        userSelect: 'none',
      }}
      aria-label="New Chintamani Printing Press Home"
    >
      {/* Precision Printing Seal Mark */}
      <svg
        width={variant === 'compact' ? 40 : 48}
        height={variant === 'compact' ? 40 : 48}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="ncpp-navy-plate" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#122B45" />
            <stop offset="1" stopColor="#0B1F33" />
          </linearGradient>
          <linearGradient id="ncpp-gold-accent" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E0BA3F" />
            <stop offset="1" stopColor="#C9A227" />
          </linearGradient>
        </defs>

        {/* Outer Print Stamp Frame */}
        <rect
          x="3"
          y="3"
          width="58"
          height="58"
          rx="14"
          fill="url(#ncpp-navy-plate)"
          stroke="#C9A227"
          strokeWidth="2"
        />

        {/* Registration Crosshairs */}
        <circle cx="32" cy="32" r="23" stroke="rgba(247, 243, 234, 0.2)" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="32" y1="4" x2="32" y2="10" stroke="#C9A227" strokeWidth="1.5" />
        <line x1="32" y1="54" x2="32" y2="60" stroke="#C9A227" strokeWidth="1.5" />
        <line x1="4" y1="32" x2="10" y2="32" stroke="#C9A227" strokeWidth="1.5" />
        <line x1="54" y1="32" x2="60" y2="32" stroke="#C9A227" strokeWidth="1.5" />

        {/* 4 CMYK Process Calibration Dots */}
        <circle cx="16" cy="16" r="2.5" fill="#00AEEF" /> {/* Cyan */}
        <circle cx="48" cy="16" r="2.5" fill="#EC008C" /> {/* Magenta */}
        <circle cx="16" cy="48" r="2.5" fill="#FFF200" /> {/* Yellow */}
        <circle cx="48" cy="48" r="2.5" fill="#FFFFFF" /> {/* Key */}

        {/* "C" + "P" Monogram */}
        <path
          d="M23 20H37C41.4183 20 45 23.5817 45 28C45 32.4183 41.4183 36 37 36H28V44H23V20Z"
          fill="url(#ncpp-gold-accent)"
        />
        <circle cx="33" cy="28" r="3.5" fill="#0B1F33" />
        <path
          d="M23 29C20.5 29 18 31 18 34C18 37 20 39 23 39"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Typography block */}
      {variant !== 'mark-only' && (
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 900,
              fontSize: variant === 'compact' ? '0.95rem' : '1.15rem',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: primaryTextColor,
              textTransform: 'uppercase',
            }}
          >
            NEW CHINTAMANI
          </div>

          <div
            style={{
              fontSize: variant === 'compact' ? '0.74rem' : '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: secondaryTextColor,
              textTransform: 'uppercase',
              lineHeight: 1.2,
            }}
          >
            PRINTING PRESS
          </div>

          {showTagline && (
            <div
              style={{
                fontSize: '0.68rem',
                color: subtextColor,
                fontWeight: 600,
                marginTop: '1px',
                letterSpacing: '0.04em',
              }}
            >
              Dongaon • Estd. 1999
            </div>
          )}
        </div>
      )}
    </Link>
  );
};
