import React from 'react';
import { motion } from 'framer-motion';

interface LevelInfo {
    currentLevel: { id: number; title: string; minStreak: number };
    nextLevel: { id: number; title: string; minStreak: number; reward?: string } | null;
    progress: number;
    daysRemaining: number;
}

interface LevelProgressBarProps {
    levelInfo: LevelInfo;
}

const LevelProgressBar: React.FC<LevelProgressBarProps> = ({ levelInfo }) => {
    const { currentLevel, nextLevel, progress, daysRemaining } = levelInfo;

    return (
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-clay/20 divine-shadow space-y-6 w-full animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-saffron to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white">
                        <div className="text-center">
                            <div className="text-[10px] uppercase font-bold tracking-tighter leading-none opacity-80">Level</div>
                            <div className="text-2xl font-bold leading-none">{currentLevel.id}</div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-serif text-xl font-bold text-deepBrown">
                            {currentLevel.title}
                        </h3>
                        <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">
                            Current Rank
                        </p>
                    </div>
                </div>

                {nextLevel && (
                    <div className="text-right hidden sm:block">
                        <div className="text-[10px] font-bold text-clay uppercase tracking-widest mb-1">Next: {nextLevel.title}</div>
                        <div className="text-sm font-bold text-deepBrown">{nextLevel.minStreak} Days Total</div>
                    </div>
                )}
            </div>

            <div className="space-y-3">
                <div className="relative h-4 w-full bg-cream rounded-full overflow-hidden border border-clay/10 p-0.5 shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-saffron to-orange-400 rounded-full shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)25%,transparent 25%,transparent 50%,rgba(255,255,255,0.2)50%,rgba(255,255,255,0.2)75%,transparent 75%,transparent)] bg-[length:20px_20px] animate-[progress-shine_2s_linear_infinite]"></div>
                    </motion.div>
                </div>

                <div className="flex justify-between items-center px-1">
                    <div className="text-[11px] font-bold text-charcoal/60 leading-relaxed italic">
                        {nextLevel ? (
                            <span>
                                "Only <span className="text-saffron font-bold">{daysRemaining} more days</span> to reach <span className="text-deepBrown font-bold">Level {nextLevel.id} ({nextLevel.title})</span>! Keep going!"
                            </span>
                        ) : (
                            <span className="text-green-600 font-bold">Maximum Level Achieved! You are a Devoted Seeker!</span>
                        )}
                    </div>
                    <div className="text-[10px] font-black text-saffron uppercase tracking-widest">
                        {Math.round(progress)}%
                    </div>
                </div>

                {nextLevel?.reward && progress >= 50 && (
                    <div className="bg-orange-50/50 border border-orange-100 p-3 rounded-2xl flex items-center gap-3 animate-pulse">
                        <div className="w-8 h-8 bg-saffron/20 rounded-full flex items-center justify-center text-saffron">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.125l3.75 3.75m0 0l3.75 3.75M15.75 7.875H4.125" />
                            </svg>
                        </div>
                        <div className="text-[10px] font-bold text-deepBrown/80">
                            Almost there! {daysRemaining} days remaining for your <span className="text-saffron italic">{nextLevel.reward}</span>.
                        </div>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes progress-shine {
          from { background-position: 0 0; }
          to { background-position: 40px 0; }
        }
      `}} />
        </div>
    );
};

export default React.memo(LevelProgressBar);
