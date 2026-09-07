'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { HeroSection as HeroType, BusinessInfo } from '@/lib/schema';
import { playHeroEntrance } from '@/animations/heroAnimation';
import { gsap } from '@/animations';
import { CropMarks, RegistrationMark, CmykAlignmentDots } from '@/components/common/SvgDecorations';

interface HeroProps {
  hero: HeroType;
  business: BusinessInfo;
  onOpenQuoteModal: (serviceName?: string) => void;
  triggerAnimation?: boolean;
}

export const HeroSection: React.FC<HeroProps> = ({
  hero,
  business,
  onOpenQuoteModal,
  triggerAnimation = true,
}) => {
  const { language, t, getLocalized } = useLanguage();

  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cta1Ref = useRef<HTMLButtonElement>(null);
  const cta2Ref = useRef<HTMLAnchorElement>(null);
  const cta3Ref = useRef<HTMLAnchorElement>(null);
  const trustPillsRef = useRef<HTMLDivElement>(null);

  const visualRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const goldSealRef = useRef<HTMLDivElement>(null);

  const badge = getLocalized(hero, 'badge');
  const subtitle = getLocalized(hero, 'subtitle');
  const primaryCtaText = getLocalized(hero, 'primaryCtaText');
  const secondaryCtaText = getLocalized(hero, 'secondaryCtaText');

  // =========================================================================
  // GSAP Entrance & Continuous Floating Orchestration
  // =========================================================================
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      if (
        badgeRef.current &&
        headlineRef.current &&
        subtitleRef.current &&
        cta1Ref.current &&
        cta2Ref.current &&
        cta3Ref.current &&
        trustPillsRef.current &&
        layer1Ref.current &&
        layer2Ref.current &&
        layer3Ref.current &&
        goldSealRef.current
      ) {
        // Entrance animation
        const entranceTl = playHeroEntrance({
          badge: badgeRef.current,
          headline: headlineRef.current,
          subtitle: subtitleRef.current,
          ctaButtons: [cta1Ref.current, cta2Ref.current, cta3Ref.current],
          trustPills: trustPillsRef.current,
          visualLayers: [layer1Ref.current, layer2Ref.current, layer3Ref.current],
          goldSeal: goldSealRef.current,
        });

        // Start continuous organic floating once entrance settles
        entranceTl.then(() => {
          // Layer 1: Main Workshop Image gentle floating
          gsap.to(layer1Ref.current, {
            y: -7,
            duration: 3.8,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });

          // Layer 2: Wedding Card float & gentle tilt bob
          gsap.to(layer2Ref.current, {
            y: -12,
            rotation: -3,
            duration: 4.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });

          // Layer 3: Visiting Cards Stack counter-float
          gsap.to(layer3Ref.current, {
            y: 10,
            rotation: 6,
            duration: 4.6,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });

          // Layer 4: Since 1999 Gold Seal float & pulse
          gsap.to(goldSealRef.current, {
            y: -6,
            scale: 1.05,
            duration: 3.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        });
      }
    });

    // Interactive desktop pointer parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (!visualRef.current || window.innerWidth < 900) return;
      const rect = visualRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      gsap.to(layer1Ref.current, { x: x * 8, y: y * 8, duration: 0.8, ease: 'power1.out' });
      gsap.to(layer2Ref.current, { x: x * -14, y: y * -14, duration: 0.9, ease: 'power1.out' });
      gsap.to(layer3Ref.current, { x: x * 16, y: y * 16, duration: 0.9, ease: 'power1.out' });
      gsap.to(goldSealRef.current, { x: x * -10, y: y * -10, duration: 0.7, ease: 'power1.out' });
    };

    const sectionEl = sectionRef.current;
    if (sectionEl) {
      sectionEl.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      ctx.revert();
      if (sectionEl) {
        sectionEl.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [triggerAnimation]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        backgroundColor: '#F7F3EA',
        paddingTop: '48px',
        paddingBottom: '84px',
        overflow: 'hidden',
      }}
    >
      {/* Colorful Ambient Glowing Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 174, 239, 0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 0, 140, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '30%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Background Registration Crosshairs */}
      <div style={{ position: 'absolute', top: '16px', right: '40px', opacity: 0.6 }}>
        <RegistrationMark size={36} color="#00AEEF" />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '48px',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* Left Column: Typography & CTAs */}
          <div style={{ maxWidth: '640px' }}>
            {/* Eyebrow Badge with Colorful Spectrum */}
            <div
              ref={badgeRef}
              className="section-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
                background: 'linear-gradient(135deg, rgba(0, 174, 239, 0.1) 0%, rgba(236, 0, 140, 0.1) 50%, rgba(245, 158, 11, 0.1) 100%)',
                border: '1px solid rgba(236, 0, 140, 0.3)',
                boxShadow: '0 4px 14px rgba(236, 0, 140, 0.15)',
              }}
            >
              <span style={{ color: '#0B1F33', fontWeight: 800 }}>{badge}</span>
              <CmykAlignmentDots size={6} />
            </div>

            {/* Main Headline with Colorful Highlight */}
            <h1
              ref={headlineRef}
              style={{
                fontFamily: language === 'en' ? "'Plus Jakarta Sans', sans-serif" : "'Noto Sans Devanagari', sans-serif",
                fontSize: 'clamp(2.2rem, 4.6vw, 3.6rem)',
                lineHeight: 1.15,
                fontWeight: 900,
                color: '#0B1F33',
                letterSpacing: '-0.025em',
                marginBottom: '22px',
              }}
            >
              {language === 'mr' ? (
                <>
                  उत्कृष्ट मुद्रण.{' '}
                  <span className="gradient-text-cmyk">१९९९ पासून विश्वासार्ह सेवा</span>{' '}
                  आणि आधुनिक डिझायनिंग.
                </>
              ) : language === 'hi' ? (
                <>
                  उत्कृष्ट मुद्रण.{' '}
                  <span className="gradient-text-cmyk">१९९९ से भरोसेमंद सेवा</span>{' '}
                  और आधुनिक डिज़ाइनिंग.
                </>
              ) : (
                <>
                  Quality Printing.{' '}
                  <span className="gradient-text-cmyk">Trusted Craftsmanship</span>{' '}
                  Since 1999.
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              style={{
                fontSize: 'clamp(1rem, 1.8vw, 1.16rem)',
                lineHeight: 1.65,
                color: '#475569',
                marginBottom: '32px',
              }}
            >
              {subtitle}
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '36px',
              }}
            >
              <button
                ref={cta1Ref}
                type="button"
                onClick={() => onOpenQuoteModal()}
                className="btn btn-primary btn-lg"
              >
                <span>📝</span>
                <span>{primaryCtaText}</span>
              </button>

              <a
                ref={cta2Ref}
                href={`https://wa.me/91${business.whatsapp}?text=${encodeURIComponent('Namaskar, I would like to inquire about printing services at New Chintamani Printing Press.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
              >
                <span>💬</span>
                <span>{secondaryCtaText}</span>
              </a>

              <a
                ref={cta3Ref}
                href={`tel:${business.phone1}`}
                className="btn btn-secondary btn-lg"
              >
                <span>📞</span>
                <span>{t('btnCallNow')}</span>
              </a>
            </div>

            {/* Trust Pill Highlights with Colorful Jewel Checkmarks */}
            <div
              ref={trustPillsRef}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '18px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(11, 31, 51, 0.1)',
                fontSize: '0.86rem',
                color: '#475569',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.15)', color: '#2563EB', fontWeight: 900, fontSize: '0.75rem' }}>✓</span>
                <span style={{ color: '#1E252D', fontWeight: 700 }}>Est. 1999 • Dongaon</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(236, 0, 140, 0.15)', color: '#EC008C', fontWeight: 900, fontSize: '0.75rem' }}>✓</span>
                <span style={{ color: '#1E252D', fontWeight: 700 }}>In-House Offset &amp; Digital</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontWeight: 900, fontSize: '0.75rem' }}>✓</span>
                <span style={{ color: '#1E252D', fontWeight: 700 }}>Serving Mehekar &amp; Buldhana</span>
              </div>
            </div>
          </div>

          {/* Right Column: Art-Directed Layered Craftsman Visual (Fully Visible & Floating on Mobile and Desktop) */}
          <div
            ref={visualRef}
            className="hero-visual-container"
          >
            {/* Layer 1: Workshop Craftsmanship Sheet */}
            <div
              ref={layer1Ref}
              className="hero-layer-main"
            >
              <CropMarks color="#C9A227" size={12} opacity={0.5} />
              {/* eslint-disable-next-run @next/next/no-img-element */}
              <img
                src="/assets/hero-printing-showcase.jpg"
                alt="New Chintamani Printing Press Workshop"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 55%, rgba(11, 31, 51, 0.65) 100%)',
                }}
              />
              <div
                className="workshop-badge-text"
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '20px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                }}
              >
                In-House Printing &amp; Designing Studio • Dongaon
              </div>
            </div>

            {/* Layer 2: Royal Gold Foil Wedding Card Specimen (Fully Visible & Floating on Mobile) */}
            <div
              ref={layer2Ref}
              className="hero-layer-wedding"
            >
              {/* eslint-disable-next-run @next/next/no-img-element */}
              <img
                src="/assets/portfolio/wedding-card-sample-1.jpg"
                alt="Royal Gold Foil Wedding Card"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                className="wedding-badge-label"
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(11, 31, 51, 0.9)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  color: '#C9A227',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textAlign: 'center',
                }}
              >
                Royal Wedding Cards
              </div>
            </div>

            {/* Layer 3: Velvet Matte Visiting Cards Stack (Fully Visible & Floating on Mobile) */}
            <div
              ref={layer3Ref}
              className="hero-layer-cards"
            >
              {/* eslint-disable-next-run @next/next/no-img-element */}
              <img
                src="/assets/portfolio/visiting-card-sample-1.svg"
                alt="Visiting Cards Stack"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Layer 4: Warm Gold Heritage Seal */}
            <div
              ref={goldSealRef}
              className="hero-layer-seal"
            >
              <span className="seal-since" style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                SINCE
              </span>
              <span className="seal-year" style={{ fontSize: '1.2rem', fontWeight: 900 }}>
                1999
              </span>
              <span className="seal-trust" style={{ fontSize: '0.52rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                TRUST
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Hero Visual Desktop Layout */
        .hero-visual-container {
          position: relative;
          width: 100%;
          max-width: 480px;
          min-height: 440px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-layer-main {
          position: relative;
          width: 100%;
          max-width: 460px;
          aspect-ratio: 4 / 3;
          background-color: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(11, 31, 51, 0.1);
          box-shadow: 0 24px 48px rgba(11, 31, 51, 0.12), 0 2px 6px rgba(11, 31, 51, 0.04);
          overflow: hidden;
        }

        .hero-layer-wedding {
          position: absolute;
          top: -20px;
          left: -16px;
          width: 200px;
          aspect-ratio: 3 / 4;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 18px 36px rgba(11, 31, 51, 0.2), 0 0 0 1.5px rgba(201, 162, 39, 0.35);
          transform: rotate(-5deg);
          background-color: #ffffff;
          z-index: 2;
        }

        .hero-layer-cards {
          position: absolute;
          bottom: -24px;
          right: -10px;
          width: 195px;
          aspect-ratio: 16 / 10;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 18px 36px rgba(11, 31, 51, 0.22), 0 0 0 1px rgba(201, 162, 39, 0.25);
          transform: rotate(4deg);
          background-color: #0b1f33;
          z-index: 3;
        }

        .hero-layer-seal {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: radial-gradient(circle, #e0ba3f 0%, #c9a227 100%);
          border: 3px solid #0b1f33;
          box-shadow: 0 10px 24px rgba(201, 162, 39, 0.45);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #0b1f33;
          text-align: center;
          z-index: 4;
          line-height: 1.1;
        }

        /* Continuous Hardware-Accelerated Floating CSS Animations (Fallback & Enhancement) */
        @media (prefers-reduced-motion: no-preference) {
          .hero-layer-main {
            animation: heroFloatMain 4s ease-in-out infinite alternate;
          }
          .hero-layer-wedding {
            animation: heroFloatWedding 4.4s ease-in-out infinite alternate;
          }
          .hero-layer-cards {
            animation: heroFloatCards 4.8s ease-in-out infinite alternate;
          }
          .hero-layer-seal {
            animation: heroFloatSeal 3.4s ease-in-out infinite alternate;
          }
        }

        @keyframes heroFloatMain {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(-8px);
          }
        }

        @keyframes heroFloatWedding {
          0% {
            transform: translateY(0px) rotate(-5deg);
          }
          100% {
            transform: translateY(-14px) rotate(-2.8deg);
          }
        }

        @keyframes heroFloatCards {
          0% {
            transform: translateY(0px) rotate(4deg);
          }
          100% {
            transform: translateY(11px) rotate(6.2deg);
          }
        }

        @keyframes heroFloatSeal {
          0% {
            transform: translateY(0px) scale(1);
          }
          100% {
            transform: translateY(-6px) scale(1.04);
          }
        }

        /* Mobile Phone Responsiveness: 100% Visible & Proportional */
        @media (max-width: 640px) {
          .hero-visual-container {
            width: 100%;
            max-width: 350px;
            min-height: 320px;
            margin: 0 auto;
            padding: 18px 8px;
          }

          .hero-layer-main {
            width: 86%;
            max-width: 290px;
            margin: 0 auto;
            border-radius: 14px;
          }

          .workshop-badge-text {
            font-size: 0.72rem !important;
            bottom: 10px !important;
            left: 12px !important;
          }

          .hero-layer-wedding {
            display: block !important;
            width: 44%;
            max-width: 135px;
            top: -6px;
            left: 2px;
            border-radius: 8px;
            box-shadow: 0 12px 24px rgba(11, 31, 51, 0.22), 0 0 0 1px rgba(201, 162, 39, 0.35);
          }

          .wedding-badge-label {
            font-size: 0.6rem !important;
            padding: 2px 4px !important;
            bottom: 4px !important;
            left: 4px !important;
            right: 4px !important;
          }

          .hero-layer-cards {
            display: block !important;
            width: 48%;
            max-width: 145px;
            bottom: -14px;
            right: 2px;
            border-radius: 8px;
            box-shadow: 0 12px 24px rgba(11, 31, 51, 0.24), 0 0 0 1px rgba(201, 162, 39, 0.25);
          }

          .hero-layer-seal {
            width: 56px;
            height: 56px;
            top: 4px;
            right: 4px;
            border-width: 2px;
          }

          .seal-since {
            font-size: 0.5rem !important;
          }
          .seal-year {
            font-size: 0.95rem !important;
          }
          .seal-trust {
            font-size: 0.44rem !important;
          }
        }
      `}</style>
    </section>
  );
};
