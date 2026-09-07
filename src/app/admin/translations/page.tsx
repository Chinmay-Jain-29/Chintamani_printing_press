'use client';

import React, { useState, useEffect } from 'react';
import { SupportedLanguage } from '@/lib/schema';

export default function AdminTranslationsPage() {
  const [translations, setTranslations] = useState<Record<string, Record<SupportedLanguage, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeLang, setActiveLang] = useState<SupportedLanguage>('mr');

  useEffect(() => {
    fetch('/api/admin/translations')
      .then((r) => r.json())
      .then((data) => setTranslations(data.translations || {}))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleTextChange = (key: string, lang: SupportedLanguage, value: string) => {
    setTranslations({
      ...translations,
      [key]: {
        ...translations[key],
        [lang]: value,
      },
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ translations }),
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

  if (loading) {
    return <div style={{ padding: '32px', textAlign: 'center' }}>Loading Translations...</div>;
  }

  const keys = Object.keys(translations);

  return (
    <div style={{ maxWidth: '860px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
          Language &amp; Translation Manager
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Manually review and fine-tune website wording in <strong>English</strong>, <strong>मराठी (Marathi)</strong>, and <strong>हिंदी (Hindi)</strong>.
        </p>
      </div>

      {savedSuccess && (
        <div style={{ padding: '14px', backgroundColor: '#f0fdf4', color: '#15803d', borderRadius: '6px', marginBottom: '20px', fontWeight: 600 }}>
          ✓ Translations updated successfully!
        </div>
      )}

      {/* Language Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => setActiveLang('en')}
          style={{
            padding: '10px 24px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            fontSize: '0.9rem',
            backgroundColor: activeLang === 'en' ? '#0f172a' : '#ffffff',
            color: activeLang === 'en' ? '#ffffff' : '#475569',
            border: '1px solid #cbd5e1',
          }}
        >
          🇬🇧 English (Default)
        </button>

        <button
          type="button"
          onClick={() => setActiveLang('mr')}
          style={{
            padding: '10px 24px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            fontSize: '0.9rem',
            backgroundColor: activeLang === 'mr' ? '#0f172a' : '#ffffff',
            color: activeLang === 'mr' ? '#ffffff' : '#475569',
            border: '1px solid #cbd5e1',
          }}
        >
          🇮🇳 मराठी (Marathi)
        </button>

        <button
          type="button"
          onClick={() => setActiveLang('hi')}
          style={{
            padding: '10px 24px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            fontSize: '0.9rem',
            backgroundColor: activeLang === 'hi' ? '#0f172a' : '#ffffff',
            color: activeLang === 'hi' ? '#ffffff' : '#475569',
            border: '1px solid #cbd5e1',
          }}
        >
          🇮🇳 हिंदी (Hindi)
        </button>
      </div>

      {/* Translation Keys Editor */}
      <form
        onSubmit={handleSave}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e2e8f0',
          padding: '32px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {keys.map((key) => {
            const item = translations[key] || { en: '', mr: '', hi: '' };
            return (
              <div key={key} className="form-group" style={{ margin: 0, paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                    Key: <code>{key}</code>
                  </label>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Reference English: &quot;{item.en}&quot;
                  </span>
                </div>

                <input
                  type="text"
                  value={item[activeLang] || ''}
                  onChange={(e) => handleTextChange(key, activeLang, e.target.value)}
                  className="form-control"
                  placeholder={`Translate for ${activeLang.toUpperCase()}`}
                />
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: '28px' }}
        >
          {saving ? 'Saving Translations...' : 'Save All Translations'}
        </button>
      </form>
    </div>
  );
}
