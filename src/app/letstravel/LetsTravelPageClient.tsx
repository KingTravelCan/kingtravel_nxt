'use client';

import { useState } from 'react';
import Image from 'next/image';
import { adminLogin, verifyResetEmail, resetAdminPassword } from '@/actions/authActions';

export default function LetsTravelPageClient({ initialIdentity, initialLoginAuth }: { initialIdentity?: any; initialLoginAuth?: any }) {
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [flowType, setFlowType] = useState<'login' | 'forgot_password' | 'reset_password'>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

  const identity = initialIdentity || null;
  const loginAuth = initialLoginAuth || null;

  const logoSrc = identity?.logo || '/img/logo.png';
  const logoAlt = identity?.logoAlt || 'King Travel Logo';
  const bgImage = loginAuth?.backgroundImage;
  const footerText = loginAuth?.footerText || '© 2026 King Travel Can Ltd. All Rights Reserved.';

  const calculateStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^a-zA-Z\d]/.test(password)) strength += 1;

    if (password.length === 0) return { label: '', percent: 0, color: 'bg-transparent' };
    if (strength <= 1) return { label: 'Weak', percent: 25, color: 'bg-red-500', textColor: 'text-red-500' };
    if (strength === 2) return { label: 'Average', percent: 50, color: 'bg-orange-500', textColor: 'text-orange-500' };
    if (strength === 3) return { label: 'Normal', percent: 75, color: 'bg-yellow-500', textColor: 'text-yellow-500' };
    return { label: 'Strong', percent: 100, color: 'bg-green-500', textColor: 'text-green-500' };
  };

  const pwStrength = calculateStrength(passwordInput);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    const formData = new FormData(e.currentTarget);
    const res = await adminLogin(formData);
    if (res && !res.success) {
      setError(res.error || 'Login Failed');
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const res = await verifyResetEmail(formData);

    if (res && !res.success) {
      setError(res.error || 'Verification Failed');
      setLoading(false);
    } else {
      setResetEmail(email);
      setFlowType('reset_password');
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (passwordInput !== confirmPasswordInput) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('email', resetEmail);
    formData.append('password', passwordInput);

    const res = await resetAdminPassword(formData);
    if (res && !res.success) {
      setError(res.error || 'Password Reset Failed');
      setLoading(false);
    } else {
      setSuccessMsg(res.message || 'Password has been successfully reset.');
      setFlowType('login');
      setPasswordInput('');
      setConfirmPasswordInput('');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071310] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Image overlay if configured */}
      {bgImage ? (
        <div
          ref={(el) => {
            if (el && bgImage) {
              el.style.backgroundImage = `url(${bgImage})`;
            }
          }}
          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none"
        />
      ) : (
        <>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#DB9E30_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#004B39] rounded-full blur-[120px] opacity-40 pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gold rounded-full blur-[140px] opacity-15 pointer-events-none" />
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
              unoptimized={true}
              className="w-[210px] h-auto"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-gold/10 border border-[#DB9E30]/30 px-3 py-1 rounded-full text-[10px] font-bold text-gold uppercase tracking-widest mb-3">
            <span className="star w-2.5 h-2.5"></span>
            Management Portal
          </div>
          <h1 className="text-2xl font-serif font-normal text-[#FBF8F1] tracking-wide">
            {flowType === 'login' && 'Admin Portal Sign In'}
            {flowType === 'forgot_password' && 'Reset Password'}
            {flowType === 'reset_password' && 'Create New Password'}
          </h1>
          <p className="text-xs text-[#EAEAE4]/60 mt-1 font-light">
            {flowType === 'login' && 'Authorized access to King Travel Canada Operations'}
            {flowType === 'forgot_password' && 'Enter your registered email address to continue'}
            {flowType === 'reset_password' && 'Enter your new secure password below'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-950/70 text-red-400 font-semibold text-xs p-3.5 rounded-xl border border-red-500/50 mb-5 flex items-center gap-2 shadow-inner">
            <span className="text-sm">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="bg-green-950/70 text-green-400 font-semibold text-xs p-3.5 rounded-xl border border-green-500/50 mb-5 flex items-center gap-2 shadow-inner">
            <span className="text-sm">✓</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Dynamic Forms based on Flow Type */}
        {flowType === 'login' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 ${error ? 'text-red-400' : 'text-[#EAEAE4]'}`}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                className={`w-full px-4 py-3 text-sm bg-[#0c1a17] text-white rounded-xl outline-none transition placeholder:text-gray-500 ${error
                  ? 'border-2 border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  : 'border border-[#E4DAC0]/20 focus:ring-2 focus:ring-[#DB9E30] focus:border-[#DB9E30]'
                  }`}
                placeholder="user@kingtravelcan.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className={`block text-[11px] font-bold uppercase tracking-wider ${error ? 'text-red-400' : 'text-[#EAEAE4]'}`}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { setFlowType('forgot_password'); setError(null); setSuccessMsg(null); }}
                  className="text-[10px] font-bold text-gold hover:text-[#E7BE6E] transition-colors uppercase tracking-wider"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`w-full px-4 py-3 text-sm bg-[#0c1a17] text-white rounded-xl outline-none transition placeholder:text-gray-500 pr-10 ${error
                    ? 'border-2 border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    : 'border border-[#E4DAC0]/20 focus:ring-2 focus:ring-[#DB9E30] focus:border-[#DB9E30]'
                    }`}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#EAEAE4]/60 hover:text-gold transition p-1 text-sm focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <i className="fa-solid fa-eye"></i>
                  ) : (
                    <i className="fa-solid fa-eye-slash"></i>
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {passwordInput.length > 0 && (
                <div className="mt-3">
                  <div className="w-full bg-[#1A332E] h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${pwStrength.color}`} style={{ width: `${pwStrength.percent}%` }}></div>
                  </div>
                  <div className="flex justify-between items-end text-[10px] uppercase font-bold tracking-wider mt-1.5">
                    <span className={pwStrength.textColor}>{pwStrength.label}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold hover:bg-[#E7BE6E] text-[#132723] font-bold text-sm py-3.5 rounded-xl shadow-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Sign In to Portal →'}
              </button>
            </div>
          </form>
        )}

        {flowType === 'forgot_password' && (
          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div>
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 ${error ? 'text-red-400' : 'text-[#EAEAE4]'}`}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                className={`w-full px-4 py-3 text-sm bg-[#0c1a17] text-white rounded-xl outline-none transition placeholder:text-gray-500 ${error
                  ? 'border-2 border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  : 'border border-[#E4DAC0]/20 focus:ring-2 focus:ring-[#DB9E30] focus:border-[#DB9E30]'
                  }`}
                placeholder="Enter registered email"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold hover:bg-[#E7BE6E] text-[#132723] font-bold text-sm py-3.5 rounded-xl shadow-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mb-3"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
              <button
                type="button"
                onClick={() => { setFlowType('login'); setError(null); setSuccessMsg(null); }}
                className="w-full bg-transparent hover:bg-white/5 text-[#EAEAE4] border border-[#EAEAE4]/20 font-bold text-sm py-3.5 rounded-xl transition duration-200 flex items-center justify-center gap-2"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}

        {flowType === 'reset_password' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 text-[#EAEAE4]`}>
                New Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`w-full px-4 py-3 text-sm bg-[#0c1a17] text-white rounded-xl outline-none transition placeholder:text-gray-500 pr-10 border border-[#E4DAC0]/20 focus:ring-2 focus:ring-[#DB9E30] focus:border-[#DB9E30]`}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#EAEAE4]/60 hover:text-gold transition p-1 text-sm focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <i className="fa-solid fa-eye"></i>
                  ) : (
                    <i className="fa-solid fa-eye-slash"></i>
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {passwordInput.length > 0 && (
                <div className="mt-3">
                  <div className="w-full bg-[#1A332E] h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${pwStrength.color}`} style={{ width: `${pwStrength.percent}%` }}></div>
                  </div>
                  <div className="flex justify-between text-end text-[10px] uppercase font-bold tracking-wider mb-1.5">
                    <span className={pwStrength.textColor}>{pwStrength.label}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 ${confirmPasswordInput && passwordInput !== confirmPasswordInput ? 'text-red-400' : 'text-[#EAEAE4]'}`}>
                Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                required
                value={confirmPasswordInput}
                onChange={(e) => setConfirmPasswordInput(e.target.value)}
                className={`w-full px-4 py-3 text-sm bg-[#0c1a17] text-white rounded-xl outline-none transition placeholder:text-gray-500 ${confirmPasswordInput && passwordInput !== confirmPasswordInput
                  ? 'border-2 border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                  : 'border border-[#E4DAC0]/20 focus:ring-2 focus:ring-[#DB9E30] focus:border-[#DB9E30]'
                  }`}
                placeholder="••••••••••••"
              />
              {confirmPasswordInput && passwordInput !== confirmPasswordInput && (
                <p className="text-red-400 text-xs mt-1.5">Passwords do not match.</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || (confirmPasswordInput !== passwordInput)}
                className="w-full bg-gold hover:bg-[#E7BE6E] text-[#132723] font-bold text-sm py-3.5 rounded-xl shadow-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mb-3"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
              <button
                type="button"
                onClick={() => { setFlowType('login'); setError(null); setSuccessMsg(null); setPasswordInput(''); setConfirmPasswordInput(''); }}
                className="w-full bg-transparent hover:bg-white/5 text-[#EAEAE4] border border-[#EAEAE4]/20 font-bold text-sm py-3.5 rounded-xl transition duration-200 flex items-center justify-center gap-2"
              >
                ← Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer Text */}
      <div className="mt-6 relative z-10 text-center text-xs text-[#EAEAE4]/60 font-medium">
        {footerText}
      </div>
    </div>
  );
}
