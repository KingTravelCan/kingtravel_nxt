'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { adminLogout } from '@/actions/authActions';

interface AdminLayoutProps {
  children: React.ReactNode;
  user: { name: string; role: string } | null;
}

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: 'CRM Enquiries',
    href: '/admin/enquiries',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: 'Packages',
    href: '/admin/packages',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      </svg>
    ),
  },
  {
    label: 'Saudi Visas',
    href: '/admin/visas',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    label: 'Pages',
    href: '/admin/pages',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children, user }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#1C1F26', fontFamily: 'inherit' }}>
      {/* ── Left Sidebar ── */}
      <aside style={{
        width: 220,
        minWidth: 220,
        background: '#16181E',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 12px',
        gap: 0,
        overflowY: 'auto',
      }}>
        {/* Brand */}
        <div style={{ padding: '0 8px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Image
            src="/img/logo-footer.png"
            alt="King Travel"
            width={140}
            height={36}
            priority
            style={{ width: 'auto', height: 36, objectFit: 'contain', display: 'block' }}
          />
          <span style={{
            marginTop: 6,
            display: 'inline-block',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#DB9E30',
            background: 'rgba(219,158,48,0.12)',
            border: '1px solid rgba(219,158,48,0.3)',
            padding: '2px 8px',
            borderRadius: 99,
          }}>
            Admin Portal
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/admin/pages' && pathname.startsWith('/admin/pages'));
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: 'none',
                  color: isActive ? '#0F172A' : 'rgba(255,255,255,0.55)',
                  background: isActive ? '#ffffff' : 'transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ color: isActive ? '#0F172A' : 'rgba(255,255,255,0.4)', flexShrink: 0 }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-3">
          <form action={adminLogout}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-500 hover:text-red-400 bg-red-500/10 transition-colors cursor-pointer text-left border border-red-500 bg-transparent"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log Out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Right Panel ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Header */}
        <header style={{
          background: '#16181E',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexShrink: 0,
        }}>
          {/* Search */}
          <div style={{ flex: 1, maxWidth: 420, position: 'relative' }}>
            <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search something..."
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 99,
                padding: '8px 14px 8px 34px',
                color: '#e2e8f0',
                fontSize: 12,
                outline: 'none',
              }}
            />
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' }}>
            <Link
              href="/"
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.55)',
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 99,
                padding: '6px 14px',
              }}
            >
              Live Site ↗
            </Link>

            {/* Bell */}
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span style={{ position: 'absolute', top: -2, right: -2, width: 7, height: 7, background: '#10B981', borderRadius: '50%', border: '1.5px solid #16181E' }}></span>
            </div>

            {/* User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 12, borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>{user?.name || 'Administrator'}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ') || 'Super Admin'}</div>
              </div>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #004B39, #DB9E30)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 13,
                color: '#fff',
                flexShrink: 0,
              }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Main scrollable content — the white/light canvas */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          background: '#F4F6FA',
          padding: '28px 32px',
          color: '#1e293b',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
