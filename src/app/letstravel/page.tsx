'use client';

import { useState } from 'react';
import Image from 'next/image';
import { adminLogin } from '@/actions/authActions';

export default function LetsTravelPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await adminLogin(formData);
    if (res && !res.success) {
      setError(res.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#00271E] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Subtle Background Pattern & Glow */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#DB9E30_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#004B39] rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#DB9E30] rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="w-full max-w-md bg-[#004B39]/90 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 border border-[#DB9E30]/30 relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/img/logo-footer.png"
              alt="King Travel Logo"
              width={200}
              height={50}
              priority
              style={{ width: "auto", height: "auto" }}
            />
          </div>
          <div className="inline-flex items-center gap-2 bg-[#DB9E30]/10 border border-[#DB9E30]/30 px-3 py-1 rounded-full text-xs font-semibold text-[#DB9E30] uppercase tracking-wider mb-2">
            <span className="star" style={{ width: 12, height: 12 }}></span>
            Management Portal
          </div>
          <h1 className="text-2xl font-normal text-[#F5EFE1] font-serif tracking-wide">Admin Portal Sign In</h1>
          <p className="text-xs text-[#EAEAE4]/70 mt-1">Authorized access to King Travel Canada Operations</p>
        </div>

        {error && (
          <div className="bg-red-950/80 text-red-200 text-xs p-3.5 rounded-xl border border-red-500/40 mb-6 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#F5EFE1] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              defaultValue="admin@kingtravel.ca"
              className="w-full px-4 py-3 text-sm bg-[#132723] text-white border border-[#DB9E30]/40 rounded-xl focus:ring-2 focus:ring-[#DB9E30] focus:border-transparent outline-none transition placeholder:text-gray-500"
              placeholder="admin@kingtravel.ca"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F5EFE1] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              defaultValue="KingTravel2026!"
              className="w-full px-4 py-3 text-sm bg-[#132723] text-white border border-[#DB9E30]/40 rounded-xl focus:ring-2 focus:ring-[#DB9E30] focus:border-transparent outline-none transition placeholder:text-gray-500"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn w-full justify-center text-sm font-bold py-3.5 mt-2 rounded-xl shadow-lg border-none"
            style={{ background: 'var(--gold)', color: 'var(--ink)' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal →'}
          </button>
        </form>

        <div className="mt-8 text-center text-[11px] text-[#EAEAE4]/50 border-t border-[#DB9E30]/20 pt-4">
          Default Dev Admin: <code className="bg-[#132723] text-[#DB9E30] px-2 py-0.5 rounded border border-[#DB9E30]/30 font-mono">admin@kingtravel.ca</code>
        </div>
      </div>
    </div>
  );
}
