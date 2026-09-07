'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { BusinessInfo } from '@/lib/schema';
import { CropMarks, RegistrationMark, CmykAlignmentDots } from '@/components/common/SvgDecorations';
import { gsap, ScrollTrigger, EASE, isReducedMotion } from '@/animations';

interface OwnerIntroProps {
  business: BusinessInfo;
  onOpenQuoteModal?: () => void;
}

export const OwnerIntro: React.FC<OwnerIntroProps> = ({ business, onOpenQuoteModal }) => {
  const { language, t, getLocalized } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const photoCardRef = useRef<HTMLDivElement>(null);
  const orbLeftRef = useRef<HTMLDivElement>(null);
  const orbRightRef = useRef<HTMLDivElement>(null);

  const ownerName = business.owner || 'Mr. Prakash Devendra Jain';
  const ownerTitle =
    getLocalized(business, 'ownerTitle') ||
    (language === 'mr' ? 'संस्थापक व संचालक' : language === 'hi' ? 'संस्थापक व संचालक' : 'Founder & Proprietor');

  const ownerBio =
    getLocalized(business, 'ownerBio') ||
    (language === 'mr'
      ? '१९९९ मध्ये न्यू चिंतामणी प्रिंटिंग प्रेसची स्थापना केल्यापासून आमचा एकच ध्यास राहिला आहे: लग्नपत्रिका असो, व्हिजिटिंग कार्ड असो की सार्वजनिक फ्लेक्स बॅनर — प्रत्येक काम पूर्ण विश्वासाने, वाजवी दरात आणि वेळेत देणे. श्रीकांत टॉकीज रोडवरील आमचे मुद्रणालय गेल्या २५ वर्षांहून अधिक काळ डोणगाव व परिसरातील जनतेच्या विश्वासास पात्र ठरले आहे.'
      : language === 'hi'
      ? '१९९९ में न्यू चिंतामणी प्रिंटिंग प्रेस की स्थापना के समय से हमारा यही संकल्प रहा है कि हर काम—चाहे शादी के कार्ड हों, विज़िटिंग कार्ड्स या फ्लेक्स बैनर—पूरी ईमानदारी, उचित मूल्य और व्यक्तिगत समर्पण के साथ समय पर पूरा किया जाए। २५ से अधिक वर्षों से डोणगांव और मेहकर की जनता का यह अटूट विश्वास ही हमारी सबसे बड़ी पूँजी है।'
      : 'Since founding New Chintamani Printing Press in 1999, our commitment has always been simple: treat every print job—whether a family wedding invitation, business visiting cards, or local event banners—with utmost care, honest pricing, and personal dedication. For over 25 years, our shop on Shrikant Talkies Road has been a trusted partner to families and businesses across Dongaon, Mehekar, and Buldhana.');

  const photoUrl = business.ownerPhotoUrl || '/assets/owner-prakash-jain.jpg';

  // =========================================================================
  // GSAP ScrollTrigger & Entry Animations
  // =========================================================================
  useEffect(() => {
    if (typeof window === 'undefined' || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // 1. Parallax on Ambient Color Orbs
      if (orbLeftRef.current && orbRightRef.current) {
        gsap.to(orbLeftRef.current, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
        gsap.to(orbRightRef.current, {
          y: 40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      // 2. Master ScrollTrigger Timeline for Founder Section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
      });

      // Photo Card Slide-in & Rotate
      tl.fromTo(
        '.gsap-owner-photo-box',
        {
          opacity: 0,
          x: -55,
          scale: 0.94,
          rotate: -2.5,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          rotate: 0,
          duration: 1.05,
          ease: EASE.paper,
        }
      );

      // Registration Mark 360 Spin & Pop
      tl.fromTo(
        '.gsap-owner-reg-mark',
        {
          opacity: 0,
          scale: 0,
          rotate: -270,
        },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.75,
          ease: 'back.out(1.8)',
        },
        '-=0.7'
      );

      // Experience Badge Bounce
      tl.fromTo(
        '.gsap-owner-exp-badge',
        {
          opacity: 0,
          scale: 0.6,
          y: 15,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.65,
          ease: 'back.out(2)',
        },
        '-=0.5'
      );

      // Owner Name & Contact Buttons
      tl.fromTo(
        '.gsap-owner-identity',
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.4'
      );

      // Section Badge
      tl.fromTo(
        '.gsap-owner-badge',
        {
          opacity: 0,
          y: -18,
          scale: 0.92,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: 'power2.out',
        },
        0.15
      );

      // Main Heading
      tl.fromTo(
        '.gsap-owner-title',
        {
          opacity: 0,
          y: 32,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
        },
        0.25
      );

      // Quote Message Card
      tl.fromTo(
        '.gsap-owner-quote-card',
        {
          opacity: 0,
          x: 35,
          scale: 0.98,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
        },
        0.35
      );

      // Big Decorative Quote Mark
      tl.fromTo(
        '.gsap-owner-quote-mark',
        {
          opacity: 0,
          scale: 1.8,
          rotate: -15,
        },
        {
          opacity: 0.22,
          scale: 1,
          rotate: 0,
          duration: 0.85,
          ease: 'back.out(1.6)',
        },
        0.45
      );

      // 3 Value Pillars Stagger
      tl.fromTo(
        '.gsap-owner-pillar',
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.1,
          ease: 'power2.out',
        },
        0.5
      );

      // Action Buttons & Signature
      tl.fromTo(
        '.gsap-owner-action-bar',
        {
          opacity: 0,
          y: 18,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power2.out',
        },
        0.7
      );

      tl.fromTo(
        '.gsap-owner-signature',
        {
          opacity: 0,
          scale: 0.85,
          x: 20,
        },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 0.75,
          ease: 'back.out(1.5)',
        },
        0.8
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Interactive 3D tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!photoCardRef.current || isReducedMotion()) return;
    const rect = photoCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    gsap.to(photoCardRef.current, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: 'power1.out',
      transformPerspective: 800,
    });
  };

  const handleMouseLeave = () => {
    if (!photoCardRef.current) return;
    gsap.to(photoCardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  };

  return (
    <section
      ref={sectionRef}
      id="founder-vision"
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid rgba(11, 31, 51, 0.08)',
        borderBottom: '1px solid rgba(11, 31, 51, 0.08)',
        paddingTop: '80px',
        paddingBottom: '80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient orbs with subtle parallax */}
      <div
        ref={orbRightRef}
        style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.09) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <div
        ref={orbLeftRef}
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '5%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 174, 239, 0.09) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '48px',
            alignItems: 'center',
          }}
          className="owner-grid"
        >
          {/* Left Column: Owner Profile Photo Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              ref={photoCardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="gsap-owner-photo-box"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '360px',
                aspectRatio: '1 / 1',
                borderRadius: '20px',
                padding: '8px',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 20px 48px rgba(11, 31, 51, 0.12), 0 0 0 1px rgba(245, 158, 11, 0.3)',
                cursor: 'pointer',
                transformStyle: 'preserve-3d',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <CropMarks color="#F59E0B" size={14} opacity={0.7} />

              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#0B1F33',
                }}
              >
                {/* eslint-disable-next-run @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt={ownerName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.04)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />

                {/* Bottom Overlay Label */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(180deg, transparent 0%, rgba(11, 31, 51, 0.85) 100%)',
                    padding: '24px 16px 14px 16px',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    ESTABLISHED 1999 • DONGAON
                  </div>
                </div>
              </div>

              {/* Floating Registration Mark with Spin Animation */}
              <div
                className="gsap-owner-reg-mark"
                style={{
                  position: 'absolute',
                  top: '-14px',
                  right: '-14px',
                  zIndex: 2,
                  filter: 'drop-shadow(0 4px 8px rgba(0, 174, 239, 0.35))',
                }}
              >
                <RegistrationMark size={34} color="#00AEEF" />
              </div>

              {/* Floating 25+ Years Experience Badge */}
              <div
                className="gsap-owner-exp-badge"
                style={{
                  position: 'absolute',
                  bottom: '-16px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#0B1F33',
                  color: '#FFFFFF',
                  padding: '6px 18px',
                  borderRadius: 'var(--radius-full)',
                  border: '1.5px solid #F59E0B',
                  boxShadow: '0 8px 22px rgba(11, 31, 51, 0.28)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  zIndex: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ color: '#FBBF24' }}>★</span>
                <span>25+ Years Experience</span>
              </div>
            </div>

            {/* Owner Name & Direct Contact Below Photo */}
            <div className="gsap-owner-identity" style={{ marginTop: '32px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0B1F33', marginBottom: '4px' }}>
                {ownerName}
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#D97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
                {ownerTitle}
              </p>

              {/* Quick Direct Owner Reach Buttons */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <a
                  href={`https://wa.me/91${business.whatsapp}?text=${encodeURIComponent(`Namaskar Mr. Prakash Jain, I am contacting you through the New Chintamani Printing Press website.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-sm"
                  style={{ fontSize: '0.8rem', padding: '8px 16px', transition: 'transform 0.2s ease' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>💬</span>
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${business.phone1}`}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.8rem', padding: '8px 16px', border: '1px solid rgba(11,31,51,0.18)', transition: 'transform 0.2s ease' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>📞</span>
                  <span>Direct Call</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Founder's Story & Personal Message */}
          <div>
            {/* Section Badge */}
            <div
              className="section-badge gsap-owner-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(0, 174, 239, 0.1) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
              }}
            >
              <span>{language === 'mr' ? 'संस्थापकांचे मनोगत' : language === 'hi' ? 'संस्थापक का संदेश' : 'Founder’s Vision'}</span>
              <CmykAlignmentDots size={5} />
            </div>

            <h2
              className="gsap-owner-title"
              style={{
                fontFamily: language === 'en' ? "'Plus Jakarta Sans', sans-serif" : "'Noto Sans Devanagari', sans-serif",
                fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
                fontWeight: 900,
                color: '#0B1F33',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                marginBottom: '20px',
              }}
            >
              {language === 'mr' ? (
                <>
                  प्रत्येक छपाईत <span className="gradient-text-cmyk">अखंड विश्वास व दर्जा</span> जपणे हीच आमची परंपरा.
                </>
              ) : language === 'hi' ? (
                <>
                  हर मुद्रण कार्य में <span className="gradient-text-cmyk">अखंड विश्वास और गुणवत्ता</span> ही हमारी पहचान.
                </>
              ) : (
                <>
                  Crafting Every Print with <span className="gradient-text-cmyk">Personal Care &amp; Trust</span> Since 1999.
                </>
              )}
            </h2>

            {/* Quotation Message */}
            <div
              className="gsap-owner-quote-card"
              style={{
                position: 'relative',
                backgroundColor: '#FDFBF7',
                borderLeft: '4px solid #F59E0B',
                borderRadius: '0 14px 14px 0',
                padding: '24px 28px',
                marginBottom: '28px',
                boxShadow: '0 6px 20px rgba(11, 31, 51, 0.05)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(245, 158, 11, 0.12)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(11, 31, 51, 0.05)';
              }}
            >
              <div
                className="gsap-owner-quote-mark"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '18px',
                  fontSize: '3.4rem',
                  lineHeight: 1,
                  fontFamily: 'serif',
                  color: '#F59E0B',
                  opacity: 0.22,
                  userSelect: 'none',
                }}
              >
                “
              </div>

              <p
                style={{
                  fontSize: '1.02rem',
                  lineHeight: 1.75,
                  color: '#1E252D',
                  fontStyle: 'normal',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {ownerBio}
              </p>
            </div>

            {/* 3 Core Craftsman Commitments with Stagger Reveal */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '32px',
              }}
            >
              <div className="gsap-owner-pillar" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem', padding: '6px', backgroundColor: 'rgba(37, 99, 235, 0.08)', borderRadius: '8px' }}>🤝</span>
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0B1F33', marginBottom: '2px' }}>
                    Personal Consultation
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#525E6E', lineHeight: 1.4 }}>
                    Direct design &amp; paper guidance for your wedding or business.
                  </p>
                </div>
              </div>

              <div className="gsap-owner-pillar" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem', padding: '6px', backgroundColor: 'rgba(217, 119, 6, 0.08)', borderRadius: '8px' }}>💰</span>
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0B1F33', marginBottom: '2px' }}>
                    Honest Local Rates
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#525E6E', lineHeight: 1.4 }}>
                    Transparent pricing tailored to support our local community.
                  </p>
                </div>
              </div>

              <div className="gsap-owner-pillar" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem', padding: '6px', backgroundColor: 'rgba(5, 150, 105, 0.08)', borderRadius: '8px' }}>📍</span>
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0B1F33', marginBottom: '2px' }}>
                    Shop in Dongaon
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#525E6E', lineHeight: 1.4 }}>
                    On Shrikant Talkies Road, 2-minute walk from Bus Stand.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Bar & Founder Signature */}
            <div className="gsap-owner-action-bar" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
              {onOpenQuoteModal && (
                <button
                  type="button"
                  onClick={() => onOpenQuoteModal()}
                  className="btn btn-primary"
                  style={{ transition: 'transform 0.2s ease' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>📝</span>
                  <span>{t('btnGetQuote')}</span>
                </button>
              )}

              <Link
                href="/about"
                className="btn btn-secondary"
                style={{ transition: 'transform 0.2s ease' }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>{t('navAbout')}</span>
                <span>→</span>
              </Link>

              <div className="gsap-owner-signature" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: '1.15rem', fontWeight: 800, color: '#0B1F33' }}>
                    Prakash D. Jain
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#788596', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Founder • Est. 1999
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 900px) {
          .owner-grid {
            grid-template-columns: 0.82fr 1.18fr !important;
          }
        }
      `}</style>
    </section>
  );
};
