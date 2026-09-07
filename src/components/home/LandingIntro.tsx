'use client';

import React, { useEffect, useRef, useState } from 'react';
import { playCinematicIntro } from '@/animations/introAnimation';
import { isReducedMotion } from '@/animations';
import { RegistrationMark, CropMarks } from '@/components/common/SvgDecorations';

interface LandingIntroProps {
  onComplete: () => void;
}

export const LandingIntro: React.FC<LandingIntroProps> = ({ onComplete }) => {
  // Immediate visual intro shell: visible starts as true on both SSR and client
  // so the opening shell is rendered immediately on frame 0 with zero hydration mismatch.
  const [visible, setVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const paperSheetRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const brandPart1Ref = useRef<HTMLHeadingElement>(null);
  const brandPart2Ref = useRef<HTMLHeadingElement>(null);
  const heritageTagRef = useRef<HTMLDivElement>(null);
  const goldLineRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  const cropMarkRefs = useRef<HTMLDivElement[]>([]);
  const svgMarkRefs = useRef<HTMLDivElement[]>([]);

  const animationTlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (isReducedMotion()) {
      window.scrollTo(0, 0);
      setVisible(false);
      onComplete();
      return;
    }

    const seen = sessionStorage.getItem('ncpp_intro_seen');
    if (seen === 'true') {
      window.scrollTo(0, 0);
      setVisible(false);
      onComplete();
      return;
    }

    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    // Start cinematic GSAP intro immediately as the shell is mounted
    const timer = setTimeout(() => {
      if (
        containerRef.current &&
        paperSheetRef.current &&
        logoWrapRef.current &&
        brandPart1Ref.current &&
        brandPart2Ref.current &&
        heritageTagRef.current &&
        goldLineRef.current &&
        taglineRef.current
      ) {
        animationTlRef.current = playCinematicIntro(
          {
            container: containerRef.current,
            paperSheet: paperSheetRef.current,
            cropMarks: cropMarkRefs.current.filter(Boolean),
            svgMarks: svgMarkRefs.current.filter(Boolean),
            logoWrap: logoWrapRef.current,
            brandPart1: brandPart1Ref.current,
            brandPart2: brandPart2Ref.current,
            heritageTag: heritageTagRef.current,
            goldLine: goldLineRef.current,
            tagline: taglineRef.current,
          },
          () => {
            sessionStorage.setItem('ncpp_intro_seen', 'true');
            document.body.style.overflow = '';
            window.scrollTo(0, 0);
            setVisible(false);
            onComplete();
          }
        );
      }
    }, 10);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      if (animationTlRef.current) {
        animationTlRef.current.kill();
      }
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (animationTlRef.current) {
      animationTlRef.current.kill();
    }
    sessionStorage.setItem('ncpp_intro_seen', 'true');
    document.body.style.overflow = '';
    window.scrollTo(0, 0);
    setVisible(false);
    onComplete();
  };

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#F7F3EA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* Background SVG Registration Guides in Corners */}
      <div
        ref={(el) => { if (el) svgMarkRefs.current[0] = el; }}
        style={{ position: 'absolute', top: '24px', left: '24px' }}
      >
        <RegistrationMark size={32} color="#C9A227" />
      </div>
      <div
        ref={(el) => { if (el) svgMarkRefs.current[1] = el; }}
        style={{ position: 'absolute', top: '24px', right: '120px' }}
      >
        <RegistrationMark size={32} color="#0B1F33" />
      </div>
      <div
        ref={(el) => { if (el) svgMarkRefs.current[2] = el; }}
        style={{ position: 'absolute', bottom: '24px', left: '24px' }}
      >
        <RegistrationMark size={32} color="#0B1F33" />
      </div>
      <div
        ref={(el) => { if (el) svgMarkRefs.current[3] = el; }}
        style={{ position: 'absolute', bottom: '24px', right: '24px' }}
      >
        <RegistrationMark size={32} color="#C9A227" />
      </div>

      {/* Skip Intro Button */}
      <button
        type="button"
        onClick={handleSkip}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          zIndex: 10,
          background: '#0B1F33',
          border: '1px solid #C9A227',
          color: '#F7F3EA',
          padding: '8px 18px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(11, 31, 51, 0.15)',
          transition: 'all 0.2s ease',
        }}
      >
        Skip Intro ✕
      </button>

      {/* Central Printing Paper Layer */}
      <div
        ref={paperSheetRef}
        style={{
          width: '90%',
          maxWidth: '560px',
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          padding: '48px 36px',
          boxShadow: '0 24px 60px rgba(11, 31, 51, 0.12), 0 0 0 1px rgba(201, 162, 39, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          opacity: 0,
        }}
      >
        <CropMarks color="#C9A227" size={14} opacity={0.7} />

        {/* Scene 4: Logo Monogram Seal */}
        <div
          ref={logoWrapRef}
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0B1F33 0%, #153454 100%)',
            border: '2px solid #C9A227',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 8px 24px rgba(201, 162, 39, 0.3)',
          }}
        >
          <span style={{ color: '#F7F3EA', fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.02em' }}>
            CP
          </span>
        </div>

        {/* Scene 5: Brand Typography */}
        <h1
          ref={brandPart1Ref}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(1.6rem, 3.8vw, 2.3rem)',
            fontWeight: 900,
            color: '#0B1F33',
            lineHeight: 1.1,
            margin: '0 0 6px 0',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
          }}
        >
          NEW CHINTAMANI
        </h1>

        <h2
          ref={brandPart2Ref}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(1.2rem, 2.8vw, 1.6rem)',
            fontWeight: 800,
            color: '#C9A227',
            lineHeight: 1.1,
            margin: '0 0 14px 0',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          PRINTING PRESS
        </h2>

        <div
          ref={heritageTagRef}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '0.14em',
            color: '#525E6E',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          <span>EST. 1999</span>
          <span style={{ color: '#C9A227' }}>•</span>
          <span>DONGAON</span>
        </div>

        {/* Scene 6: Gold Registration Line Pass */}
        <div
          ref={goldLineRef}
          style={{
            width: '100%',
            maxWidth: '280px',
            height: '2px',
            background: 'linear-gradient(90deg, #C9A227 0%, #0B1F33 50%, #C9A227 100%)',
            marginBottom: '16px',
          }}
        />

        <p
          ref={taglineRef}
          style={{
            margin: 0,
            fontSize: '0.88rem',
            fontWeight: 700,
            color: '#20252B',
            letterSpacing: '0.04em',
          }}
        >
          Printing • Designing • Quality • Trust
        </p>
      </div>
    </div>
  );
};
