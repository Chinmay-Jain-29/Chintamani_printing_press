'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { HeritageTimeline } from '@/components/home/HeritageTimeline';
import { AppDatabase } from '@/lib/schema';
import { QuoteModal } from '@/components/quote/QuoteModal';

export default function AboutPage() {
  const { language, t } = useLanguage();
  const [data, setData] = useState<AppDatabase | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((res) => res.database && setData(res.database));
  }, []);

  const business = data?.businessInfo;
  const timeline = data?.homepage.timeline || [];

  return (
    <div style={{ backgroundColor: 'var(--paper-cream)', minHeight: '80vh', paddingBottom: '80px' }}>
      {/* Page Header Banner */}
      <section
        style={{
          backgroundColor: 'var(--ink-deep)',
          color: '#ffffff',
          paddingTop: '64px',
          paddingBottom: '64px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container">
          <span className="badge badge-top" style={{ marginBottom: '16px' }}>
            {t('badgeEstablished')} • Dongaon
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 900,
              color: '#ffffff',
              marginBottom: '16px',
            }}
          >
            {language === 'mr' ? 'आमच्याबद्दल व आमचा प्रवास' : language === 'hi' ? 'हमारे बारे में और हमारा सफर' : 'Our Story & Heritage'}
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-inverse-muted)',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            {language === 'mr'
              ? '१९९९ पासून विश्वासार्ह मुद्रण, उत्कृष्ट डिझायनिंग आणि स्थानिक ग्राहकांची प्रामाणिक सेवा.'
              : language === 'hi'
              ? '१९९९ से भरोसेमंद मुद्रण, श्रेष्ठ डिज़ाइनिंग और स्थानीय ग्राहकों की समर्पित सेवा.'
              : 'Serving Dongaon, Mehekar, and Buldhana district with unwavering printing expertise, honest pricing, and personal dedication.'}
          </p>
        </div>
      </section>

      {/* Main Story Narrative */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            {/* Story Text */}
            <div>
              <span className="section-badge">
                {language === 'mr' ? '२५ वर्षांचा विश्वास' : language === 'hi' ? '२५ वर्षों का विश्वास' : 'A Quarter-Century of Trust'}
              </span>

              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                  fontWeight: 800,
                  color: 'var(--ink-deep)',
                  marginBottom: '20px',
                  lineHeight: 1.25,
                }}
              >
                {business?.name || 'NEW CHINTAMANI PRINTING PRESS'}
              </h2>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  marginBottom: '32px',
                }}
              >
                <p>
                  {language === 'mr'
                    ? 'न्यू चिंतामणी प्रिंटिंग प्रेसची स्थापना १९९९ मध्ये श्री. प्रकाश देवेंद्र जैन यांनी डोणगाव (ता. मेहकर, जि. बुलढाणा) येथील श्रीकांत टॉकीज रोडवर केली. स्थानिक नागरिक, शेतकरी, व्यापारी आणि कुटुंबांना दर्जेदार व वेळेवर मुद्रण सेवा पुरवणे हे आमचे मूळ उद्दिष्ट होते.'
                    : language === 'hi'
                    ? 'न्यू चिंतामणी प्रिंटिंग प्रेस की स्थापना १९९९ में श्री प्रकाश देवेंद्र जैन द्वारा डोणगांव (तहसील मेहकर, जिला बुलढाणा) में श्रीकांत टॉकीज रोड पर की गई थी। स्थानीय लोगों, किसानों, व्यापारियों और परिवारों को समय पर व उच्च गुणवत्ता वाली मुद्रण सेवा देना हमारा मूल ध्येय रहा है।'
                    : 'New Chintamani Printing Press was established in 1999 by Mr. Prakash Devendra Jain on Shrikant Talkies Road near the Bus Stand in Dongaon, Taluka Mehekar, District Buldhana. Founded on the bedrock of personal integrity and meticulous craftsmanship, the press began as a dedicated local printing house.'}
                </p>

                <p>
                  {language === 'mr'
                    ? 'गेल्या २५+ वर्षांत तंत्रज्ञान बदलले, परंतु आमची कामावरील निष्ठा कायम राहिली. आज आम्ही पारंपरिक ऑफसेट प्रिंटिंगपासून ते हाय-रिझोल्युशन डिजिटल प्रिंटिंग, आकर्षक लग्नपत्रिका, मल्टी-कलर व्हिजिटिंग कार्ड्स, फ्लेक्स बॅनर्स आणि संपूर्ण डिझायनिंग एकाच ठिकाणी उपलब्ध करून देतो.'
                    : language === 'hi'
                    ? 'विगत २५+ वर्षों में तकनीक बदली, पर हमारी निष्ठा वही रही। आज हम पारंपरिक ऑफसेट से लेकर आधुनिक डिजिटल प्रिंटिंग, शादी के कार्ड, विज़िटिंग कार्ड्स, फ्लेक्स बैनर और संपूर्ण डिज़ाइनिंग एक ही स्थान पर उपलब्ध कराते हैं।'
                    : 'Over the last two and a half decades, printing technology has rapidly modernized, and New Chintamani Printing Press has continuously upgraded its setup. Today, we combine time-honored offset fidelity with modern high-speed digital printing, Devanagari typesetting, and weather-resistant flex technology.'}
                </p>
              </div>

              {/* Founder Profile Card */}
              <div
                style={{
                  padding: '24px',
                  backgroundColor: 'var(--paper-ivory)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1.5px solid var(--paper-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--accent-terracotta)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '1.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  PJ
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-terracotta)', fontWeight: 700 }}>
                    Founder &amp; Proprietor
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink-deep)', margin: '2px 0' }}>
                    Mr. Prakash Devendra Jain
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Guiding every print order with personal quality checks and community dedication since 1999.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Side Card */}
            <div>
              <div
                style={{
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--paper-border)',
                  backgroundColor: 'var(--paper-card)',
                }}
              >
                {/* eslint-disable-next-run @next/next/no-img-element */}
                <img
                  src="/assets/hero-printing-showcase.jpg"
                  alt="New Chintamani Printing Press Workshop Craftsmanship"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
                <div style={{ padding: '28px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink-deep)', marginBottom: '8px' }}>
                    Quality Assurance on Every Sheet
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                    We never cut corners on paper weight (GSM), ink saturation, or proof checking. Before any print run commences, proofs are verified for zero spelling errors in Marathi, Hindi, and English.
                  </p>
                  <button
                    type="button"
                    onClick={() => setQuoteOpen(true)}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    <span>Request a Quote for Your Order</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Timeline Section */}
      {timeline.length > 0 && <HeritageTimeline timeline={timeline} />}

      {/* Quote Modal */}
      <QuoteModal
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        services={data?.services || []}
      />
    </div>
  );
}
