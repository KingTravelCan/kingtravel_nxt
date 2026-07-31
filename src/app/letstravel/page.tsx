'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { adminLogin } from '@/actions/authActions';
import { getSiteIdentity, getLoginAuthSettings } from '@/actions/pageActions';

export default function LetsTravelPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [identity, setIdentity] = useState<any>(null);
  const [loginAuth, setLoginAuth] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    getSiteIdentity().then(data => {
      if (isMounted && data) setIdentity(data);
    });
    getLoginAuthSettings().then(data => {
      if (isMounted && data) setLoginAuth(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const logoSrc = identity?.logo || '/img/logo.png';
  const logoAlt = identity?.logoAlt || 'King Travel Logo';
  const bgImage = loginAuth?.backgroundImage;
  const footerText = loginAuth?.footerText || '© 2026 King Travel Can Ltd. All Rights Reserved.';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await adminLogin(formData);
    if (res && !res.success) {
      setError(res.error || 'Login Failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071310] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Image overlay if configured */}
      {bgImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      ) : (
        <>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#DB9E30_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#004B39] rounded-full blur-[120px] opacity-40 pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#DB9E30] rounded-full blur-[140px] opacity-15 pointer-events-none" />
        </>
      )}

      {/* Card Wrapper */}
      <div className="w-full max-w-md bg-[#132723]/95 backdrop-blur-md rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.7)] p-8 border border-[#DB9E30]/25 relative z-10">

        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={210}
              height={50}
              priority
              className="w-[210px] h-auto"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-[#DB9E30]/10 border border-[#DB9E30]/30 px-3 py-1 rounded-full text-[10px] font-bold text-[#DB9E30] uppercase tracking-widest mb-3">
            <span className="star w-2.5 h-2.5"></span>
            Management Portal
          </div>
          <h1 className="text-2xl font-serif font-normal text-[#FBF8F1] tracking-wide">
            Admin Portal Sign In
          </h1>
          <p className="text-xs text-[#EAEAE4]/60 mt-1 font-light">
            Authorized access to King Travel Canada Operations
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-950/70 text-red-400 font-semibold text-xs p-3.5 rounded-xl border border-red-500/50 mb-5 flex items-center gap-2 shadow-inner">
            <span className="text-sm">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 ${error ? 'text-red-400' : 'text-[#EAEAE4]'}`}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              className={`w-full px-4 py-3 text-sm bg-[#0c1a17] text-white rounded-xl outline-none transition placeholder:text-gray-500 ${
                error
                  ? 'border-2 border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  : 'border border-[#E4DAC0]/20 focus:ring-2 focus:ring-[#DB9E30] focus:border-[#DB9E30]'
              }`}
              placeholder="user@kingtravelcan.com"
            />
          </div>

          <div>
            <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 ${error ? 'text-red-400' : 'text-[#EAEAE4]'}`}>
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className={`w-full px-4 py-3 text-sm bg-[#0c1a17] text-white rounded-xl outline-none transition placeholder:text-gray-500 pr-10 ${
                  error
                    ? 'border-2 border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    : 'border border-[#E4DAC0]/20 focus:ring-2 focus:ring-[#DB9E30] focus:border-[#DB9E30]'
                }`}
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[#EAEAE4]/60 hover:text-[#DB9E30] transition p-1 text-sm focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <i className="fa-solid fa-eye"></i>
                ) : (
                  <i className="fa-solid fa-eye-slash"></i>
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#DB9E30] hover:bg-[#E7BE6E] text-[#132723] font-bold text-sm py-3.5 rounded-xl shadow-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal →'}
            </button>
          </div>
        </form>
      </div>

      {/* Footer Text */}
      <div className="mt-6 relative z-10 text-center text-xs text-[#EAEAE4]/60 font-medium">
        {footerText}
      </div>
    </div>
  );
}
