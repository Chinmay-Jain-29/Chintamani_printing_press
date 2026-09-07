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
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyToken = () => {
    if (submittedQuoteId) {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(submittedQuoteId);
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
          : 'Please provide your name and phone number.'
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

      const data = await res.json();

      // If the quote was created or the request succeeded, transition to confirmation screen
      if (data?.quote?.id || data?.success || res.ok) {
        setSubmittedQuoteId(data?.quote?.id || `CP-2026-${Date.now().toString().slice(-6)}`);
        setIsSuccess(true);
      } else {
        throw new Error(data?.error || 'Failed to submit quote request. Please contact us via WhatsApp or Call.');
      }
    } catch (err: any) {
      console.error('Quote submission error:', err);
      setErrorMsg(err.message || 'Failed to submit quote request. Please contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setCopied(false);
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

  const whatsappMessage = encodeURIComponent(
    `Namaskar! I submitted quote request #${submittedQuoteId} on your website for ${formData.service || 'printing service'}. My name is ${formData.customerName}. Please provide price details.`
  );

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
            cursor: 'pointer',
          }}
        >
          ✕
        </button>

        {isSuccess ? (
          /* Confirmation State with Thank You Message, Order Token, WhatsApp & Call Options */
          <div style={{ textAlign: 'center', padding: '12px 4px' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(22, 101, 52, 0.1)',
                border: '2px solid rgba(22, 101, 52, 0.25)',
                color: '#15803d',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                fontWeight: 800,
                marginBottom: '16px',
                boxShadow: '0 4px 14px rgba(22, 101, 52, 0.12)',
              }}
            >
              ✓
            </div>

            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--ink-deep)', marginBottom: '8px' }}>
              {language === 'mr'
                ? 'धन्यवाद! कोटेशन विनंती प्राप्त झाली'
                : language === 'hi'
                ? 'धन्यवाद! कोटेशन अनुरोध प्राप्त हुआ'
                : 'Thank You! Quote Request Received'}
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '20px', lineHeight: 1.55, maxWidth: '440px', margin: '0 auto 20px' }}>
              {t('quoteSuccessDesc')}
            </p>

            {/* Prominent Order Token Box */}
            <div
              style={{
                backgroundColor: 'var(--paper-ivory)',
                border: '1.5px solid var(--paper-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                marginBottom: '22px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
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
                  gap: '10px',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace, Consolas, Courier New',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    color: 'var(--ink-deep)',
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  {submittedQuoteId}
                </span>

                <button
                  type="button"
                  onClick={handleCopyToken}
                  style={{
                    backgroundColor: copied ? '#15803d' : 'var(--ink-deep)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 14px',
                    fontSize: '0.82rem',
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
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  marginTop: '10px',
                  marginBottom: 0,
                }}
              >
                {language === 'mr'
                  ? 'चौकशीसाठी हा टोकन क्रमांक लक्षात ठेवा किंवा व्हॉट्सॲपवर पाठवा.'
                  : language === 'hi'
                  ? 'शीघ्र पूछताछ के लिए यह टोकन नंबर नोट कर लें अथवा व्हाट्सएप पर भेजें।'
                  : 'Please keep this token handy for fast reference when contacting our shop.'}
              </p>
            </div>

            {/* Direct WhatsApp and Call Action Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href={`https://wa.me/919421396905?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>💬</span>
                <span>
                  {language === 'mr'
                    ? 'थेट व्हॉट्सॲपवर संपर्क करा (९४२१३९६९०५)'
                    : language === 'hi'
                    ? 'सीधे व्हाट्सएप पर संपर्क करें (9421396905)'
                    : 'Direct WhatsApp Follow-up (9421396905)'}
                </span>
              </a>

              <a
                href="tel:9421396905"
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>📞</span>
                <span>
                  {language === 'mr'
                    ? 'थेट दुकानात कॉल करा (९४२१३९६९०५ / ९८३४८५३८५१)'
                    : language === 'hi'
                    ? 'सीधे दुकान पर कॉल करें (9421396905 / 9834853851)'
                    : 'Call Shop (9421396905 / 9834853851)'}
                </span>
              </a>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="btn btn-dark"
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {language === 'mr' ? 'बंद करा व मुख्यपृष्ठावर जा' : language === 'hi' ? 'बंद करें और होम पर जाएं' : 'Close & Return'}
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
                  padding: '12px 16px',
                  backgroundColor: 'var(--status-error-bg)',
                  border: '1px solid var(--status-error-border)',
                  color: 'var(--status-error)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  marginBottom: '16px',
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: '6px' }}>{errorMsg}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--ink-deep)', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginTop: '6px' }}>
                  <span>Or contact us directly:</span>
                  <a
                    href="https://wa.me/919421396905"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#166534', fontWeight: 700, textDecoration: 'underline' }}
                  >
                    💬 WhatsApp (9421396905)
                  </a>
                  <a
                    href="tel:9421396905"
                    style={{ color: '#0369a1', fontWeight: 700, textDecoration: 'underline' }}
                  >
                    📞 Call (9421396905)
                  </a>
                </div>
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
