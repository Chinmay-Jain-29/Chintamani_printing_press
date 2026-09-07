'use client';

import React, { useState, useEffect } from 'react';
import { QuoteRequest, QuoteStatus } from '@/lib/schema';

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchQuotes = () => {
    setLoading(true);
    fetch('/api/quotes')
      .then((r) => r.json())
      .then((data) => setQuotes(data.quotes || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleStatusChange = async (id: string, newStatus: QuoteStatus) => {
    try {
      const res = await fetch('/api/quotes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setQuotes(quotes.map((q) => (q.id === id ? { ...q, status: newStatus } : q)));
        if (selectedQuote?.id === id) {
          setSelectedQuote({ ...selectedQuote, status: newStatus });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedQuote) return;
    setSavingNotes(true);
    try {
      const res = await fetch('/api/quotes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedQuote.id, internalNotes }),
      });
      if (res.ok) {
        setQuotes(quotes.map((q) => (q.id === selectedQuote.id ? { ...q, internalNotes } : q)));
        setSelectedQuote({ ...selectedQuote, internalNotes });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteQuote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quote record?')) return;
    try {
      const res = await fetch(`/api/quotes?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setQuotes(quotes.filter((q) => q.id !== id));
        if (selectedQuote?.id === id) setSelectedQuote(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredQuotes = quotes.filter((q) => {
    if (filter !== 'all' && q.status !== filter) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      return (
        q.customerName.toLowerCase().includes(s) ||
        q.phone.includes(s) ||
        q.service.toLowerCase().includes(s) ||
        q.id.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const statuses: QuoteStatus[] = ['New', 'Contacted', 'In Progress', 'Completed', 'Cancelled'];

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
          Quote Requests Inbox
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Manage customer inquiries, view job specifications, contact customers on WhatsApp, and track status.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['all', ...statuses].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: filter === st ? 700 : 500,
                backgroundColor: filter === st ? '#0f172a' : '#ffffff',
                color: filter === st ? '#ffffff' : '#475569',
                border: '1px solid #cbd5e1',
                cursor: 'pointer',
              }}
            >
              {st === 'all' ? 'All Requests' : st}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer, phone, or service..."
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #cbd5e1',
            fontSize: '0.9rem',
            width: '280px',
            backgroundColor: '#ffffff',
          }}
        />
      </div>

      {/* Main Grid: List + Detail Drawer */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedQuote ? '1fr 1fr' : '1fr', gap: '24px' }}>
        {/* Quotes Table */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center' }}>Loading quotes...</div>
          ) : filteredQuotes.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
              No quote requests match your filter.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>ID &amp; Date</th>
                    <th style={{ padding: '12px 16px' }}>Customer</th>
                    <th style={{ padding: '12px 16px' }}>Service</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((q) => {
                    const isSelected = selectedQuote?.id === q.id;
                    return (
                      <tr
                        key={q.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: isSelected ? '#f8fafc' : '#ffffff',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          setSelectedQuote(q);
                          setInternalNotes(q.internalNotes || '');
                        }}
                      >
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{q.id}</div>
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                            {new Date(q.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{q.customerName}</div>
                          <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{q.phone}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div>{q.service}</div>
                          {q.quantity && (
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Qty: {q.quantity}</div>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }} onClick={(e) => e.stopPropagation()}>
                          <select
                            value={q.status}
                            onChange={(e) => handleStatusChange(q.id, e.target.value as QuoteStatus)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              backgroundColor: q.status === 'New' ? '#fef3c7' : '#f1f5f9',
                              color: q.status === 'New' ? '#b45309' : '#1e293b',
                              border: '1px solid #cbd5e1',
                            }}
                          >
                            {statuses.map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '14px 16px' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <a
                              href={`https://wa.me/91${q.whatsapp || q.phone}?text=${encodeURIComponent(`Namaskar ${q.customerName}, Prakash Jain from New Chintamani Printing Press regarding your inquiry #${q.id} for ${q.service}.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-whatsapp btn-sm"
                              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                            >
                              WhatsApp
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuote(q.id)}
                              style={{ color: '#b91c1c', fontSize: '0.85rem', padding: '4px 8px' }}
                              title="Delete request"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quote Detail Drawer */}
        {selectedQuote && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #e2e8f0',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge badge-top" style={{ marginBottom: '6px' }}>
                  {selectedQuote.id}
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                  {selectedQuote.customerName}
                </h2>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Received: {new Date(selectedQuote.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQuote(null)}
                style={{ fontSize: '1.2rem', color: '#64748b', padding: '4px' }}
              >
                ✕
              </button>
            </div>

            {/* Direct Contact Actions */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/91${selectedQuote.whatsapp || selectedQuote.phone}?text=${encodeURIComponent(`Namaskar ${selectedQuote.customerName}, this is Prakash Jain from New Chintamani Printing Press regarding your quote #${selectedQuote.id}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm"
              >
                <span>💬 WhatsApp Customer</span>
              </a>
              <a href={`tel:${selectedQuote.phone}`} className="btn btn-secondary btn-sm">
                <span>📞 Call ({selectedQuote.phone})</span>
              </a>
              {selectedQuote.email && (
                <a href={`mailto:${selectedQuote.email}`} className="btn btn-secondary btn-sm">
                  <span>✉️ Email</span>
                </a>
              )}
            </div>

            {/* Specification details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem' }}>
              <div>
                <strong>Service Requested:</strong> {selectedQuote.service}
              </div>
              {selectedQuote.quantity && (
                <div>
                  <strong>Quantity:</strong> {selectedQuote.quantity}
                </div>
              )}
              {selectedQuote.sizeSpecification && (
                <div>
                  <strong>Size / Paper Specs:</strong> {selectedQuote.sizeSpecification}
                </div>
              )}
              <div>
                <strong>Preferred Contact Method:</strong> {selectedQuote.preferredContact}
              </div>
              {selectedQuote.requirements && (
                <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <strong>Customer Requirements:</strong>
                  <p style={{ marginTop: '4px', whiteSpace: 'pre-wrap', color: '#334155' }}>
                    {selectedQuote.requirements}
                  </p>
                </div>
              )}
            </div>

            {/* Internal Notes Editor */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>
                Internal Admin Notes
              </label>
              <textarea
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Add notes about pricing quoted, customer call outcome, paper availability..."
                className="form-control"
                style={{ fontSize: '0.88rem' }}
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="btn btn-dark btn-sm"
                style={{ marginTop: '8px' }}
              >
                {savingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
