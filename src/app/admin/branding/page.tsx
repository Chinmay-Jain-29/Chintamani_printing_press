'use client';

import React, { useState, useEffect } from 'react';
import { Branding } from '@/lib/schema';
import { Logo } from '@/components/logo/Logo';

export default function AdminBrandingPage() {
  const [branding, setBranding] = useState<Branding | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/admin/branding')
      .then((r) => r.json())
      .then((data) => setBranding(data.branding))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (data.success && data.url && branding) {
        setBranding({
          ...branding,
          logoUrl: data.url,
          useDefaultVectorLogo: false,
        });
      }
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRestoreDefault = () => {
    if (!branding) return;
    setBranding({
      ...branding,
      logoUrl: null,
      darkLogoUrl: null,
      useDefaultVectorLogo: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branding) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/branding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(branding),
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

  if (loading || !branding) {
    return <div style={{ padding: '32px', textAlign: 'center' }}>Loading Branding configuration...</div>;
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
          Branding &amp; Logo Settings
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Customize your business emblem. Switch between the original vector logo or upload your own shop logo image.
        </p>
      </div>

      {savedSuccess && (
        <div style={{ padding: '14px', backgroundColor: '#f0fdf4', color: '#15803d', borderRadius: '6px', marginBottom: '20px', fontWeight: 600 }}>
          ✓ Branding saved successfully! Logo updated on header and footer.
        </div>
      )}

      {/* Live Logo Preview Canvas */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e2e8f0',
          padding: '32px',
          marginBottom: '28px',
        }}
      >
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
          Live Logo Preview
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Light Background Preview */}
          <div
            style={{
              padding: '24px',
              backgroundColor: 'var(--paper-cream)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--paper-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '120px',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '10px' }}>
              Light Header Mode
            </div>
            <Logo
              customLogoUrl={branding.useDefaultVectorLogo ? null : branding.logoUrl}
              mode="light"
            />
          </div>

          {/* Dark Background Preview */}
          <div
            style={{
              padding: '24px',
              backgroundColor: '#0f172a',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '120px',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>
              Dark Footer Mode
            </div>
            <Logo
              customLogoUrl={branding.useDefaultVectorLogo ? null : branding.logoUrl}
              mode="dark"
            />
          </div>
        </div>
      </div>

      {/* Logo Controls Form */}
      <form
        onSubmit={handleSave}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e2e8f0',
          padding: '32px',
        }}
      >
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={branding.useDefaultVectorLogo}
              onChange={(e) => setBranding({ ...branding, useDefaultVectorLogo: e.target.checked })}
              style={{ width: '18px', height: '18px' }}
            />
            <span>Use Original Bespoke Vector Logo (Recommended)</span>
          </label>
          <small style={{ color: '#64748b', display: 'block', marginLeft: '28px', marginTop: '4px' }}>
            The original vector logo features the classic offset printing plate monogram, CMYK process registration dots, and &quot;Since 1999&quot; heritage ribbon.
          </small>
        </div>

        <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '24px 0' }} />

        <div className="form-group">
          <label className="form-label">Upload Custom Logo File (PNG, SVG, JPG, WebP)</label>
          <input
            type="file"
            accept="image/png, image/svg+xml, image/jpeg, image/webp"
            onChange={handleFileUpload}
            disabled={branding.useDefaultVectorLogo}
          />
          {uploading && <p style={{ fontSize: '0.85rem', color: '#c25e2e', marginTop: '6px' }}>Uploading file...</p>}
          {branding.logoUrl && !branding.useDefaultVectorLogo && (
            <div style={{ marginTop: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: '#15803d' }}>Current file: {branding.logoUrl}</span>
              <button
                type="button"
                onClick={handleRestoreDefault}
                className="btn btn-secondary btn-sm"
                style={{ marginLeft: '12px' }}
              >
                Reset to Default Vector
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: '20px' }}
        >
          {saving ? 'Saving...' : 'Save Branding Settings'}
        </button>
      </form>
    </div>
  );
}
