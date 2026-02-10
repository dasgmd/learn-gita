
import React, { useState, useRef, useEffect } from 'react';
import { getGitaInsight } from '../services/geminiService';
import { ChatMessage, Language } from '../types';

interface GitaChatProps {
  language: Language;
  t: (key: string) => string;
}

const GitaChat: React.FC<GitaChatProps> = ({ language, t }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const aiResponse = await getGitaInsight(userMsg, language);
    setMessages(prev => [...prev, { role: 'model', content: aiResponse }]);
    setIsTyping(false);
  };

  const suggestions = language === 'hi' 
    ? ["तनाव को कैसे संभालें?", "जीवन का उद्देश्य?", "धर्म क्या है?"]
    : ["How to handle stress?", "Purpose of life?", "What is Dharma?"];

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-3xl border border-clay/20 divine-shadow overflow-hidden">
      <div className="bg-deepBrown p-4 text-cream flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-saffron rounded-full flex items-center justify-center text-white text-xs">ॐ</div>
          <span className="font-serif font-bold">{t('chat_title')}</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-clay">{t('chat_subtitle')}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
             <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center text-saffron text-3xl">✦</div>
             <p className="text-charcoal/60 text-sm whitespace-pre-line">{t('chat_welcome')}</p>
             <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map(q => (
                  <button 
                    key={q}
                    onClick={() => setInput(q)}
                    className="text-xs bg-cream border border-clay/20 px-3 py-1.5 rounded-full hover:border-saffron transition-all"
                  >
                    {q}
                  </button>
                ))}
             </div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-saffron text-white rounded-tr-none' 
                : 'bg-cream text-charcoal rounded-tl-none border border-clay/20'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-cream text-clay p-3 rounded-2xl rounded-tl-none flex gap-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-75">.</span>
              <span className="animate-bounce delay-150">.</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-cream/30 border-t border-clay/10">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chat_placeholder')}
            className="w-full bg-white border border-clay/20 rounded-full py-3 px-6 pr-12 focus:outline-none focus:border-saffron text-sm transition-all"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-deepBrown text-white w-9 h-9 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default GitaChat;
