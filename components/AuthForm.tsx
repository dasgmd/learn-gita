
import React, { useState } from 'react';
import { sadhnaService } from '../services/sadhnaService';

interface AuthFormProps {
  onLogin: () => void;
  t: (key: string) => string;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin, t }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        await sadhnaService.signIn(email, password);
      } else {
        await sadhnaService.signUp(email, password, name);
      }
      onLogin();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during your journey.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 border border-clay/20 divine-shadow animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-saffron rounded-full flex items-center justify-center text-white text-3xl mx-auto shadow-lg mb-4">ॐ</div>
        <h2 className="font-serif text-3xl font-bold text-deepBrown">{isLogin ? t('auth_login_title') : t('auth_signup_title')}</h2>
        <p className="text-charcoal/50 text-sm mt-2">{isLogin ? t('auth_login_subtitle') : t('auth_signup_subtitle')}</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold mb-6 border border-red-100 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {!isLogin && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-clay uppercase tracking-widest ml-1">{t('label_name')}</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-cream/30 border border-clay/20 rounded-2xl py-3 px-5 focus:outline-none focus:border-saffron focus:bg-white transition-all"
              placeholder="Arjuna"
            />
          </div>
        )}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-clay uppercase tracking-widest ml-1">{t('label_email')}</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-cream/30 border border-clay/20 rounded-2xl py-3 px-5 focus:outline-none focus:border-saffron focus:bg-white transition-all"
            placeholder="seek@truth.com"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-clay uppercase tracking-widest ml-1">{t('label_password')}</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-cream/30 border border-clay/20 rounded-2xl py-3 px-5 focus:outline-none focus:border-saffron focus:bg-white transition-all"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-deepBrown text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-saffron transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-3"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            isLogin ? t('btn_login') : t('btn_create_account')
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm font-semibold text-saffron hover:underline"
        >
          {isLogin ? t('auth_switch_signup') : t('auth_switch_login')}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
