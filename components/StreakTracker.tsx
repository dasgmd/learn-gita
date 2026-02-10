
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Lock, Flame, Gift } from 'lucide-react';

interface StreakTrackerProps {
    currentStreak: number;
    longestStreak: number;
}

const StreakTracker: React.FC<StreakTrackerProps> = ({ currentStreak, longestStreak }) => {
    const [showCelebration, setShowCelebration] = useState(false);
    const GOAL = 30;
    const progress = Math.min((currentStreak / GOAL) * 100, 100);
    const isUnlocked = currentStreak >= GOAL;

    useEffect(() => {
        if (isUnlocked && !showCelebration) {
            triggerConfetti();
            setShowCelebration(true);
        }
    }, [isUnlocked]);

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#FFB800', '#FF8C00', '#FFFFFF']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#FFB800', '#FF8C00', '#FFFFFF']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#FFB800]/20 space-y-6">

            {/* Header with Flame */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full ${currentStreak > 0 ? 'bg-orange-100 text-[#FFB800]' : 'bg-gray-100 text-gray-400'}`}>
                        <Flame className={`w-6 h-6 ${currentStreak > 0 ? 'fill-current animate-pulse' : ''}`} />
                    </div>
                    <div>
                        <h3 className="font-serif text-xl font-bold text-[#3D2B1F]">
                            {currentStreak} Day Streak
                        </h3>
                        <p className="text-xs text-[#3D2B1F]/60 font-medium">
                            Best: <span className="text-[#FFB800]">{longestStreak} days</span>
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold text-[#FFB800] uppercase tracking-widest bg-[#FFB800]/10 px-3 py-1 rounded-full">
                        Level {Math.floor(currentStreak / 7) + 1}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/40">
                    <span>Progress</span>
                    <span>{currentStreak} / {GOAL} Days</span>
                </div>
                <div className="h-4 bg-[#FFB800]/10 rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#FFB800] to-orange-500 relative"
                    >
                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                    </motion.div>
                </div>
                <p className="text-xs text-center text-[#3D2B1F]/50 italic">
                    {isUnlocked
                        ? "Offer Accepted! You have unlocked the divine frame."
                        : `Keep going! Only ${GOAL - currentStreak} more days to unlock your reward.`
                    }
                </p>
            </div>

            {/* Reward Preview */}
            <div className="relative group cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-[#FFB800]/30 hover:border-[#FFB800] transition-colors p-4 flex items-center gap-4">
                <div className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 transition-all duration-500 ${isUnlocked ? 'grayscale-0 scale-110' : 'grayscale opacity-70'}`}>
                    <img
                        src="https://images.unsplash.com/photo-1567606400326-805c6d33887c?auto=format&fit=crop&q=80&w=200"
                        alt="Radha Krishna Frame"
                        className="w-full h-full object-cover"
                    />
                    {!isUnlocked && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                            <Lock className="w-6 h-6 text-white/80" />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <h4 className="font-serif font-bold text-[#3D2B1F] group-hover:text-[#FFB800] transition-colors">
                        Radha Krishna Gold Frame
                    </h4>
                    <p className="text-xs text-[#3D2B1F]/60 line-clamp-2">
                        A divine digital frame for your dashboard. Unlock at 30 days.
                    </p>
                </div>
                {isUnlocked && (
                    <div className="bg-[#FFB800] text-white p-2 rounded-full shadow-lg animate-bounce">
                        <Gift className="w-5 h-5" />
                    </div>
                )}
            </div>

        </div>
    );
};

export default StreakTracker;
