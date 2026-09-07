'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { AppDatabase, Service } from '@/lib/schema';

export default function QuotePage() {
  const { language, t, getLocalized } = useLanguage();
  const [data, setData] = useState<AppDatabase | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    whatsapp: '',
    email: '',
    service: '',
    quantity: '',
    sizeSpecification: '',
    requirements: '',
    preferredContact: 'WhatsApp',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((res) => res.database && setData(res.database));
  }, []);

  const services = data?.services || [];
  const business = data?.businessInfo;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyToken = () => {
    if (submittedId) {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(submittedId);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customerName.trim() || !formData.phone.trim()) {
      setErrorMsg(
        language === 'mr'
          ? 'कृपया आपले नाव आणि संपर्क क्रमांक भरा.'
          : language === 'hi'
          ? 'कृपया अपना नाम और संपर्क नंबर भरें।'
          : 'Please enter your name and phone number.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result?.quote?.id || result?.success || res.ok) {
        setSubmittedId(result?.quote?.id || `CP-2026-${Date.now().toString().slice(-6)}`);
        setIsSuccess(true);
      } else {
        throw new Error(result?.error || 'Failed to submit quote request. Please contact us via WhatsApp or Call.');
      }
    } catch (err: any) {
      console.error('Quote submission error:', err);
      setErrorMsg(err.message || 'An error occurred while submitting your request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Namaskar! I submitted quote request #${submittedId} on your website for ${formData.service || 'printing work'}. My name is ${formData.customerName}. Please provide price details.`
  );

  return (
    <div style={{ backgroundColor: 'var(--paper-cream)', minHeight: '80vh', paddingBottom: '80px' }}>
      {/* Banner */}
      <section
        style={{
          backgroundColor: 'var(--ink-deep)',
          color: '#ffffff',
          paddingTop: '64px',
          paddingBottom: '64px',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <span className="badge badge-featured" style={{ marginBottom: '16px' }}>
            Instant Estimate Inquiry
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 900,
              color: '#ffffff',
              marginBottom: '16px',
            }}
          >
            {t('navQuote')}
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-inverse-muted)',
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            Tell us about your printing requirements. We provide clear, affordable, and honest pricing tailored to your job.
          </p>
        </div>
      </section>

      {/* Main Form Container */}
      <div className="container" style={{ paddingTop: '48px', maxWidth: '720px' }}>
        <div
          className="card card-print-accent"
          style={{
            padding: '40px',
            backgroundColor: 'var(--paper-card)',
          }}
        >
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div
                style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(22, 101, 52, 0.1)',
                  border: '2px solid rgba(22, 101, 52, 0.25)',
                  color: '#15803d',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  marginBottom: '20px',
                  boxShadow: '0 4px 14px rgba(22, 101, 52, 0.12)',
                }}
              >
                ✓
              </div>

              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--ink-deep)', marginBottom: '10px' }}>
                {language === 'mr'
                  ? 'धन्यवाद! कोटेशन विनंती प्राप्त झाली'
                  : language === 'hi'
                  ? 'धन्यवाद! कोटेशन अनुरोध प्राप्त हुआ'
                  : 'Thank You! Quote Request Received'}
              </h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px', maxWidth: '520px', margin: '0 auto 24px' }}>
                {t('quoteSuccessDesc')}
              </p>

              {/* Prominent Order Token Box */}
              <div
                style={{
                  backgroundColor: 'var(--paper-ivory)',
                  border: '1.5px solid var(--paper-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  marginBottom: '28px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div
                  style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontWeight: 700,
                    color: 'var(--ink-muted)',
                    marginBottom: '8px',
                  }}
                >
                  {language === 'mr'
                    ? 'तुमचा संदर्भ ऑर्डर टोकन क्रमांक'
                    : language === 'hi'
                    ? 'आपका संदर्भ ऑर्डर टोकन नंबर'
                    : 'Order Reference Token'}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'monospace, Consolas, Courier New',
                      fontSize: '1.55rem',
                      fontWeight: 800,
                      letterSpacing: '1px',
                      color: 'var(--ink-deep)',
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      padding: '8px 18px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0,0,0,0.08)',
                    }}
                  >
                    {submittedId}
                  </span>

                  <button
                    type="button"
                    onClick={handleCopyToken}
                    style={{
                      backgroundColor: copied ? '#15803d' : 'var(--ink-deep)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {copied ? '✓ Copied' : '📋 Copy Token'}
                  </button>
                </div>

                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    marginTop: '12px',
                    marginBottom: 0,
                  }}
                >
                  {language === 'mr'
                    ? 'चौकशीसाठी हा टोकन क्रमांक लक्षात ठेवा किंवा व्हॉट्सॲपवर पाठवा.'
                    : language === 'hi'
                    ? 'शीघ्र पूछताछ के लिए यह टोकन नंबर नोट कर लें अथवा व्हाट्सएप पर भेजें।'
                    : 'Please quote this token for fast reference when contacting our shop.'}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '440px', margin: '0 auto' }}>
                <a
                  href={`https://wa.me/91${business?.whatsapp || '9421396905'}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-lg"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '14px',
                    fontSize: '1.02rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>💬</span>
                  <span>
                    {language === 'mr'
                      ? 'थेट व्हॉट्सॲपवर संपर्क करा'
                      : language === 'hi'
                      ? 'सीधे व्हाट्सएप पर संपर्क करें'
                      : 'Direct WhatsApp Follow-up'}
                  </span>
                </a>

                <a
                  href={`tel:${business?.phone1 || '9421396905'}`}
                  className="btn btn-secondary btn-lg"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '14px',
                    fontSize: '1.02rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>📞</span>
                  <span>
                    {language === 'mr'
                      ? `थेट दुकानात कॉल करा (${business?.phone1 || '9421396905'})`
                      : language === 'hi'
                      ? `दुकान पर कॉल करें (${business?.phone1 || '9421396905'})`
                      : `Call Shop (${business?.phone1 || '9421396905'})`}
                  </span>
                </a>

                <Link href="/" className="btn btn-dark" style={{ marginTop: '8px', padding: '12px', fontWeight: 600 }}>
                  {language === 'mr' ? 'मुख्यपृष्ठावर परत जा' : language === 'hi' ? 'होम पर वापस जाएं' : 'Return to Home'}
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '28px' }}>
                <span className="badge badge-top" style={{ marginBottom: '8px' }}>
                  No Account Required
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--ink-deep)', marginBottom: '6px' }}>
                  Request a Quotation
                </h2>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                  Fill in the details below. We review requests promptly and respond via your preferred contact method.
                </p>
              </div>

              {errorMsg && (
                <div
                  style={{
                    padding: '14px 18px',
                    backgroundColor: 'var(--status-error-bg)',
                    border: '1px solid var(--status-error-border)',
                    color: 'var(--status-error)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.92rem',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: '6px' }}>{errorMsg}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--ink-deep)', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginTop: '6px' }}>
                    <span>Or contact us directly:</span>
                    <a
                      href={`https://wa.me/91${business?.whatsapp || '9421396905'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#166534', fontWeight: 700, textDecoration: 'underline' }}
                    >
                      💬 WhatsApp ({business?.whatsapp || '9421396905'})
                    </a>
                    <a
                      href={`tel:${business?.phone1 || '9421396905'}`}
                      style={{ color: '#0369a1', fontWeight: 700, textDecoration: 'underline' }}
                    >
                      📞 Call ({business?.phone1 || '9421396905'})
                    </a>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">
                      {t('formName')} <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      required
                      value={formData.customerName}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g. Sanjay Deshmukh"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      {t('formPhone')} <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="10-digit mobile number"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      {t('formWhatsApp')}
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="WhatsApp number"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('formEmail')}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="name@example.com (optional)"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {t('formService')} <span className="required">*</span>
                  </label>
                  <select
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">-- Select Service --</option>
                    {services.map((srv) => (
                      <option key={srv.id} value={srv.name_en}>
                        {getLocalized(srv, 'name')}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">{t('formQuantity')}</label>
                    <input
                      type="text"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g. 1000 cards, 50 books"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('formSpecs')}</label>
                    <input
                      type="text"
                      name="sizeSpecification"
                      value={formData.sizeSpecification}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g. 10x4 ft, 350 GSM matt"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('formRequirements')}</label>
                  <textarea
                    name="requirements"
                    rows={4}
                    value={formData.requirements}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Mention specific text, language preference (Marathi/Hindi/English), expected delivery date, or special finishing..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('formContactPref')}</label>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {['WhatsApp', 'Phone', 'Email'].map((method) => (
                      <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="preferredContact"
                          value={method}
                          checked={formData.preferredContact === method}
                          onChange={handleChange}
                        />
                        <span>{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '16px' }}
                >
                  {isSubmitting ? t('btnSubmitting') : t('btnSubmit')}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
