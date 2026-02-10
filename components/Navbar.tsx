
import React, { useState } from 'react';
import { AppSection, Language, User } from '../types';

interface NavbarProps {
  onNavigate: (section: AppSection) => void;
  activeSection: AppSection;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  t: (key: string) => string;
  isLoggedIn: boolean;
  user: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection, language, onLanguageChange, t, isLoggedIn, user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: t('nav_explore'), section: AppSection.Explore },
    { label: t('nav_sadhna'), section: AppSection.Sadhna },
    { label: t('nav_about'), section: AppSection.About },
    { label: 'Setup Profile', section: AppSection.ProfileSetup }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-clay/30 py-4 px-6 md:px-12 flex items-center justify-between">
      <div
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => onNavigate(AppSection.Home)}
      >
        <div className="w-10 h-10 bg-saffron rounded-full flex items-center justify-center text-white font-serif text-2xl shadow-lg group-hover:scale-110 transition-transform">
          ॐ
        </div>
        <span className="text-deepBrown font-serif text-2xl font-bold tracking-tight">LearnGita</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <div className="flex bg-clay/10 rounded-full p-1 border border-clay/20 mr-4">
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'en' ? 'bg-saffron text-white shadow-sm' : 'text-charcoal/60 hover:text-charcoal'}`}
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange('hi')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'hi' ? 'bg-saffron text-white shadow-sm' : 'text-charcoal/60 hover:text-charcoal'}`}
          >
            हिन्दी
          </button>
        </div>

        {navItems.map((item) => (
          <button
            key={item.section}
            onClick={() => onNavigate(item.section)}
            className={`font-medium transition-colors hover:text-saffron ${activeSection === item.section ? 'text-saffron' : 'text-charcoal'
              }`}
          >
            {item.label}
          </button>
        ))}

        {isLoggedIn ? (
          <button
            onClick={() => onNavigate(AppSection.Dashboard)}
            className={`flex items-center gap-2 bg-clay/10 text-deepBrown px-6 py-2 rounded-full font-semibold border border-clay/20 transition-all ${activeSection === AppSection.Dashboard ? 'border-saffron text-saffron' : 'hover:border-saffron/30'
              }`}
          >
            <div className="w-5 h-5 bg-saffron/20 rounded-full flex items-center justify-center text-[10px] text-saffron">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {t('nav_dashboard_short') || 'Portal'}
          </button>
        ) : (
          <button
            onClick={() => onNavigate(AppSection.Auth)}
            className="bg-deepBrown text-cream px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-all shadow-md"
          >
            {t('nav_login')}
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 md:hidden">
        <button
          onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
          className="bg-clay/10 text-deepBrown px-3 py-1.5 rounded-lg text-xs font-bold border border-clay/20"
        >
          {language === 'en' ? 'HI' : 'EN'}
        </button>
        <button
          className="text-charcoal"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-cream border-b border-clay/30 p-6 flex flex-col gap-4 md:hidden shadow-xl animate-in slide-in-from-top">
          {navItems.map((item) => (
            <button
              key={item.section}
              onClick={() => {
                onNavigate(item.section);
                setIsOpen(false);
              }}
              className={`text-left text-lg font-medium ${activeSection === item.section ? 'text-saffron' : 'text-charcoal'
                }`}
            >
              {item.label}
            </button>
          ))}
          {!isLoggedIn ? (
            <button
              onClick={() => {
                onNavigate(AppSection.Auth);
                setIsOpen(false);
              }}
              className="bg-saffron text-white py-3 rounded-lg font-bold"
            >
              {t('btn_get_started')}
            </button>
          ) : (
            <button
              onClick={() => {
                onNavigate(AppSection.Dashboard);
                setIsOpen(false);
              }}
              className="bg-deepBrown text-white py-3 rounded-lg font-bold"
            >
              {t('nav_dashboard')}
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
