'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/logo/Logo';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPin = searchParams.get('pin') || '';

  const [token, setToken] = useState(initialPin);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Password reset failed.');

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Logo variant="compact" />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '16px' }}>
          Choose New Password
        </h2>
      </div>

      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '6px', fontSize: '0.88rem', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {success ? (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ fontSize: '2.5rem', color: '#15803d', marginBottom: '12px' }}>✓</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            Password Reset Successful!
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Redirecting you to the login screen...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#0f172a' }}>Recovery PIN</label>
            <input
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="form-control"
              placeholder="6-digit PIN"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#0f172a' }}>New Password (min 8 chars)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-control"
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#0f172a' }}>Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            {loading ? 'Updating Password...' : 'Save New Password'}
          </button>
        </form>
      )}

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link href="/admin/login" style={{ fontSize: '0.85rem', color: '#64748b' }}>
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        padding: '20px',
      }}
    >
      <Suspense fallback={<div style={{ color: '#fff' }}>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
