import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    loginDemo
  } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter your email and password');
      return;
    }
    try {
      setLoading(true);
      await login(loginEmail, loginPassword);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!regName || !regEmail || !regPassword) {
      setErrorMsg('Please fill in all required fields');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await register(regName, regEmail, regPassword, regPhone);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setAuthModalOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E8E1D7] z-10 p-6 sm:p-8 my-8"
        >
          {/* Close */}
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full text-[#8C827A] hover:text-[#12100E] hover:bg-[#FAF8F5] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo & Header */}
          <div className="text-center mb-6">
            <span className="font-serif tracking-[0.25em] text-2xl uppercase font-normal text-[#12100E]">
              LUXORA
            </span>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8C827A] mt-1">
              Atelier Client Portal
            </p>
          </div>

          {/* Tab Controls */}
          <div className="flex rounded-xl bg-[#FAF8F5] p-1 border border-[#E8E1D7] mb-6">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                authModalMode === 'login'
                  ? 'bg-white text-[#12100E] shadow-xs'
                  : 'text-[#8C827A] hover:text-[#12100E]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthModalMode('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                authModalMode === 'register'
                  ? 'bg-white text-[#12100E] shadow-xs'
                  : 'text-[#8C827A] hover:text-[#12100E]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Quick 1-Click Demo Logins */}
          <div className="mb-6 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E1D7] space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C827A] flex items-center justify-between">
              <span>Instant Evaluator Demo Sign In</span>
              <span className="text-[#6D212F]">1-Click</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loginDemo('customer')}
                className="py-2 px-2.5 text-[11px] font-semibold rounded-lg bg-white border border-[#E8E1D7] hover:border-[#12100E] text-[#1E1B18] text-left transition-all"
              >
                <span className="block truncate">Aria Montgomery</span>
                <span className="text-[9px] text-[#8C827A]">Customer Demo</span>
              </button>
              <button
                type="button"
                onClick={() => loginDemo('admin')}
                className="py-2 px-2.5 text-[11px] font-semibold rounded-lg bg-[#12100E] text-white hover:bg-[#6D212F] text-left transition-all"
              >
                <span className="block truncate">Eleanor Vance</span>
                <span className="text-[9px] text-[#C8A97E]">Admin Atelier</span>
              </button>
            </div>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          {/* Forms */}
          {authModalMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E1D7] rounded-xl text-xs text-[#12100E] placeholder:text-[#8C827A] focus:outline-none focus:border-[#12100E]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#1E1B18]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('customer@luxora.com');
                      setLoginPassword('customer123');
                    }}
                    className="text-[11px] text-[#6D212F] hover:underline"
                  >
                    Auto-fill Demo
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E1D7] rounded-xl text-xs text-[#12100E] placeholder:text-[#8C827A] focus:outline-none focus:border-[#12100E]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#12100E] hover:bg-[#6D212F] text-white rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-50 mt-2"
              >
                <span>{loading ? 'Verifying...' : 'Sign In to Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Aria Montgomery"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-[#E8E1D7] rounded-xl text-xs text-[#12100E] focus:outline-none focus:border-[#12100E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="aria@example.com"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-[#E8E1D7] rounded-xl text-xs text-[#12100E] focus:outline-none focus:border-[#12100E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-[#E8E1D7] rounded-xl text-xs text-[#12100E] focus:outline-none focus:border-[#12100E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full px-3 py-2 bg-white border border-[#E8E1D7] rounded-xl text-xs text-[#12100E] focus:outline-none focus:border-[#12100E]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                    Confirm
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full px-3 py-2 bg-white border border-[#E8E1D7] rounded-xl text-xs text-[#12100E] focus:outline-none focus:border-[#12100E]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#12100E] hover:bg-[#6D212F] text-white rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-50 mt-2"
              >
                <span>{loading ? 'Creating Account...' : 'Create Atelier Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
