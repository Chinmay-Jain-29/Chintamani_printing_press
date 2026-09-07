'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo/Logo';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [generatedPin, setGeneratedPin] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed.');

      setMessage(data.message || 'Recovery key generated.');
      if (data.debugPin) {
        setGeneratedPin(data.debugPin);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

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
            Reset Admin Password
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Enter your admin email to receive a recovery PIN.
          </p>
        </div>

        {error && (
          <div style={{ padding: '12px', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '6px', fontSize: '0.88rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ padding: '14px', backgroundColor: '#f0fdf4', color: '#15803d', borderRadius: '6px', fontSize: '0.88rem', marginBottom: '16px' }}>
            {message}
            {generatedPin && (
              <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#dcfce7', borderRadius: '4px', fontWeight: 'bold' }}>
                Your Recovery PIN (Dev): <code style={{ fontSize: '1.1rem', color: '#0f172a' }}>{generatedPin}</code>
              </div>
            )}
            {!generatedPin && (
              <div style={{ marginTop: '10px', fontSize: '0.82rem', color: '#166534' }}>
                Check server logs or administrator messages for your secure 6-digit recovery PIN.
              </div>
            )}
          </div>
        )}

        {generatedPin ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link
              href={`/admin/reset-password?pin=${generatedPin}`}
              className="btn btn-primary"
              style={{ width: '100%', textAlign: 'center' }}
            >
              Proceed to Set New Password →
            </Link>
          </div>
        ) : message ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link
              href="/admin/reset-password"
              className="btn btn-primary"
              style={{ width: '100%', textAlign: 'center' }}
            >
              Enter Recovery PIN &amp; New Password →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#0f172a' }}>Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="admin@example.com"
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
              {loading ? 'Generating PIN...' : 'Send Recovery PIN'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/admin/login" style={{ fontSize: '0.85rem', color: '#64748b' }}>
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
