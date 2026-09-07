'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Logo } from '@/components/logo/Logo';
import { SupportedLanguage } from '@/lib/schema';

interface HeaderProps {
  customLogoUrl?: string | null;
  phone?: string;
  whatsapp?: string;
}

export const Header: React.FC<HeaderProps> = ({
  customLogoUrl,
  phone = '9421396905',
  whatsapp = '9421396905',
}) => {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: t('navHome') },
    { href: '/about', label: t('navAbout') },
    { href: '/services', label: t('navServices') },
    { href: '/portfolio', label: t('navPortfolio') },
    { href: '/reviews', label: t('navReviews') },
    { href: '/contact', label: t('navContact') },
  ];

  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'mr', label: 'मराठी' },
    { code: 'hi', label: 'हिंदी' },
  ];

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: isScrolled ? 'rgba(247, 243, 234, 0.95)' : '#F7F3EA',
          backdropFilter: 'blur(12px)',
          borderBottom: isScrolled ? '1px solid rgba(11, 31, 51, 0.1)' : '1px solid transparent',
          boxShadow: isScrolled ? '0 4px 20px rgba(11, 31, 51, 0.05)' : 'none',
          transition: 'all var(--transition-normal)',
          height: 'var(--header-height)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Top Vibrant CMYK Printing Spectrum Hairline */}
        <div className="cmyk-rainbow-stripe" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />

        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Logo customLogoUrl={customLogoUrl} variant="full" />

          {/* Desktop Navigation */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '26px',
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? '#0B1F33' : '#525E6E',
                    position: 'relative',
                    padding: '8px 0',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #00AEEF 0%, #EC008C 100%)',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Controls (Language Switcher + Quote Button + Hamburger) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Language Switcher */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'rgba(11, 31, 51, 0.06)',
                padding: '3px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(11, 31, 51, 0.08)',
              }}
              aria-label="Language selector"
            >
              {languages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLanguage(item.code)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: language === item.code ? 800 : 600,
                    background: language === item.code ? 'linear-gradient(135deg, #0B1F33 0%, #1E3A8A 100%)' : 'transparent',
                    color: language === item.code ? '#FFFFFF' : '#525E6E',
                    border: language === item.code ? '1px solid rgba(0, 174, 239, 0.4)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  aria-pressed={language === item.code}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Desktop Quick Quote CTA */}
            <Link
              href="/quote"
              className="btn btn-primary btn-sm desktop-cta"
              style={{ display: 'none' }}
            >
              <span>📝</span>
              <span>{t('btnGetQuote')}</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(11, 31, 51, 0.06)',
                color: '#0B1F33',
                fontSize: '1.2rem',
              }}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            backgroundColor: 'rgba(11, 31, 51, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '85%',
              maxWidth: '340px',
              height: '100%',
              backgroundColor: '#0B1F33',
              color: '#F7F3EA',
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '-8px 0 24px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <Logo customLogoUrl={customLogoUrl} mode="dark" variant="compact" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ color: '#F7F3EA', fontSize: '1.4rem' }}
                >
                  ✕
                </button>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: isActive ? 800 : 500,
                        color: isActive ? '#C9A227' : '#F7F3EA',
                        padding: '8px 0',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Quick Contact within Drawer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/quote" className="btn btn-gold" style={{ width: '100%' }}>
                <span>📝</span>
                <span>{t('btnGetQuote')}</span>
              </Link>
              <a
                href={`https://wa.me/91${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ width: '100%' }}
              >
                <span>💬</span>
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-cta {
            display: inline-flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
