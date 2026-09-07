'use client';

import React, { useState, useEffect } from 'react';
import { Service, ServiceCategory } from '@/lib/schema';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const initialFormState: Partial<Service> = {
    name_en: '',
    name_mr: '',
    name_hi: '',
    desc_en: '',
    desc_mr: '',
    desc_hi: '',
    category: 'printing',
    icon: 'file-text',
    featured: false,
    comingSoon: false,
    visible: true,
  };

  const [formData, setFormData] = useState<Partial<Service>>(initialFormState);

  const fetchServices = () => {
    setLoading(true);
    fetch('/api/admin/services')
      .then((r) => r.json())
      .then((data) => setServices(data.services || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData(initialFormState);
    setModalOpen(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingService(srv);
    setFormData(srv);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setModalOpen(false);
        fetchServices();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices(services.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleVisible = async (srv: Service) => {
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...srv, visible: !srv.visible }),
      });
      if (res.ok) {
        setServices(services.map((s) => (s.id === srv.id ? { ...s, visible: !s.visible } : s)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (srv: Service) => {
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...srv, featured: !srv.featured }),
      });
      if (res.ok) {
        setServices(services.map((s) => (s.id === srv.id ? { ...s, featured: !s.featured } : s)));
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
            Services Manager
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Add, update, or hide printing and designing services. Manage English, Marathi, and Hindi translations.
          </p>
        </div>
        <button type="button" onClick={handleOpenAdd} className="btn btn-primary">
          <span>+ Add New Service</span>
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '32px', textAlign: 'center' }}>Loading services...</div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Name (EN / MR)</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Featured</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{s.name_en}</div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{s.name_mr}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: 600, color: '#475569' }}>
                      {s.category}
                    </span>
                    {s.comingSoon && <span style={{ marginLeft: '6px' }} className="badge badge-coming-soon">Soon</span>}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(s)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        backgroundColor: s.featured ? '#faefe9' : '#f1f5f9',
                        color: s.featured ? '#c25e2e' : '#64748b',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      {s.featured ? '★ Featured' : 'Normal'}
                    </button>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      type="button"
                      onClick={() => handleToggleVisible(s)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        backgroundColor: s.visible ? '#f0fdf4' : '#fef2f2',
                        color: s.visible ? '#15803d' : '#b91c1c',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      {s.visible ? 'Visible' : 'Hidden'}
                    </button>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(s)}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(s.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#b91c1c' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Service Modal */}
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
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ServiceCategory })}
                    className="form-control"
                  >
                    <option value="printing">Printing</option>
                    <option value="designing">Designing</option>
                    <option value="other">Other Services</option>
                    <option value="coming-soon">Coming Soon</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Flags</label>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      />
                      <span>Featured</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                      <input
                        type="checkbox"
                        checked={formData.comingSoon}
                        onChange={(e) => setFormData({ ...formData, comingSoon: e.target.checked })}
                      />
                      <span>Coming Soon</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Trilingual Names */}
              <div className="form-group">
                <label className="form-label">English Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name_en || ''}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  className="form-control"
                  placeholder="e.g. Wedding Cards Printing"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">मराठी नाव (Marathi Name)</label>
                  <input
                    type="text"
                    value={formData.name_mr || ''}
                    onChange={(e) => setFormData({ ...formData, name_mr: e.target.value })}
                    className="form-control"
                    placeholder="उदा. लग्नपत्रिका मुद्रण"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">हिंदी नाम (Hindi Name)</label>
                  <input
                    type="text"
                    value={formData.name_hi || ''}
                    onChange={(e) => setFormData({ ...formData, name_hi: e.target.value })}
                    className="form-control"
                    placeholder="उदा. शादी के कार्ड"
                  />
                </div>
              </div>

              {/* Trilingual Descriptions */}
              <div className="form-group">
                <label className="form-label">English Description</label>
                <textarea
                  rows={2}
                  value={formData.desc_en || ''}
                  onChange={(e) => setFormData({ ...formData, desc_en: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">मराठी माहिती (Marathi Desc)</label>
                  <textarea
                    rows={2}
                    value={formData.desc_mr || ''}
                    onChange={(e) => setFormData({ ...formData, desc_mr: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">हिंदी विवरण (Hindi Desc)</label>
                  <textarea
                    rows={2}
                    value={formData.desc_hi || ''}
                    onChange={(e) => setFormData({ ...formData, desc_hi: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save Service
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
