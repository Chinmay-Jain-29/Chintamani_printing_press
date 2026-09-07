'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/logo/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if current route is login/forgot/reset (these do not use the protected sidebar)
  const isAuthPage =
    pathname === '/admin/login' ||
    pathname === '/admin/forgot-password' ||
    pathname === '/admin/reset-password';

  useEffect(() => {
    if (isAuthPage) {
      setIsAuthenticated(true);
      return;
    }

    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          router.push('/admin/login');
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.authenticated) {
          setIsAuthenticated(true);
          setUserEmail(data.user?.email || 'admin@chintamani.com');
        } else {
          router.push('/admin/login');
        }
      })
      .catch(() => router.push('/admin/login'));
  }, [pathname, isAuthPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch {
      router.push('/admin/login');
    }
  };

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255,255,255,0.2)',
            borderTopColor: '#c25e2e',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ fontSize: '0.95rem', color: '#94a3b8' }}>Verifying Admin Security...</p>
        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard Overview', icon: '📊' },
    { href: '/admin/quotes', label: 'Quote Requests', icon: '📋' },
    { href: '/admin/reviews', label: 'Reviews Moderation', icon: '⭐' },
    { href: '/admin/services', label: 'Services Manager', icon: '🛠️' },
    { href: '/admin/portfolio', label: 'Portfolio & Top Works', icon: '🖼️' },
    { href: '/admin/business', label: 'Business Information', icon: '🏢' },
    { href: '/admin/branding', label: 'Branding & Logo', icon: '🎨' },
    { href: '/admin/homepage', label: 'Homepage Sections', icon: '🏠' },
    { href: '/admin/translations', label: 'Language & Content', icon: '🌐' },
    { href: '/admin/seo', label: 'SEO & Social Media', icon: '🔍' },
    { href: '/admin/settings', label: 'Admin Security', icon: '⚙️' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9', color: '#0f172a' }}>
      {/* Admin Sidebar */}
      <aside
        style={{
          width: '270px',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 95,
          transition: 'transform 0.25s ease',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          boxShadow: '4px 0 16px rgba(0,0,0,0.1)',
        }}
        className="admin-sidebar"
      >
        {/* Sidebar Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1e293b' }}>
          <Logo mode="dark" variant="compact" showTagline={false} />
          <div style={{ marginTop: '8px', fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Control Dashboard
          </div>
        </div>

        {/* Navigation links */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? '#c25e2e' : 'transparent',
                  color: isActive ? '#ffffff' : '#cbd5e1',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Logged in as:<br />
            <strong style={{ color: '#f8fafc' }}>{userEmail}</strong>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 94,
          }}
          onClick={() => setSidebarOpen(false)}
          className="admin-overlay"
        />
      )}

      {/* Main Admin Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }} className="admin-content-wrap">
        {/* Top Navbar */}
        <header
          style={{
            height: '64px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 80,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="admin-sidebar-toggle"
              aria-label="Toggle Sidebar"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '6px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                fontSize: '1.2rem',
              }}
            >
              ☰
            </button>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
              Admin Panel
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/"
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#475569',
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
              }}
            >
              <span>↗</span>
              <span>View Public Website</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '32px 24px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>

      <style jsx global>{`
        @media (min-width: 992px) {
          .admin-sidebar {
            transform: translateX(0) !important;
          }
          .admin-content-wrap {
            margin-left: 270px !important;
          }
          .admin-sidebar-toggle {
            display: none !important;
          }
          .admin-overlay {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
