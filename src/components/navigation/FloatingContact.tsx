'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

interface FloatingContactProps {
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({
  phone = '9421396905',
  whatsapp = '9421396905',
  email = 'chintamanidongaon@gmail.com',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  // Hide on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const actions = [
    {
      label: 'WhatsApp',
      href: `https://wa.me/91${whatsapp}?text=${encodeURIComponent('Namaskar, I would like to inquire about printing services at New Chintamani Printing Press.')}`,
      icon: '💬',
      bgColor: '#25d366',
      textColor: '#ffffff',
      external: true,
    },
    {
      label: 'Call Press',
      href: `tel:${phone}`,
      icon: '📞',
      bgColor: 'var(--ink-deep)',
      textColor: '#ffffff',
      external: false,
    },
    {
      label: 'Get Quote',
      href: '/quote',
      icon: '📝',
      bgColor: 'var(--accent-terracotta)',
      textColor: '#ffffff',
      external: false,
    },
    {
      label: 'Email Us',
      href: `mailto:${email}`,
      icon: '✉️',
      bgColor: '#0284c7',
      textColor: '#ffffff',
      external: false,
    },
  ];

  return (
    <div
      className="floating-contact-container"
      style={{
        position: 'fixed',
        right: '20px',
        bottom: 'calc(var(--mobile-nav-height) + var(--bottom-safe-area) + 16px)',
        zIndex: 85,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '10px',
      }}
    >
      {/* Expanded action items */}
      {isOpen && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            animation: 'fadeInUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            marginBottom: '4px',
          }}
        >
          {actions.map((act) => (
            act.external ? (
              <a
                key={act.label}
                href={act.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: act.bgColor,
                  color: act.textColor,
                  boxShadow: 'var(--shadow-md)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'transform var(--transition-fast)',
                }}
              >
                <span>{act.icon}</span>
                <span>{act.label}</span>
              </a>
            ) : (
              <Link
                key={act.label}
                href={act.href}
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: act.bgColor,
                  color: act.textColor,
                  boxShadow: 'var(--shadow-md)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'transform var(--transition-fast)',
                }}
              >
                <span>{act.icon}</span>
                <span>{act.label}</span>
              </Link>
            )
          ))}
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close contact shortcuts' : 'Open contact shortcuts'}
        style={{
          width: '54px',
          height: '54px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: isOpen ? 'var(--ink-deep)' : 'var(--accent-terracotta)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(194, 94, 46, 0.4)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isOpen ? 'rotate(90deg)' : 'none',
        }}
      >
        {isOpen ? (
          <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>✕</span>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (min-width: 769px) {
          .floating-contact-container {
            bottom: 30px !important;
            right: 30px !important;
          }
        }
      `}</style>
    </div>
  );
};
