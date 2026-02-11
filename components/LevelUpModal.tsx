import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Level {
    id: number;
    title: string;
    minStreak: number;
    reward?: string;
}

interface LevelUpModalProps {
    level: Level;
    onClose: () => void;
    nextLevel: Level | null;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onClose, nextLevel }) => {
    useEffect(() => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-deepBrown/80 backdrop-blur-md">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 20 }}
                    className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden divine-shadow border-4 border-saffron/30 p-10 text-center space-y-8 relative"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-saffron via-orange-500 to-saffron"></div>

                    <div className="space-y-4">
                        <motion.div
                            initial={{ rotate: -10 }}
                            animate={{ rotate: 10 }}
                            transition={{ repeat: Infinity, repeatType: "mirror", duration: 1.5 }}
                            className="text-6xl"
                        >
                            🎉
                        </motion.div>
                        <h2 className="font-serif text-4xl font-bold text-deepBrown">Congratulations!</h2>
                        <p className="text-charcoal/50 font-bold uppercase tracking-widest text-xs">You've reached a new milestone</p>
                    </div>

                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-saffron blur-3xl opacity-20 rounded-full animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-saffron to-orange-500 w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white shadow-2xl border-4 border-white">
                            <div className="text-center">
                                <div className="text-[10px] uppercase font-black leading-none opacity-80">Level</div>
                                <div className="text-4xl font-black">{level.id}</div>
                            </div>
                        </div>
                        <div className="mt-4 bg-orange-50 border border-orange-100 py-2 px-6 rounded-full inline-block">
                            <span className="font-serif text-2xl font-bold text-deepBrown">{level.title}</span>
                        </div>
                    </div>

                    <div className="bg-cream/50 p-6 rounded-3xl border border-clay/10 space-y-3">
                        <p className="text-sm text-charcoal/70 leading-relaxed italic">
                            "Your devotion is blossoming. By maintaining your {level.minStreak}-day streak, you are deepening your spiritual connection."
                        </p>
                        {nextLevel && (
                            <div className="pt-2 border-t border-clay/10">
                                <p className="text-[10px] font-bold text-saffron uppercase tracking-widest">
                                    {nextLevel.reward ? `Next Goal: ${nextLevel.reward}` : `Next Rank: ${nextLevel.title}`}
                                </p>
                                <p className="text-xs text-charcoal/40">Only {nextLevel.minStreak - level.minStreak} more days to go!</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full bg-deepBrown text-white py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-black transition-all active:scale-[0.98]"
                    >
                        Hare Krishna!
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LevelUpModal;
