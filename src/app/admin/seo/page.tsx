'use client';

import React, { useState, useEffect } from 'react';
import { SeoSettings, SocialLinks } from '@/lib/schema';

export default function AdminSeoPage() {
  const [seo, setSeo] = useState<SeoSettings | null>(null);
  const [social, setSocial] = useState<SocialLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/admin/seo')
      .then((r) => r.json())
      .then((data) => {
        setSeo(data.seo);
        setSocial(data.socialLinks);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seo || !social) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seo, socialLinks: social }),
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

  if (loading || !seo || !social) {
    return <div style={{ padding: '32px', textAlign: 'center' }}>Loading SEO and Social settings...</div>;
  }

  return (
    <div style={{ maxWidth: '860px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
          SEO &amp; Social Media Links
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Optimize search engine ranking for Dongaon, Mehekar, and Buldhana keywords, and connect official social profiles.
        </p>
      </div>

      {savedSuccess && (
        <div style={{ padding: '14px', backgroundColor: '#f0fdf4', color: '#15803d', borderRadius: '6px', marginBottom: '20px', fontWeight: 600 }}>
          ✓ SEO and Social Media settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* SEO Meta Titles and Descriptions */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '28px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
            Local SEO &amp; Meta Information
          </h2>

          <div className="form-group">
            <label className="form-label">Site Meta Title (English)</label>
            <input
              type="text"
              value={seo.siteTitle_en}
              onChange={(e) => setSeo({ ...seo, siteTitle_en: e.target.value })}
              className="form-control"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">शीर्षक (मराठी)</label>
              <input
                type="text"
                value={seo.siteTitle_mr}
                onChange={(e) => setSeo({ ...seo, siteTitle_mr: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">शीर्षक (हिंदी)</label>
              <input
                type="text"
                value={seo.siteTitle_hi}
                onChange={(e) => setSeo({ ...seo, siteTitle_hi: e.target.value })}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Meta Description (English)</label>
            <textarea
              rows={2}
              value={seo.metaDescription_en}
              onChange={(e) => setSeo({ ...seo, metaDescription_en: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">SEO Keywords</label>
            <input
              type="text"
              value={seo.keywords_en}
              onChange={(e) => setSeo({ ...seo, keywords_en: e.target.value })}
              className="form-control"
            />
            <small style={{ color: '#64748b', display: 'block', marginTop: '4px' }}>
              Comma separated search terms (e.g. Printing Press in Dongaon, Wedding Card Printing Dongaon, Flex Printing Mehekar)
            </small>
          </div>
        </div>

        {/* Social Media Links */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '28px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
            Social Media Links
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '16px' }}>
            Leave blank if not applicable. The website automatically hides any social icons whose links are empty.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Instagram Profile URL</label>
              <input
                type="url"
                value={social.instagram || ''}
                onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
                className="form-control"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Facebook Page URL</label>
              <input
                type="url"
                value={social.facebook || ''}
                onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
                className="form-control"
                placeholder="https://facebook.com/..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">YouTube Channel URL</label>
              <input
                type="url"
                value={social.youtube || ''}
                onChange={(e) => setSocial({ ...social, youtube: e.target.value })}
                className="form-control"
                placeholder="https://youtube.com/..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp Channel URL</label>
              <input
                type="url"
                value={social.whatsappChannel || ''}
                onChange={(e) => setSocial({ ...social, whatsappChannel: e.target.value })}
                className="form-control"
                placeholder="https://whatsapp.com/channel/..."
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
          {saving ? 'Saving...' : 'Save SEO & Social Settings'}
        </button>
      </form>
    </div>
  );
}
