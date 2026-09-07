'use client';

import React, { useState, useEffect } from 'react';
import { PortfolioItem, PortfolioCategory } from '@/lib/schema';

export default function AdminPortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const initialForm: Partial<PortfolioItem> = {
    title_en: '',
    title_mr: '',
    title_hi: '',
    desc_en: '',
    desc_mr: '',
    desc_hi: '',
    category: 'wedding',
    imageUrl: '/assets/portfolio/wedding-card-sample-1.jpg',
    featured: true,
    topWork: false,
    visible: true,
  };

  const [formData, setFormData] = useState<Partial<PortfolioItem>>(initialForm);

  const fetchPortfolio = () => {
    setLoading(true);
    fetch('/api/admin/portfolio')
      .then((r) => r.json())
      .then((data) => setPortfolio(data.portfolio || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (result.success && result.url) {
        setFormData({ ...formData, imageUrl: result.url });
      } else {
        alert(result.error || 'Upload failed');
      }
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData(item);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setModalOpen(false);
        fetchPortfolio();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;
    try {
      const res = await fetch(`/api/admin/portfolio?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPortfolio(portfolio.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTopWork = async (item: PortfolioItem) => {
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, topWork: !item.topWork }),
      });
      if (res.ok) {
        setPortfolio(portfolio.map((p) => (p.id === item.id ? { ...p, topWork: !item.topWork } : p)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
            Portfolio &amp; Top Works
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Upload real printed work samples and mark items as &quot;Top Work&quot; to feature on the homepage.
          </p>
        </div>
        <button type="button" onClick={handleOpenAdd} className="btn btn-primary">
          <span>+ Add Portfolio Item</span>
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '32px', textAlign: 'center' }}>Loading portfolio...</div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {portfolio.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', height: '180px', backgroundColor: '#f1f5f9' }}>
                {/* eslint-disable-next-run @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.title_en}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '6px' }}>
                  {item.topWork && <span className="badge badge-top">⭐ Top Work</span>}
                  <span className="badge" style={{ backgroundColor: '#0f172a', color: '#fff' }}>
                    {item.category}
                  </span>
                </div>
              </div>

              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                    {item.title_en}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '10px' }}>
                    {item.title_mr}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                    {item.desc_en}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => handleToggleTopWork(item)}
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      backgroundColor: item.topWork ? '#fef3c7' : '#f1f5f9',
                      color: item.topWork ? '#b45309' : '#475569',
                      border: '1px solid #cbd5e1',
                    }}
                  >
                    {item.topWork ? '★ Top Work' : 'Make Top Work'}
                  </button>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 10px', fontSize: '0.8rem', color: '#b91c1c' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 110,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflowY: 'auto',
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '640px',
              width: '100%',
              padding: '32px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
              {editingItem ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
            </h3>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as PortfolioCategory })}
                    className="form-control"
                  >
                    <option value="visiting-cards">Visiting Cards</option>
                    <option value="wedding">Wedding Cards</option>
                    <option value="invitations">Invitations</option>
                    <option value="business-printing">Business Printing</option>
                    <option value="promotional">Promotional &amp; Flex</option>
                    <option value="packaging">Packaging &amp; Bags</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Flags</label>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                      <input
                        type="checkbox"
                        checked={formData.topWork}
                        onChange={(e) => setFormData({ ...formData, topWork: e.target.checked })}
                      />
                      <span>Top Work (Homepage)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                      <input
                        type="checkbox"
                        checked={formData.visible}
                        onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                      />
                      <span>Visible</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Image Upload / Preview */}
              <div className="form-group">
                <label className="form-label">Photograph / Mockup Image</label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {formData.imageUrl && (
                    <div style={{ width: '90px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                      {/* eslint-disable-next-run @next/next/no-img-element */}
                      <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/svg+xml"
                    onChange={handleFileUpload}
                  />
                  {uploadingImage && <span style={{ fontSize: '0.85rem', color: '#c25e2e' }}>Uploading...</span>}
                </div>
              </div>

              {/* Titles in EN, MR, HI */}
              <div className="form-group">
                <label className="form-label">English Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title_en || ''}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">मराठी नाव (Marathi Title)</label>
                  <input
                    type="text"
                    value={formData.title_mr || ''}
                    onChange={(e) => setFormData({ ...formData, title_mr: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">हिंदी शीर्षक (Hindi Title)</label>
                  <input
                    type="text"
                    value={formData.title_hi || ''}
                    onChange={(e) => setFormData({ ...formData, title_hi: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="form-group">
                <label className="form-label">English Description</label>
                <textarea
                  rows={2}
                  value={formData.desc_en || ''}
                  onChange={(e) => setFormData({ ...formData, desc_en: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save Portfolio Item
                </button>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
