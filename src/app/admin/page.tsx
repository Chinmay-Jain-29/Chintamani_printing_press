'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  newQuotes: number;
  totalQuotes: number;
  pendingReviews: number;
  totalReviews: number;
  totalServices: number;
  featuredServices: number;
  portfolioItems: number;
  topWorks: number;
  recentQuotes: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/quotes').then((r) => r.json()),
      fetch('/api/reviews').then((r) => r.json()),
      fetch('/api/content').then((r) => r.json()),
    ])
      .then(([quoteRes, reviewRes, contentRes]) => {
        const quotes = quoteRes.quotes || [];
        const reviews = reviewRes.reviews || [];
        const db = contentRes.database || {};

        const newQuotesCount = quotes.filter((q: any) => q.status === 'New').length;
        const pendingReviewsCount = reviews.filter((r: any) => r.status === 'pending').length;
        const services = db.services || [];
        const portfolio = db.portfolio || [];

        setStats({
          newQuotes: newQuotesCount,
          totalQuotes: quotes.length,
          pendingReviews: pendingReviewsCount,
          totalReviews: reviews.length,
          totalServices: services.length,
          featuredServices: services.filter((s: any) => s.featured).length,
          portfolioItems: portfolio.length,
          topWorks: portfolio.filter((p: any) => p.topWork || p.featured).length,
          recentQuotes: quotes.slice(0, 5),
        });
      })
      .catch((err) => console.error('Dashboard load error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <p>Loading Dashboard metrics...</p>
      </div>
    );
  }

  const cards = [
    {
      title: 'New Quote Requests',
      value: stats.newQuotes,
      sub: `${stats.totalQuotes} total inquiries`,
      badge: stats.newQuotes > 0 ? 'Requires Attention' : 'Up to date',
      badgeColor: stats.newQuotes > 0 ? '#b45309' : '#15803d',
      badgeBg: stats.newQuotes > 0 ? '#fef3c7' : '#f0fdf4',
      link: '/admin/quotes',
      icon: '📋',
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews,
      sub: `${stats.totalReviews} total customer reviews`,
      badge: stats.pendingReviews > 0 ? 'Needs Moderation' : 'All Moderated',
      badgeColor: stats.pendingReviews > 0 ? '#b45309' : '#15803d',
      badgeBg: stats.pendingReviews > 0 ? '#fef3c7' : '#f0fdf4',
      link: '/admin/reviews',
      icon: '⭐',
    },
    {
      title: 'Active Services',
      value: stats.totalServices,
      sub: `${stats.featuredServices} featured on homepage`,
      badge: 'Active Offerings',
      badgeColor: '#0369a1',
      badgeBg: '#f0f9ff',
      link: '/admin/services',
      icon: '🛠️',
    },
    {
      title: 'Portfolio Items',
      value: stats.portfolioItems,
      sub: `${stats.topWorks} curated top works`,
      badge: 'Visual Gallery',
      badgeColor: '#c25e2e',
      badgeBg: '#faefe9',
      link: '/admin/portfolio',
      icon: '🖼️',
    },
  ];

  return (
    <div>
      {/* Page Title & Welcome */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
          Overview &amp; Activity
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Welcome back to New Chintamani Printing Press administration. Manage customer inquiries, approve reviews, and customize content.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        {cards.map((c) => (
          <Link
            key={c.title}
            href={c.link}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: 'var(--shadow-sm)',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.8rem' }}>{c.icon}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: c.badgeBg,
                    color: c.badgeColor,
                  }}
                >
                  {c.badge}
                </span>
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', lineHeight: 1, marginBottom: '6px' }}>
                {c.value}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                {c.title}
              </div>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
              {c.sub} →
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Action Shortcuts */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          border: '1px solid #e2e8f0',
          marginBottom: '36px',
        }}
      >
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
          ⚡ Quick Management Shortcuts
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/admin/quotes" className="btn btn-primary btn-sm">
            <span>📋 View Quote Inbox ({stats.newQuotes} New)</span>
          </Link>
          <Link href="/admin/reviews" className="btn btn-secondary btn-sm">
            <span>⭐ Moderate Customer Reviews ({stats.pendingReviews} Pending)</span>
          </Link>
          <Link href="/admin/services" className="btn btn-secondary btn-sm">
            <span>🛠️ Add / Edit Services</span>
          </Link>
          <Link href="/admin/portfolio" className="btn btn-secondary btn-sm">
            <span>🖼️ Upload Portfolio Work</span>
          </Link>
          <Link href="/admin/business" className="btn btn-secondary btn-sm">
            <span>🏢 Update Address &amp; Contact</span>
          </Link>
          <Link href="/admin/branding" className="btn btn-secondary btn-sm">
            <span>🎨 Change Logo</span>
          </Link>
        </div>
      </div>

      {/* Recent Quotes Inbox Preview */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
            Latest Quote Inquiries
          </h2>
          <Link href="/admin/quotes" style={{ fontSize: '0.88rem', color: '#c25e2e', fontWeight: 700 }}>
            Open Full Inbox →
          </Link>
        </div>

        {stats.recentQuotes.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.9rem', padding: '16px 0' }}>
            No quote inquiries received yet.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>ID</th>
                  <th style={{ padding: '10px 12px' }}>Customer</th>
                  <th style={{ padding: '10px 12px' }}>Phone / WhatsApp</th>
                  <th style={{ padding: '10px 12px' }}>Service</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                  <th style={{ padding: '10px 12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentQuotes.map((q: any) => (
                  <tr key={q.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>
                      {q.id}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <strong>{q.customerName}</strong>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <a href={`tel:${q.phone}`} style={{ color: '#0f172a', textDecoration: 'underline' }}>
                        {q.phone}
                      </a>
                    </td>
                    <td style={{ padding: '12px' }}>{q.service}</td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: q.status === 'New' ? '#fef3c7' : '#f1f5f9',
                          color: q.status === 'New' ? '#b45309' : '#334155',
                        }}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <a
                        href={`https://wa.me/91${q.whatsapp || q.phone}?text=${encodeURIComponent(`Namaskar ${q.customerName}, this is Prakash Jain from New Chintamani Printing Press regarding your inquiry (${q.id}) for ${q.service}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-whatsapp btn-sm"
                        style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                      >
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
