'use client';

import React, { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data?.user?.email) setEmail(data.user.email);
      });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!currentPassword) {
      setError('Please provide your current password.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newEmail: email,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update credentials.');

      setMessage('Security credentials updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
          Admin Security &amp; Credentials
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Update the primary business administrator email and secure login password.
        </p>
      </div>

      {message && (
        <div style={{ padding: '14px', backgroundColor: '#f0fdf4', color: '#15803d', borderRadius: '6px', marginBottom: '20px', fontWeight: 600 }}>
          ✓ {message}
        </div>
      )}

      {error && (
        <div style={{ padding: '14px', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '6px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <form
        onSubmit={handleUpdate}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #e2e8f0',
          padding: '32px',
        }}
      >
        <div className="form-group">
          <label className="form-label">Admin Account Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>

        <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '24px 0' }} />

        <div className="form-group">
          <label className="form-label">Current Password (Required for confirmation) *</label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="form-control"
            placeholder="••••••••"
          />
        </div>

        <div className="form-group">
          <label className="form-label">New Password (Leave blank to keep existing)</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-control"
            placeholder="••••••••"
          />
        </div>

        {newPassword && (
          <div className="form-group">
            <label className="form-label">Confirm New Password *</label>
            <input
              type="password"
              required={Boolean(newPassword)}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control"
              placeholder="••••••••"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: '16px' }}
        >
          {loading ? 'Saving Security Settings...' : 'Update Admin Credentials'}
        </button>
      </form>
    </div>
  );
}
