'use client';

import React, { useState, useEffect } from 'react';
import { Review, ReviewStatus } from '@/lib/schema';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const fetchReviews = () => {
    setLoading(true);
    fetch('/api/reviews')
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: ReviewStatus) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setReviews(reviews.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, featured: !currentFeatured }),
      });
      if (res.ok) {
        setReviews(reviews.map((r) => (r.id === id ? { ...r, featured: !currentFeatured } : r)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review permanently?')) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(reviews.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    try {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingReview),
      });
      if (res.ok) {
        setReviews(reviews.map((r) => (r.id === editingReview.id ? editingReview : r)));
        setEditingReview(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = reviews.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
          Customer Reviews Moderation
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Approve or reject customer submitted reviews before they appear on the public website.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        {['all', 'pending', 'approved', 'rejected'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: statusFilter === st ? 700 : 500,
              backgroundColor: statusFilter === st ? '#0f172a' : '#ffffff',
              color: statusFilter === st ? '#ffffff' : '#475569',
              border: '1px solid #cbd5e1',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {st} ({reviews.filter((r) => (st === 'all' ? true : r.status === st)).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '32px', textAlign: 'center' }}>Loading reviews...</div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '48px',
            textAlign: 'center',
            border: '1px solid #e2e8f0',
            color: '#64748b',
          }}
        >
          No reviews in this category.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((r) => (
            <div
              key={r.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                    {r.customerName}
                  </div>
                  {r.location && (
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>• {r.location}</span>
                  )}
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    ({new Date(r.createdAt).toLocaleDateString()})
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      backgroundColor:
                        r.status === 'approved'
                          ? '#f0fdf4'
                          : r.status === 'pending'
                          ? '#fef3c7'
                          : '#fef2f2',
                      color:
                        r.status === 'approved'
                          ? '#15803d'
                          : r.status === 'pending'
                          ? '#b45309'
                          : '#b91c1c',
                    }}
                  >
                    {r.status}
                  </span>

                  {r.featured && (
                    <span className="badge badge-featured">Featured on Home</span>
                  )}
                </div>
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: i < r.rating ? '#b45309' : '#cbd5e1', fontSize: '1.1rem' }}>
                    ★
                  </span>
                ))}
              </div>

              {/* Review Text */}
              <p style={{ fontSize: '0.94rem', color: '#334155', lineHeight: 1.6, fontStyle: 'italic' }}>
                “{r.reviewText}”
              </p>

              {/* Moderation Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '14px',
                }}
              >
                <div style={{ display: 'flex', gap: '8px' }}>
                  {r.status !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(r.id, 'approved')}
                      className="btn btn-sm"
                      style={{ backgroundColor: '#15803d', color: '#fff' }}
                    >
                      ✓ Approve
                    </button>
                  )}

                  {r.status !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(r.id, 'rejected')}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#b91c1c' }}
                    >
                      ✕ Reject
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(r.id, r.featured)}
                    className="btn btn-secondary btn-sm"
                  >
                    {r.featured ? 'Remove from Homepage' : 'Feature on Homepage'}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setEditingReview(r)}
                    className="btn btn-secondary btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#b91c1c' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
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
          }}
          onClick={() => setEditingReview(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
              Edit Customer Review
            </h3>
            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  required
                  value={editingReview.customerName}
                  onChange={(e) => setEditingReview({ ...editingReview, customerName: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  value={editingReview.location || ''}
                  onChange={(e) => setEditingReview({ ...editingReview, location: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Rating (1 to 5)</label>
                <select
                  value={editingReview.rating}
                  onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                  className="form-control"
                >
                  {[5, 4, 3, 2, 1].map((st) => (
                    <option key={st} value={st}>{st} Stars</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Review Text</label>
                <textarea
                  rows={4}
                  required
                  value={editingReview.reviewText}
                  onChange={(e) => setEditingReview({ ...editingReview, reviewText: e.target.value })}
                  className="form-control"
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditingReview(null)} className="btn btn-secondary">
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
