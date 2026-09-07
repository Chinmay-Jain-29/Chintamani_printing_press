'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Logo } from '@/components/logo/Logo';
import { BusinessInfo, SocialLinks } from '@/lib/schema';
import { RegistrationMark, CmykAlignmentDots } from '@/components/common/SvgDecorations';

interface FooterProps {
  business?: BusinessInfo;
  businessInfo?: BusinessInfo;
  socialLinks?: SocialLinks;
}

export const Footer: React.FC<FooterProps> = ({ business: propBusiness, businessInfo, socialLinks }) => {
  const { language, setLanguage, t, getLocalized } = useLanguage();

  const defaultBusiness: BusinessInfo = {
    name: 'NEW CHINTAMANI PRINTING PRESS',
    owner: 'Mr. Prakash Devendra Jain',
    tagline_en: 'Printing • Designing • Quality • Trust',
    tagline_mr: 'मुद्रण • डिझायनिंग • दर्जा • विश्वास',
    tagline_hi: 'मुद्रण • डिज़ाइनिंग • गुणवत्ता • विश्वास',
    address: 'Shrikant Talkies Road, Bus Stand',
    taluka: 'At. Dongaon, Tq. Mehekar',
    district: 'Dist. Buldhana',
    state: 'Maharashtra',
    pincode: '443303',
    phone1: '9421396905',
    phone2: '9834853851',
    whatsapp: '9421396905',
    email: 'chintamanidongaon@gmail.com',
    businessHours_en: '8:00 AM – 8:30 PM (All days)',
    businessHours_mr: 'सकाळी ८:०० ते रात्री ८:३० (सर्व दिवस)',
    businessHours_hi: 'सुबह ८:०० से रात ८:३० (सभी दिन)',
    establishedYear: 1999,
    googleMapsUrl: 'https://maps.google.com/?q=Dongaon+Maharashtra',
  };

  const business = propBusiness || businessInfo || defaultBusiness;

  const servicesLinks = [
    { href: '/services', label: 'Visiting Cards & Business Stationery' },
    { href: '/services', label: 'Wedding Invitation Cards (लग्नपत्रिका)' },
    { href: '/services', label: 'Flex Banners & Event Hoardings' },
    { href: '/services', label: 'Brochures, Pamphlets & Flyers' },
    { href: '/services', label: 'Numbered Bill Books & Cash Memos' },
    { href: '/services', label: 'Non-Woven Fabric Carry Bags' },
    { href: '/services', label: 'Color Xerox, Lamination & Binding' },
  ];

  return (
    <footer
      style={{
        backgroundColor: '#0B1F33',
        color: '#F7F3EA',
        borderTop: '1px solid rgba(201, 162, 39, 0.3)',
        paddingTop: '64px',
        paddingBottom: '36px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Registration Marks */}
      <div style={{ position: 'absolute', top: '24px', right: '32px', opacity: 0.2 }}>
        <RegistrationMark size={48} color="#C9A227" />
      </div>

      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Column 1: Brand & Craftsmanship */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Logo mode="dark" variant="full" />
            </div>
            <p
              style={{
                fontSize: '0.88rem',
                lineHeight: 1.65,
                color: '#A8B8C9',
                marginBottom: '20px',
              }}
            >
              Serving Dongaon, Mehekar, and Buldhana district with high-precision offset printing, digital printing, and creative designing since 1999.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', color: '#C9A227', fontWeight: 700 }}>PROCESS REGISTRATION:</span>
              <CmykAlignmentDots size={6} />
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: '#C9A227',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '18px',
              }}
            >
              {t('footerQuickLinks')}
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Home', 'About Us', 'Services', 'Our Work', 'Reviews', 'Get a Quote', 'Contact'].map((item) => {
                const href = item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '')}`;
                return (
                  <li key={item}>
                    <Link
                      href={href}
                      style={{
                        fontSize: '0.88rem',
                        color: '#A8B8C9',
                        transition: 'color var(--transition-fast)',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.color = '#C9A227')}
                      onMouseOut={(e) => (e.currentTarget.style.color = '#A8B8C9')}
                    >
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Printing Services */}
          <div>
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: '#C9A227',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '18px',
              }}
            >
              {t('footerServices')}
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {servicesLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    style={{
                      fontSize: '0.85rem',
                      color: '#A8B8C9',
                      transition: 'color var(--transition-fast)',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = '#C9A227')}
                    onMouseOut={(e) => (e.currentTarget.style.color = '#A8B8C9')}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Verified Shop Contact */}
          <div>
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: '#C9A227',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '18px',
              }}
            >
              {t('footerContact')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: '#A8B8C9' }}>
              <div>
                <strong style={{ color: '#F7F3EA', display: 'block' }}>Address:</strong>
                {business.address}, {business.taluka}, {business.district} – {business.pincode}
              </div>
              <div>
                <strong style={{ color: '#F7F3EA', display: 'block' }}>Proprietor:</strong>
                {business.owner}
              </div>
              <div>
                <strong style={{ color: '#F7F3EA', display: 'block' }}>Phone &amp; Inquiries:</strong>
                <a href={`tel:${business.phone1}`} style={{ color: '#C9A227', fontWeight: 700 }}>
                  {business.phone1}
                </a>{' '}
                / {business.phone2}
              </div>
              <div>
                <strong style={{ color: '#F7F3EA', display: 'block' }}>WhatsApp:</strong>
                <a href={`https://wa.me/91${business.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontWeight: 700 }}>
                  +91 {business.whatsapp}
                </a>
              </div>
              <div>
                <strong style={{ color: '#F7F3EA', display: 'block' }}>Working Hours:</strong>
                {getLocalized(business, 'businessHours')}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright & Language Selector */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            fontSize: '0.82rem',
            color: '#788596',
          }}
        >
          <div>
            © {new Date().getFullYear()} <strong>NEW CHINTAMANI PRINTING PRESS</strong>. All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Languages:</span>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              style={{ color: language === 'en' ? '#C9A227' : '#788596', fontWeight: language === 'en' ? 800 : 500 }}
            >
              English
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setLanguage('mr')}
              style={{ color: language === 'mr' ? '#C9A227' : '#788596', fontWeight: language === 'mr' ? 800 : 500 }}
            >
              मराठी
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              style={{ color: language === 'hi' ? '#C9A227' : '#788596', fontWeight: language === 'hi' ? 800 : 500 }}
            >
              हिंदी
            </button>
            <span>•</span>
            <Link href="/admin" style={{ color: '#788596', textDecoration: 'underline' }}>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
