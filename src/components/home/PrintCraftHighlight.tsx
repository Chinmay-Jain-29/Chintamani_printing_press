'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { CropMarks, RegistrationMark, CmykAlignmentDots } from '@/components/common/SvgDecorations';

export const PrintCraftHighlight: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section
      style={{
        backgroundColor: '#0B1F33',
        color: '#F7F3EA',
        paddingTop: '84px',
        paddingBottom: '84px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Glowing Ambient Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '10%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 174, 239, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 0, 140, 0.14) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'absolute', top: '24px', left: '24px', opacity: 0.4 }}>
        <RegistrationMark size={36} color="#00AEEF" />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '40px',
            alignItems: 'center',
          }}
          className="highlight-grid"
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(0, 174, 239, 0.15)',
                color: '#38BDF8',
                border: '1px solid rgba(0, 174, 239, 0.4)',
                fontSize: '0.82rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '16px',
              }}
            >
              <span>{language === 'mr' ? 'सुसज्ज मुद्रणालय • डोणगाव' : language === 'hi' ? 'सुसज्जित मुद्रणालय • डोणगांव' : 'In-House Precision • Dongaon'}</span>
              <CmykAlignmentDots size={5} />
            </div>

            <h2
              style={{
                fontFamily: language === 'en' ? "'Plus Jakarta Sans', sans-serif" : "'Noto Sans Devanagari', sans-serif",
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                fontWeight: 900,
                lineHeight: 1.25,
                color: '#FFFFFF',
                marginBottom: '18px',
                letterSpacing: '-0.02em',
              }}
            >
              {language === 'mr' ? (
                <>
                  मुद्रण व डिझायनिंग —{' '}
                  <span className="gradient-text-cmyk">दोन्ही सेवा एकाच छताखाली</span>
                </>
              ) : language === 'hi' ? (
                <>
                  मुद्रण और डिज़ाइनिंग —{' '}
                  <span className="gradient-text-cmyk">दोनों सेवाएं एक ही स्थान पर</span>
                </>
              ) : (
                <>
                  Complete Printing &amp; Designing —{' '}
                  <span className="gradient-text-cmyk">All Under One Roof</span>
                </>
              )}
            </h2>

            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.7,
                color: '#A8B8C9',
                marginBottom: '28px',
              }}
            >
              {language === 'mr'
                ? 'लग्नपत्रिका, व्हिजिटिंग कार्ड्स, पावती पुस्तके किंवा जाहिरात फ्लेक्स — तुम्हाला वेगळे डिझायनर शोधण्याची आवश्यकता नाही. आमच्याकडे मराठी, हिंदी व इंग्रजी डीटीपी, सुबक फॉन्ट मांडणी आणि आधुनिक ऑफसेट व डिजिटल तंत्रज्ञानाद्वारे वेळेत उत्कृष्ट काम मिळते.'
                : language === 'hi'
                ? 'शादी के कार्ड, विज़िटिंग कार्ड्स, बिल बुक्स या फ्लेक्स बैनर — आपको अलग से डिज़ाइनर की आवश्यकता नहीं है। हमारे पास मराठी, हिंदी और अंग्रेजी डीटीपी, सुंदर फॉन्ट्स और आधुनिक प्रिंटिंग तकनीक द्वारा समय पर उत्कृष्ट काम मिलता है।'
                : 'Whether you need wedding invitations, corporate letterheads, numbered bill books, or outdoor flex hoardings — there is no need to coordinate between outside graphic designers and printers. Our in-house setup handles typesetting in Marathi, Hindi & English, color proofs, and flawless print delivery.'}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
              <Link href="/services" className="btn btn-gold btn-lg">
                <span>{t('btnViewAllServices')}</span>
              </Link>
              <Link href="/about" className="btn btn-secondary btn-lg" style={{ backgroundColor: 'transparent', color: '#F7F3EA', borderColor: 'rgba(247, 243, 234, 0.3)' }}>
                <span>{t('navAbout')}</span>
              </Link>
            </div>
          </div>

          {/* Highlights Box with Vibrant Color Checkmarks */}
          <div
            style={{
              backgroundColor: '#122B45',
              borderRadius: 'var(--radius-xl)',
              padding: '36px',
              border: '1px solid rgba(0, 174, 239, 0.3)',
              boxShadow: '0 20px 48px rgba(0,0,0,0.4), 0 0 24px rgba(0, 174, 239, 0.1)',
              position: 'relative',
            }}
          >
            <CropMarks color="#00AEEF" size={14} opacity={0.7} />

            <h3 style={{ fontSize: '1.24rem', fontWeight: 800, color: '#FBBF24', marginBottom: '22px' }}>
              Why In-House Setup Matters:
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', gap: '14px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'rgba(0, 174, 239, 0.2)', color: '#38BDF8', fontSize: '0.9rem', fontWeight: 900, flexShrink: 0 }}>✓</span>
                <div>
                  <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                    Zero Communication Delay
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: '#A8B8C9', lineHeight: 1.5 }}>
                    Proofing and corrections are made on the spot without back-and-forth delays with external agencies.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'rgba(236, 0, 140, 0.2)', color: '#F43F5E', fontSize: '0.9rem', fontWeight: 900, flexShrink: 0 }}>✓</span>
                <div>
                  <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                    Exact Color Calibration
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: '#A8B8C9', lineHeight: 1.5 }}>
                    What you approve on screen is precisely calibrated to match the final ink on paper, flex, or fabric.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399', fontSize: '0.9rem', fontWeight: 900, flexShrink: 0 }}>✓</span>
                <div>
                  <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                    Guaranteed Delivery Timelines
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: '#A8B8C9', lineHeight: 1.5 }}>
                    Direct control over offset and digital machines ensures wedding cards and event banners arrive on schedule.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 900px) {
          .highlight-grid {
            grid-template-columns: 1.15fr 0.85fr !important;
          }
        }
      `}</style>
    </section>
  );
};
