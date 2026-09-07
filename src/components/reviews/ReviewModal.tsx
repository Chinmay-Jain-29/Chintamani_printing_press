'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSubmitted?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSuccessSubmitted }) => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    customerName: '',
    location: '',
    rating: 5,
    reviewText: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customerName.trim() || !formData.reviewText.trim()) {
      setErrorMsg('Please enter your name and your review message.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review.');
      }

      setIsSuccess(true);
      if (onSuccessSubmitted) {
        onSuccessSubmitted();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while submitting your review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setFormData({
      customerName: '',
      location: '',
      rating: 5,
      reviewText: '',
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
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: 'var(--paper-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--paper-border)',
          boxShadow: 'var(--shadow-xl)',
          width: '100%',
          maxWidth: '520px',
          padding: '32px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
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
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--ink-deep)', marginBottom: '8px' }}>
              {t('reviewSuccessTitle')}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.5 }}>
              {t('reviewSuccessDesc')}
            </p>
            <button type="button" onClick={handleClose} className="btn btn-primary" style={{ width: '100%' }}>
              Done
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <span className="badge badge-top" style={{ marginBottom: '8px' }}>
                Customer Feedback
              </span>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--ink-deep)' }}>
                {t('btnShareReview')}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Tell us about your experience with printing quality, timeliness, and service at New Chintamani Printing Press.
              </p>
            </div>

            {errorMsg && (
              <div
                style={{
                  padding: '10px',
                  backgroundColor: 'var(--status-error-bg)',
                  color: 'var(--status-error)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  marginBottom: '14px',
                }}
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">{t('formRating')}</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      style={{
                        fontSize: '1.8rem',
                        color: star <= formData.rating ? 'var(--accent-gold)' : 'var(--paper-border)',
                        transition: 'transform 0.1s',
                      }}
                      aria-label={`${star} star`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">
                    {t('formName')} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="form-control"
                    placeholder="Your name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {t('formLocation')}
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="form-control"
                    placeholder="e.g. Dongaon / Mehekar"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {t('formReview')} <span className="required">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.reviewText}
                  onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                  className="form-control"
                  placeholder="Share details about what you had printed, quality, delivery, and overall satisfaction..."
                />
              </div>

              <div
                style={{
                  padding: '10px',
                  backgroundColor: 'var(--paper-ivory)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '20px',
                  border: '1px solid var(--paper-border)',
                }}
              >
                🔒 <em>Note: To prevent spam, all customer reviews are verified by our team before publishing.</em>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ width: '100%' }}
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
