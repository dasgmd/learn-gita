import React from 'react';
import { motion } from 'framer-motion';
import { Sopana, UserSopanaProgress } from '../types';
import { Lock, Star, Check } from 'lucide-react';

interface JourneyMapProps {
    sopanas: Sopana[];
    progress: UserSopanaProgress[];
    onSelectSopana: (sopana: Sopana) => void;
}

const JourneyMap: React.FC<JourneyMapProps> = ({ sopanas, progress, onSelectSopana }) => {
    // Helper to determine status
    const getStatus = (sopanaId: string, index: number) => {
        const p = progress.find(p => p.sopana_id === sopanaId);
        if (p && p.status === 'completed') return 'completed';
        // If it's the first one or previous one is completed, it's unlocked (current)
        if (index === 0) return 'current';
        const prevId = sopanas[index - 1]?.id;
        const prevProgress = progress.find(p => p.sopana_id === prevId);
        if (prevProgress?.status === 'completed') return 'current';

        return 'locked';
    };

    return (
        <div className="max-w-2xl mx-auto py-20 px-4 relative min-h-screen">

            {/* Winding Path Line (SVG) */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible" preserveAspectRatio="none">
                <path
                    d={generatePath(sopanas.length)}
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    strokeLinecap="round"
                />
                <path
                    d={generatePath(sopanas.length)} // You'd mask this to show only up to current progress
                    fill="none"
                    stroke="#FFE4B5" // Light saffron
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="10 20"
                    className="opacity-50"
                />
            </svg>

            <div className="relative z-10 flex flex-col gap-24 items-center">
                {sopanas.map((sopana, index) => {
                    const status = getStatus(sopana.id!, index);
                    const isLeft = index % 2 !== 0;

                    return (
                        <motion.div
                            key={sopana.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center w-full ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {/* Spacer for alignment */}
                            <div className="flex-1"></div>

                            {/* Node */}
                            <motion.button
                                onClick={() => status !== 'locked' && onSelectSopana(sopana)}
                                whileHover={{ scale: status !== 'locked' ? 1.1 : 1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-xl border-4 transition-all z-20
                  ${status === 'completed' ? 'bg-green-500 border-green-200 text-white' : ''}
                  ${status === 'current' ? 'bg-saffron border-orange-200 text-white animate-pulse-slow' : ''}
                  ${status === 'locked' ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed' : ''}
                `}
                            >
                                {status === 'completed' && <Check size={32} strokeWidth={3} />}
                                {status === 'current' && <Star size={32} className="fill-white" />}
                                {status === 'locked' && <Lock size={24} />}

                                {/* Number Badge */}
                                <div className="absolute -top-2 -right-2 bg-white text-[#4A3728] w-8 h-8 rounded-full border-2 border-clay/10 flex items-center justify-center font-black text-xs shadow-sm">
                                    {index + 1}
                                </div>
                            </motion.button>

                            {/* Label */}
                            <div className={`flex-1 px-6 ${isLeft ? 'text-right' : 'text-left'}`}>
                                <h3 className={`font-bold text-lg md:text-xl font-serif leading-tight ${status === 'locked' ? 'text-gray-400' : 'text-[#4A3728]'
                                    }`}>
                                    {sopana.title}
                                </h3>
                                {status === 'current' && (
                                    <span className="inline-block px-2 py-0.5 bg-saffron/10 text-saffron text-[10px] font-black uppercase tracking-widest rounded mt-1">
                                        Current Lesson
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// Simple winding path generator for demo purposes
// In a real app, you'd calculate exact coordinates based on node positions
function generatePath(count: number) {
    // This is a simplified "zigzag" path string
    // M startX startY Q controlX controlY endX endY ...
    // Ideally, you'd calculate this dynamically.
    // For now, let's just make a long vertical line to prevent errors, 
    // or simple curves if we knew the height.
    // Returning a straight line for simplicity in this implementation phase
    return `M 50% 0 L 50% ${count * 160}`;
}

export default JourneyMap;
