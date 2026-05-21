import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { changePassword } from '../services/auth.service';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<PasswordForm>();

  const onSubmit = async (data: PasswordForm) => {
    setLoading(true);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      toast.success(t.profile.successMsg);
      reset();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || 'Password change failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Profile card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-8 py-10">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-400 rounded-3xl flex items-center justify-center text-green-900 font-black text-3xl shadow-xl flex-shrink-0">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white">{user?.name}</h1>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                  <span className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    user?.role === 'ADMIN'
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                      : 'bg-green-400/20 text-green-300 border border-green-400/30'
                  }`}>
                    {user?.role === 'ADMIN' ? '⭐ Admin' : '👤 User'}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: t.profile.name, value: user?.name || '—' },
                { label: t.profile.email, value: user?.email || '—' },
                { label: t.profile.role, value: user?.role || '—' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">{label}</p>
                  <p className="text-gray-900 font-bold text-sm truncate">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Change password */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-black text-gray-900 text-xl flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {t.profile.changePassword}
                </h2>
                <p className="text-gray-400 text-sm mt-1">{t.profile.passwordSectionHint}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                title={showPasswords ? t.profile.hidePasswords : t.profile.showPasswords}
              >
                {showPasswords ? (
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

            <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-4">
              {[
                { name: 'currentPassword' as const, label: t.profile.currentPassword, placeholder: 'Current password' },
                { name: 'newPassword' as const, label: t.profile.newPassword, placeholder: 'New password (min 8 chars)' },
                { name: 'confirmPassword' as const, label: t.profile.confirmPassword, placeholder: 'Repeat new password' },
              ].map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                  <div className="relative">
                    <input
                      {...register(name, {
                        required: 'This field is required',
                        ...(name === 'newPassword' ? { minLength: { value: 8, message: 'Minimum 8 characters' } } : {}),
                        ...(name === 'confirmPassword' ? { validate: (val) => val === watch('newPassword') || 'Passwords do not match' } : {}),
                      })}
                      type={showPasswords ? 'text' : 'password'}
                      className="input-field"
                      placeholder={placeholder}
                    />
                  </div>
                  {errors[name] && <p className="text-red-500 text-xs mt-1.5">{errors[name]?.message}</p>}
                </div>
              ))}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="btn-primary px-8 py-3 rounded-xl text-sm flex items-center gap-2 disabled:opacity-60"
              >
                {loading && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                {loading ? t.profile.updating : t.profile.updateBtn}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
