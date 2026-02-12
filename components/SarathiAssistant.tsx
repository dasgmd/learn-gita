import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SarathiProps {
    message?: string;
    mood?: 'happy' | 'neutral' | 'guiding' | 'celebrating';
    visible?: boolean;
}

const SarathiAssistant: React.FC<SarathiProps> = ({ message, mood = 'neutral', visible = true }) => {
    const [showBubble, setShowBubble] = useState(false);

    useEffect(() => {
        if (message) {
            setShowBubble(true);
            const timer = setTimeout(() => setShowBubble(false), 8000); // Auto-hide message after 8s
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!visible) return null;

    const getEmoji = () => {
        switch (mood) {
            case 'happy': return '🕉️';
            case 'guiding': return '🙏';
            case 'celebrating': return '🐚';
            default: return '🪷';
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none">
            <AnimatePresence>
                {showBubble && message && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        className="bg-white p-4 rounded-2xl rounded-br-none shadow-xl border-2 border-saffron/20 max-w-xs pointer-events-auto relative"
                    >
                        <button
                            onClick={() => setShowBubble(false)}
                            className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1 hover:bg-red-200"
                        >
                            <X size={12} />
                        </button>
                        <p className="text-[#4A3728] text-sm font-medium leading-relaxed">
                            {message}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowBubble(!showBubble)} // Toggle repetition of message
                className="bg-gradient-to-br from-saffron to-orange-500 w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 border-white cursor-pointer pointer-events-auto relative overflow-hidden"
            >
                <span role="img" aria-label="Sarathi">{getEmoji()}</span>
                <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
            </motion.div>

            {/* Name Tag */}
            <div className="bg-[#4A3728] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-md -mt-2 z-10">
                Sarathi
            </div>
        </div>
    );
};

export default SarathiAssistant;
