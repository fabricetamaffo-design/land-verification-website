import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { registerUser } from '../services/auth.service';
import { useLang } from '../context/LanguageContext';
import FormError from '../components/FormError';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { t } = useLang();
  const navigate = useNavigate();

  const password = watch('password', '');

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const labels = ['', t.register.strengthWeak, t.register.strengthFair, t.register.strengthGood, t.register.strengthStrong];
    const colors = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-green-500'];
    return { score, label: labels[score], color: colors[score] };
  };

  const strength = getPasswordStrength(password);

  const onSubmit = async (data: FormData) => {
    setSubmitError('');
    setLoading(true);
    try {
      const res = await registerUser({ name: data.name, email: data.email, password: data.password });
      toast.success(res.message || 'Account created! Redirecting to login…');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      const message = e.response?.data?.message || 'Registration failed. Please try again.';
      setSubmitError(message);
      toast.error(message);
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
            <span className="text-5xl">🛡️</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-4 drop-shadow-lg">Join LandVerifyCM</h2>
          <p className="text-green-100 leading-relaxed text-base font-medium">
            Create a free account to access land verification, search records, and protect yourself from land fraud.
          </p>
          <div className="mt-10 space-y-3">
            {t.register.features.map((f) => (
              <div key={f} className="bg-white/15 border border-white/30 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center space-x-3">
                <div className="w-5 h-5 bg-green-400/40 rounded-full flex items-center justify-center text-green-200 text-xs flex-shrink-0 font-bold">✓</div>
                <span className="text-white font-medium text-sm">{f}</span>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-gray-900">{t.register.title}</h1>
            <p className="text-gray-500 text-sm mt-1">{t.register.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormError message={submitError} />
            {/* Full name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.register.name}</label>
              <input
                {...register('name', { required: 'Full name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
                className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                placeholder="e.g. Jean-Pierre Mbarga"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.register.email}</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                })}
                type="email"
                className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.register.password}</label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Minimum 8 characters' },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                  placeholder={t.register.passwordHint}
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
              {/* Strength meter */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? strength.color : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">{strength.label}</p>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.register.confirmPassword}</label>
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === watch('password') || 'Passwords do not match',
                })}
                type={showPassword ? 'text' : 'password'}
                className="w-full border-2 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                placeholder="Repeat password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword.message}</p>
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
              {loading ? t.register.loading : t.register.btn}
            </motion.button>
          </form>

          {/* Terms */}
          <p className="text-center text-xs text-gray-400 mt-4">
            {t.register.terms}{' '}
            <Link to="/about" className="text-green-600 hover:text-green-500 underline underline-offset-2">
              {t.register.termsLink}
            </Link>
          </p>

          {/* Switch to login */}
          <p className="text-center text-sm text-gray-500 mt-3">
            {t.register.hasAccount}{' '}
            <Link to="/login" className="text-green-600 font-bold hover:text-green-500 underline underline-offset-2">
              {t.register.loginLink}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
