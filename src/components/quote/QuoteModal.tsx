'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Service } from '@/lib/schema';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
  services?: Service[];
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  preselectedService = '',
  services = [],
}) => {
  const { language, t, getLocalized } = useLanguage();
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    whatsapp: '',
    email: '',
    service: preselectedService || '',
    quantity: '',
    sizeSpecification: '',
    requirements: '',
    preferredContact: 'WhatsApp',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedQuoteId, setSubmittedQuoteId] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customerName.trim() || !formData.phone.trim()) {
      setErrorMsg('Please provide your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit quote request.');
      }

      setSubmittedQuoteId(data.quote?.id || 'CP-2026');
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while submitting your request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setFormData({
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
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={handleResetAndClose}
    >
      <div
        style={{
          backgroundColor: 'var(--paper-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--paper-border)',
          boxShadow: 'var(--shadow-xl)',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--paper-ivory)',
            border: '1px solid var(--paper-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
          }}
        >
          ✕
        </button>

        {isSuccess ? (
          /* Confirmation State */
          <div style={{ textAlign: 'center', padding: '16px 8px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--status-success-bg)',
                color: 'var(--status-success)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                marginBottom: '16px',
              }}
            >
              ✓
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink-deep)', marginBottom: '8px' }}>
              {t('quoteSuccessTitle')}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px', lineHeight: 1.5 }}>
              {t('quoteSuccessDesc')}
            </p>
            <div
              style={{
                display: 'inline-block',
                padding: '6px 14px',
                backgroundColor: 'var(--paper-ivory)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--ink-700)',
                marginBottom: '24px',
              }}
            >
              Request Reference: <strong>{submittedQuoteId}</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={`https://wa.me/919421396905?text=${encodeURIComponent(`Namaskar! I submitted a quote request (${submittedQuoteId}) on your website for ${formData.service || 'printing work'}. My name is ${formData.customerName}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ width: '100%' }}
              >
                <span>💬</span>
                <span>Direct WhatsApp Follow-up</span>
              </a>

              <a href="tel:9421396905" className="btn btn-secondary" style={{ width: '100%' }}>
                <span>📞</span>
                <span>Call Shop (9421396905)</span>
              </a>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="btn btn-dark"
                style={{ width: '100%', marginTop: '6px' }}
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <div>
            <div style={{ marginBottom: '24px' }}>
              <span className="badge badge-featured" style={{ marginBottom: '8px' }}>
                New Chintamani Printing Press
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ink-deep)' }}>
                {t('btnGetQuote')}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {language === 'mr'
                  ? 'तुमच्या कामाचा तपशील खालील फॉर्ममध्ये भरा. आम्ही तुम्हाला उत्तम दर देऊ.'
                  : language === 'hi'
                  ? 'अपने कार्य का विवरण भरें। हम आपको सर्वोत्तम दर प्रदान करेंगे।'
                  : 'Submit your printing requirements below. We will get back to you with competitive pricing.'}
              </p>
            </div>

            {errorMsg && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--status-error-bg)',
                  color: 'var(--status-error)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  marginBottom: '16px',
                }}
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
                    placeholder="e.g. Ramesh Patil"
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
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Optional if same as phone"
                  />
                </div>
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
                  <option value="">-- Choose a Printing or Designing Service --</option>
                  {services.length > 0 ? (
                    services.map((srv) => (
                      <option key={srv.id} value={srv.name_en}>
                        {getLocalized(srv, 'name')}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Visiting Cards / Business Cards">Visiting Cards / Business Cards</option>
                      <option value="Wedding Invitation Cards (लग्नपत्रिका)">Wedding Invitation Cards (लग्नपत्रिका)</option>
                      <option value="Birthday & Anniversary Invitations">Birthday Invitations</option>
                      <option value="Brochures & Flyers">Brochures & Flyers</option>
                      <option value="Flex Banners & Hoardings">Flex Banners & Hoardings</option>
                      <option value="Bill Books, Receipt Books">Bill Books & Receipt Books</option>
                      <option value="Non-Woven Carry Bag Printing">Carry Bag Printing</option>
                      <option value="Stickers & Labels">Stickers & Labels</option>
                      <option value="Creative Graphic Designing">Creative Graphic Designing</option>
                      <option value="Color Xerox & Lamination">Color Xerox, Binding & Lamination</option>
                      <option value="Other Custom Printing">Other Custom Printing</option>
                    </>
                  )}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">
                    Quantity (अंदाजे नग)
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. 500, 1000, 50"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Size / Specs
                  </label>
                  <input
                    type="text"
                    name="sizeSpecification"
                    value={formData.sizeSpecification}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. 10x4 ft, Matt finish"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {t('formRequirements')}
                </label>
                <textarea
                  name="requirements"
                  rows={3}
                  value={formData.requirements}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Describe your design, paper choice, urgency or any specific text details..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {t('formContactPref')}
                </label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {['WhatsApp', 'Phone', 'Email'].map((method) => (
                    <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', cursor: 'pointer' }}>
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
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '8px' }}
              >
                {isSubmitting ? t('btnSubmitting') : t('btnSubmit')}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
