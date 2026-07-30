'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { adminLogout } from '@/actions/authActions';
import { getSiteIdentity } from '@/actions/pageActions';


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
  const [identity, setIdentity] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    getSiteIdentity().then(data => {
      if (isMounted && data) setIdentity(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);


  const logoSrc = identity?.logo || '/img/logo.png';
  const logoAlt = identity?.logoAlt || 'King Travel Canada Logo';

  return (
    <div className="flex h-screen overflow-hidden bg-[#1C1F26] font-sans">
      {/* ── Left Sidebar ── */}
      <aside className="w-[220px] min-w-[220px] bg-[#16181E] border-r border-white/5 flex flex-col p-6 px-3 gap-0 overflow-y-auto">
        {/* Brand */}
        <div className="px-2 pb-6 border-b border-white/5">
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={140}
            height={36}
            priority
            className="w-auto h-[36px] object-contain block"
          />
          <span className="mt-1.5 inline-block text-[9px] font-bold tracking-widest uppercase text-[#DB9E30] bg-[#DB9E30]/10 border border-[#DB9E30]/30 px-2 py-0.5 rounded-full">
            Admin Portal
          </span>
        </div>


        {/* Nav */}
        <nav className="flex-1 pt-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/admin/pages' && pathname.startsWith('/admin/pages'));
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ color: isActive ? '#004B39' : '#ffffff' }}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all ${isActive
                  ? 'font-bold bg-white shadow-md border-l-4 border-[#DB9E30] pl-2.5'
                  : 'font-medium hover:bg-white/15'
                  }`}
              >
                <span className="shrink-0" style={{ color: isActive ? '#004B39' : '#ffffff' }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-[#16181E] border-b border-white/5 px-6 py-3.5 flex items-center gap-4 shrink-0">

          {/* Right side */}
          <div className="flex items-center gap-4 ml-auto">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#004B39] bg-white border border-slate-200 rounded-full px-3.5 py-1.5 no-underline hover:bg-slate-100 transition-colors shadow-xs"
            >
              Live Site ↗
            </Link>

            {/* Bell */}
            <div className="relative cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-1.75 h-1.75 bg-emerald-500 rounded-full border-[1.5px] border-[#16181E]"></span>
            </div>

            {/* User */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-200">{user?.name || 'Administrator'}</div>
                <div className="text-[10px] text-white/40 capitalize">{user?.role?.replace('_', ' ') || 'Super Admin'}</div>
              </div>
              <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-br from-[#004B39] to-[#DB9E30] flex items-center justify-center font-extrabold text-xs text-white shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Main scrollable content — the white/light canvas */}
        <main className="flex-1 overflow-y-auto bg-[#F4F6FA] p-7 px-8 text-slate-800">
          {children}
        </main>
      </div>
    </div>
  );
}
