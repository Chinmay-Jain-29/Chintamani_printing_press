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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customerName.trim() || !formData.phone.trim()) {
      setErrorMsg('Please enter your name and phone number.');
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
      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit quote request.');
      }
      setSubmittedId(result.quote?.id || 'CP-2026');
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while submitting your request.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <div style={{ textAlign: 'center', padding: '24px 8px' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--status-success-bg)',
                  color: 'var(--status-success)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  marginBottom: '20px',
                }}
              >
                ✓
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--ink-deep)', marginBottom: '12px' }}>
                {t('quoteSuccessTitle')}
              </h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
                {t('quoteSuccessDesc')}
              </p>

              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 18px',
                  backgroundColor: 'var(--paper-ivory)',
                  border: '1px solid var(--paper-border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: 'var(--ink-800)',
                  marginBottom: '32px',
                }}
              >
                Reference ID: <strong>{submittedId}</strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '420px', margin: '0 auto' }}>
                <a
                  href={`https://wa.me/91${business?.whatsapp || '9421396905'}?text=${encodeURIComponent(`Namaskar! I submitted quote request #${submittedId} for ${formData.service || 'printing work'}. My name is ${formData.customerName}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-lg"
                >
                  <span>💬 Direct WhatsApp Follow-up</span>
                </a>

                <a
                  href={`tel:${business?.phone1 || '9421396905'}`}
                  className="btn btn-secondary btn-lg"
                >
                  <span>📞 Call Shop ({business?.phone1 || '9421396905'})</span>
                </a>

                <Link href="/" className="btn btn-dark" style={{ marginTop: '8px' }}>
                  Return to Home
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
                    padding: '14px',
                    backgroundColor: 'var(--status-error-bg)',
                    color: 'var(--status-error)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.92rem',
                    marginBottom: '20px',
                  }}
                >
                  {errorMsg}
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
