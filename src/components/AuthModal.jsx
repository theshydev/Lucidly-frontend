import React, { useState } from 'react';
import { X, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import logoImg from '../../assets/lucidly-logo.png';

export default function AuthModal({ mode: initialMode = 'login', onClose, onSuccess, isDark }) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const dm = isDark;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) { setError('Please enter your name'); setLoading(false); return; }
        await signup(name, email, password);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
    dm
      ? 'bg-[#090514] text-slate-200 border-indigo-900/50 placeholder-indigo-300/30'
      : 'bg-gray-50 text-gray-800 border-gray-300 placeholder-gray-400'
  }`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={`relative w-full max-w-md rounded-3xl shadow-2xl border p-8 ${
          dm
            ? 'bg-[#0d081f] border-indigo-900/40 shadow-indigo-900/30'
            : 'bg-white border-gray-200'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className={`absolute top-5 right-5 p-1.5 rounded-full transition-colors ${dm ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}>
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-6">
            <img src={logoImg} alt="Lucidly" className="w-8 h-8 rounded-full" onError={e => { e.target.style.display='none'; }} />
            <span className="font-bold text-xl tracking-tight text-white">Lucidly</span>
          </div>
          <h2 className={`text-2xl font-bold mb-1 ${dm ? 'text-white' : 'text-gray-900'}`}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className={`text-sm ${dm ? 'text-indigo-300/60' : 'text-gray-500'}`}>
            {mode === 'login' ? 'Sign in to your sanctuary' : 'Start your journey to clarity'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${dm ? 'text-indigo-300/70' : 'text-gray-600'}`}>Your name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Jane Doe" required />
            </div>
          )}
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${dm ? 'text-indigo-300/70' : 'text-gray-600'}`}>Email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" required />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${dm ? 'text-indigo-300/70' : 'text-gray-600'}`}>Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className={`${inputClass} pr-12`} placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'} required minLength={6} />
              <button type="button" onClick={() => setShowPass(p => !p)} className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 ${dm ? 'text-indigo-400/60 hover:text-indigo-300' : 'text-gray-400 hover:text-gray-600'}`}>
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${loading ? 'opacity-60 cursor-not-allowed' : ''} bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400 shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]`}>
            {loading ? (mode === 'login' ? 'Signing in…' : 'Creating account…') : (mode === 'login' ? 'Sign in' : 'Create account')}
          </button>
        </form>

        <p className={`mt-6 text-center text-sm ${dm ? 'text-indigo-300/50' : 'text-gray-500'}`}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            {mode === 'login' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
