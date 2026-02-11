import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, ChevronUp, Droplets, Utensils, UtensilsCrossed } from 'lucide-react';
import { Festival } from '../types';
import SevaList from './SevaList';
import { format, parseISO, isToday, isTomorrow, differenceInCalendarDays } from 'date-fns';

interface FestivalCardProps {
    festival: Festival;
    userId: string;
    onPointsEarned?: (points: number) => void;
}

const FestivalCard: React.FC<FestivalCardProps> = ({ festival, userId, onPointsEarned }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const date = parseISO(festival.date);
    const isUrgent = differenceInCalendarDays(date, new Date()) <= 2 && differenceInCalendarDays(date, new Date()) >= 0;

    const getFastIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'no grains': return <UtensilsCrossed size={14} />;
            case 'water only': return <Droplets size={14} />;
            default: return <Utensils size={14} />;
        }
    };

    return (
        <motion.div
            layout
            className={`
        bg-white rounded-xl border overflow-hidden transition-all duration-300
        ${isUrgent ? 'border-saffron/40 shadow-md shadow-saffron/5' : 'border-stone-100/50 shadow-sm'}
      `}
        >
            <div
                className="p-4 cursor-pointer hover:bg-cream/10 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-start gap-4">
                    {/* Date Badge */}
                    <div className={`
            flex flex-col items-center justify-center w-14 h-14 rounded-lg border flex-shrink-0
            ${isUrgent
                            ? 'bg-saffron text-white border-saffron'
                            : 'bg-cream/20 text-deepBrown border-cream/50'
                        }
          `}>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-none mb-0.5">
                            {format(date, 'MMM')}
                        </span>
                        <span className="text-xl font-serif font-bold leading-none">
                            {format(date, 'd')}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-serif font-bold text-lg text-deepBrown leading-tight">
                                    {festival.name}
                                </h3>
                                <p className="text-xs text-charcoal/50 mt-1 line-clamp-1">
                                    {festival.description}
                                </p>
                            </div>
                            <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-stone-300"
                            >
                                <ChevronDown size={20} />
                            </motion.div>
                        </div>

                        {/* Meta Tags */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            <div className={`
                inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                ${festival.fast_type !== 'None' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}
              `}>
                                {getFastIcon(festival.fast_type)}
                                <span>{festival.fast_type}</span>
                            </div>

                            {isToday(date) && (
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-saffron/10 text-saffron text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                    Today
                                </span>
                            )}
                            {isTomorrow(date) && (
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                                    Tomorrow
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="px-4 pb-4 pt-0 border-t border-dashed border-stone-100">
                            <div className="pt-4">
                                {festival.significance && (
                                    <div className="mb-4 bg-cream/20 p-3 rounded-lg border border-cream/30">
                                        <h4 className="text-[10px] font-bold text-saffron uppercase tracking-widest mb-1">Significance</h4>
                                        <p className="text-sm text-charcoal/80 leading-relaxed font-light italic">
                                            "{festival.significance}"
                                        </p>
                                    </div>
                                )}

                                <SevaList
                                    festivalId={festival.id}
                                    userId={userId}
                                    onTaskCompleted={onPointsEarned}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default FestivalCard;
