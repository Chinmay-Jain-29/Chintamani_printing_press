'use client';

import React, { useState, useEffect } from 'react';
import { HomepageConfig } from '@/lib/schema';

export default function AdminHomepageManager() {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/admin/homepage')
      .then((r) => r.json())
      .then((data) => setConfig(data.homepage))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleHeroChange = (field: string, value: string) => {
    if (!config) return;
    setConfig({
      ...config,
      hero: { ...config.hero, [field]: value },
    });
  };

  const handleToggleSection = (field: keyof HomepageConfig) => {
    if (!config) return;
    setConfig({
      ...config,
      [field]: !config[field],
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
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

  if (loading || !config) {
    return <div style={{ padding: '32px', textAlign: 'center' }}>Loading Homepage configuration...</div>;
  }

  const { hero } = config;

  return (
    <div style={{ maxWidth: '860px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
          Homepage &amp; Hero Section Manager
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Control hero headlines, CTA destinations, and enable or disable individual sections of the homepage.
        </p>
      </div>

      {savedSuccess && (
        <div style={{ padding: '14px', backgroundColor: '#f0fdf4', color: '#15803d', borderRadius: '6px', marginBottom: '20px', fontWeight: 600 }}>
          ✓ Homepage settings saved successfully! Changes are live immediately.
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Section Visibility Toggles */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '28px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
            Section Visibility Toggles
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.92rem' }}>
              <input
                type="checkbox"
                checked={config.showTimeline}
                onChange={() => handleToggleSection('showTimeline')}
              />
              <span>Heritage Timeline (1999)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.92rem' }}>
              <input
                type="checkbox"
                checked={config.showStats}
                onChange={() => handleToggleSection('showStats')}
              />
              <span>Trust Statistics (25+ Yrs)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.92rem' }}>
              <input
                type="checkbox"
                checked={config.showFeaturedServices}
                onChange={() => handleToggleSection('showFeaturedServices')}
              />
              <span>Featured Services</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.92rem' }}>
              <input
                type="checkbox"
                checked={config.showWhyChooseUs}
                onChange={() => handleToggleSection('showWhyChooseUs')}
              />
              <span>Why Choose Us</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.92rem' }}>
              <input
                type="checkbox"
                checked={config.showTopWorks}
                onChange={() => handleToggleSection('showTopWorks')}
              />
              <span>Top Works Showcase</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.92rem' }}>
              <input
                type="checkbox"
                checked={config.showReviews}
                onChange={() => handleToggleSection('showReviews')}
              />
              <span>Customer Reviews</span>
            </label>
          </div>
        </div>

        {/* Hero Section Content */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '28px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
            Hero Main Banner Content
          </h2>

          <div className="form-group">
            <label className="form-label">Hero Badge / Pill (English)</label>
            <input
              type="text"
              value={hero.badge_en}
              onChange={(e) => handleHeroChange('badge_en', e.target.value)}
              className="form-control"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">बॅज (मराठी)</label>
              <input
                type="text"
                value={hero.badge_mr}
                onChange={(e) => handleHeroChange('badge_mr', e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">बैज (हिंदी)</label>
              <input
                type="text"
                value={hero.badge_hi}
                onChange={(e) => handleHeroChange('badge_hi', e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Main Heading (English) *</label>
            <input
              type="text"
              required
              value={hero.title_en}
              onChange={(e) => handleHeroChange('title_en', e.target.value)}
              className="form-control"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">शीर्षक (मराठी)</label>
              <input
                type="text"
                value={hero.title_mr}
                onChange={(e) => handleHeroChange('title_mr', e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">शीर्षक (हिंदी)</label>
              <input
                type="text"
                value={hero.title_hi}
                onChange={(e) => handleHeroChange('title_hi', e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Subtitle / Description (English)</label>
            <textarea
              rows={3}
              value={hero.subtitle_en}
              onChange={(e) => handleHeroChange('subtitle_en', e.target.value)}
              className="form-control"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">माहिती (मराठी)</label>
              <textarea
                rows={3}
                value={hero.subtitle_mr}
                onChange={(e) => handleHeroChange('subtitle_mr', e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">विवरण (हिंदी)</label>
              <textarea
                rows={3}
                value={hero.subtitle_hi}
                onChange={(e) => handleHeroChange('subtitle_hi', e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Primary CTA Button Label (English)</label>
              <input
                type="text"
                value={hero.primaryCtaText_en}
                onChange={(e) => handleHeroChange('primaryCtaText_en', e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary CTA Destination Link</label>
              <input
                type="text"
                value={hero.primaryCtaLink}
                onChange={(e) => handleHeroChange('primaryCtaLink', e.target.value)}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary btn-lg"
          style={{ width: '100%' }}
        >
          {saving ? 'Saving Homepage...' : 'Save Homepage Configuration'}
        </button>
      </form>
    </div>
  );
}
