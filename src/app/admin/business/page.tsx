'use client';

import React, { useState, useEffect } from 'react';
import { BusinessInfo } from '@/lib/schema';

export default function AdminBusinessPage() {
  const [info, setInfo] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/admin/business')
      .then((r) => r.json())
      .then((data) => setInfo(data.businessInfo))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!info) return;
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !info) return;

    setUploadingPhoto(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setInfo({
          ...info,
          ownerPhotoUrl: data.url,
        });
      } else {
        alert('Photo upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Photo upload error: ' + err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!info) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !info) {
    return <div style={{ padding: '32px', textAlign: 'center' }}>Loading Business Information...</div>;
  }

  return (
    <div style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0B1F33', marginBottom: '6px' }}>
          Business Information &amp; Owner Profile
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
          Manage your official shop contact details, working hours, and the Owner’s Intro &amp; Profile Photo shown prominently on the homepage.
        </p>
      </div>

      {savedSuccess && (
        <div style={{ padding: '14px', backgroundColor: '#F0FDF4', color: '#15803D', borderRadius: '8px', marginBottom: '20px', fontWeight: 600, border: '1px solid #BBF7D0' }}>
          ✓ Business details and owner profile saved successfully! Changes are live on the website.
        </div>
      )}

      <form
        onSubmit={handleSave}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #E2E8F0',
          padding: '32px',
          boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
        }}
      >
        {/* ============================================================ */}
        {/* SECTION: OWNER PROFILE & PHOTO (HOMEPAGE INTRO) */}
        {/* ============================================================ */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.3rem' }}>👤</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B1F33' }}>
              Owner Profile &amp; Photo (Homepage Intro)
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '20px' }}>
            This photo and personal message appear in the dedicated section right above &quot;Decades of Dedication&quot; on the homepage.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '24px', alignItems: 'flex-start', marginBottom: '20px' }}>
            {/* Photo Preview & Controls */}
            <div>
              <div
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '16px',
                  border: '2px solid #D97706',
                  overflow: 'hidden',
                  backgroundColor: '#0B1F33',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  position: 'relative',
                  marginBottom: '10px',
                }}
              >
                {/* eslint-disable-next-run @next/next/no-img-element */}
                <img
                  src={info.ownerPhotoUrl || '/assets/owner-prakash-jain.jpg'}
                  alt={info.owner}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '150px',
                  padding: '8px 12px',
                  backgroundColor: '#0B1F33',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                {uploadingPhoto ? 'Uploading...' : '📷 Change Photo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                  disabled={uploadingPhoto}
                />
              </label>

              {info.ownerPhotoUrl && info.ownerPhotoUrl !== '/assets/owner-prakash-jain.jpg' && (
                <button
                  type="button"
                  onClick={() => setInfo({ ...info, ownerPhotoUrl: '/assets/owner-prakash-jain.jpg' })}
                  style={{
                    display: 'block',
                    width: '150px',
                    marginTop: '6px',
                    padding: '4px',
                    fontSize: '0.72rem',
                    color: '#EF4444',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  Reset to default photo
                </button>
              )}
            </div>

            {/* Owner Title & Name Inputs */}
            <div>
              <div className="form-group">
                <label className="form-label">Proprietor / Owner Name *</label>
                <input
                  type="text"
                  name="owner"
                  required
                  value={info.owner}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Mr. Prakash Devendra Jain"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Owner Title (English)</label>
                  <input
                    type="text"
                    name="ownerTitle_en"
                    value={info.ownerTitle_en || ''}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Founder &amp; Proprietor"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">पद / हुद्दा (मराठी)</label>
                  <input
                    type="text"
                    name="ownerTitle_mr"
                    value={info.ownerTitle_mr || ''}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="संस्थापक व संचालक"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">पद / पदनाम (हिंदी)</label>
                  <input
                    type="text"
                    name="ownerTitle_hi"
                    value={info.ownerTitle_hi || ''}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="संस्थापक व संचालक"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Owner Bio / Personal Message in 3 Languages */}
          <div className="form-group">
            <label className="form-label">Owner Message / Bio (English)</label>
            <textarea
              name="ownerBio_en"
              rows={3}
              value={info.ownerBio_en || ''}
              onChange={handleChange}
              className="form-control"
              placeholder="A personal message from the owner..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">संचालकांचे मनोगत (मराठी)</label>
            <textarea
              name="ownerBio_mr"
              rows={3}
              value={info.ownerBio_mr || ''}
              onChange={handleChange}
              className="form-control"
              placeholder="संस्थापकांचा व्यक्तिगत संदेश..."
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">संस्थापक का संदेश (हिंदी)</label>
            <textarea
              name="ownerBio_hi"
              rows={3}
              value={info.ownerBio_hi || ''}
              onChange={handleChange}
              className="form-control"
              placeholder="संस्थापक का व्यक्तिगत संदेश..."
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION: GENERAL BUSINESS & CONTACT DETAILS */}
        {/* ============================================================ */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B1F33', marginBottom: '16px' }}>
          General Business Information &amp; Contact
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Official Business Name *</label>
            <input
              type="text"
              name="name"
              required
              value={info.name}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Establishment Year</label>
            <input
              type="number"
              name="establishedYear"
              value={info.establishedYear}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={info.pincode}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Shop Address (Street / Landmark) *</label>
            <input
              type="text"
              name="address"
              required
              value={info.address}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Taluka</label>
            <input
              type="text"
              name="taluka"
              value={info.taluka}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">District &amp; State</label>
            <input
              type="text"
              name="district"
              value={info.district}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Primary Phone (Calling &amp; Inquiries) *</label>
            <input
              type="tel"
              name="phone1"
              required
              value={info.phone1}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Secondary Phone (Shop)</label>
            <input
              type="tel"
              name="phone2"
              value={info.phone2}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">WhatsApp Number (Direct Chat) *</label>
            <input
              type="tel"
              name="whatsapp"
              required
              value={info.whatsapp}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Official Email</label>
            <input
              type="email"
              name="email"
              value={info.email}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Business Hours in 3 Languages */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Business Hours (English)</label>
            <input
              type="text"
              name="businessHours_en"
              value={info.businessHours_en}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">कामाची वेळ (मराठी)</label>
            <input
              type="text"
              name="businessHours_mr"
              value={info.businessHours_mr}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">कार्य समय (हिंदी)</label>
            <input
              type="text"
              name="businessHours_hi"
              value={info.businessHours_hi}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Google Maps Embed URL (Optional)</label>
            <input
              type="url"
              name="googleMapsUrl"
              value={info.googleMapsUrl || ''}
              onChange={handleChange}
              className="form-control"
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: '28px' }}
        >
          {saving ? 'Saving Details...' : 'Save All Business & Owner Information'}
        </button>
      </form>
    </div>
  );
}
