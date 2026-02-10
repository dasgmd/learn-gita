
import React from 'react';
import { ICONS } from '../constants';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-6">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <img 
          src="https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&q=80&w=1920" 
          alt="Ancient spiritual vibe" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 gradient-overlay"></div>
      </div>

      {/* Decorative Mandala (SVG concept) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-saffron/10 rounded-full animate-pulse -z-20"></div>

      <div className="max-w-4xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-saffron/10 text-saffron rounded-full text-sm font-semibold tracking-wide uppercase">
          <ICONS.Feather />
          <span>Wisdom for the Modern World</span>
        </div>
        
        <h1 className="font-serif text-5xl md:text-7xl text-deepBrown leading-tight">
          Awaken Your <br />
          <span className="text-saffron relative italic">
            Divine Potential
            <svg className="absolute -bottom-2 left-0 w-full h-2 text-clay/50" preserveAspectRatio="none" viewBox="0 0 100 10">
              <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </span>
        </h1>
        
        <p className="text-charcoal/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Embark on a structured, interactive journey through the timeless verses of the Bhagavad Gita. Experience ancient wisdom through modern technology.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button className="w-full sm:w-auto bg-saffron text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
            Begin Your Journey
          </button>
          <button className="w-full sm:w-auto bg-white border-2 border-clay/30 text-deepBrown px-10 py-4 rounded-full font-bold text-lg hover:border-saffron transition-all">
            Browse Courses
          </button>
        </div>

        <div className="flex items-center justify-center gap-8 pt-12 text-clay grayscale opacity-70">
           <div className="flex items-center gap-2">
             <ICONS.Lotus />
             <span className="text-sm font-semibold">Peace of Mind</span>
           </div>
           <div className="flex items-center gap-2">
             <ICONS.Book />
             <span className="text-sm font-semibold">Structured Study</span>
           </div>
           <div className="flex items-center gap-2">
             <ICONS.Heart />
             <span className="text-sm font-semibold">Self Realization</span>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
