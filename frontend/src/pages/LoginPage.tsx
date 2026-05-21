import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { loginUser } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

interface FormData { email: string; password: string; }

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await loginUser(data);
      login(res.token, res.user);
      toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`);
      navigate(res.user.role === 'ADMIN' ? '/admin' : '/search');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex pt-16 relative">

      {/* Dot pattern overlay — separate element so it doesn't override the gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      {/* Left panel — decorative branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-green-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-md px-12 text-center">
          <div className="w-24 h-24 bg-white/15 border-2 border-white/30 rounded-3xl flex items-center justify-center mx-auto mb-8 float-anim shadow-2xl shadow-black/20">
            <span className="text-5xl">🏡</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-4 drop-shadow-lg">LandVerifyCM</h2>
          <p className="text-green-100 leading-relaxed text-base font-medium">
            Secure, centralized land verification platform for Cameroon. Protecting your property rights.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {['500+ Parcels', '99% Uptime', 'Fraud-Free'].map((s) => (
              <div key={s} className="bg-white/15 border border-white/30 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-white font-bold text-sm drop-shadow">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vertical divider (desktop only) */}
      <div className="hidden lg:block w-px bg-white/10 self-stretch my-8 z-10" />

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="bg-white rounded-3xl shadow-2xl shadow-black/40 p-10 w-full max-w-md"
        >
          {/* Card header */}
          <div className="mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 mb-5">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-gray-900">{t.login.title}</h1>
            <p className="text-gray-500 text-sm mt-1">{t.login.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.login.email}</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                })}
                type="email"
                className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><span>⚠</span>{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">{t.login.password}</label>
                <Link to="/forgot-password" className="text-xs text-green-600 hover:text-green-500 font-semibold">
                  {t.login.forgotPassword}
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><span>⚠</span>{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? undefined : '0 8px 30px rgba(16,185,129,0.4)' }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className="w-full btn-primary py-4 rounded-xl text-sm font-bold mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? t.login.loading : t.login.btn}
            </motion.button>
          </form>

          {/* Switch to register */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {t.login.noAccount}{' '}
            <Link to="/register" className="text-green-600 font-bold hover:text-green-500 underline underline-offset-2">
              {t.login.registerLink}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
