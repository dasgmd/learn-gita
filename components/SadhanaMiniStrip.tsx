
import React, { useState, useMemo } from 'react';
import { format, subDays, parseISO, differenceInCalendarDays } from 'date-fns';
import { SadhnaRecord } from '../types';
import { Flame, Calendar, ChevronRight } from 'lucide-react';
import SadhnaCalendar from './SadhnaCalendar';

type DayStatus = 'green' | 'orange' | 'red' | 'cream';

interface SadhanaMiniStripProps {
    logs: SadhnaRecord[];
    currentStreak: number;
    longestStreak: number;
    onDateSelect?: (date: string) => void;
    t: (key: string) => string;
}

const getDayStatus = (
    dateStr: string,
    logsMap: Map<string, SadhnaRecord>,
    today: Date
): DayStatus => {
    const log = logsMap.get(dateStr);
    const todayStr = format(today, 'yyyy-MM-dd');

    // 1. Future dates → cream
    if (dateStr > todayStr) return 'cream';

    // 2. If no log exists (Today or Past) → Red
    if (!log) {
        return 'red';
    }

    // 3. Has entry - check punctuality
    const rawCreated = (log as any).createdAt || (log as any).created_at;

    if (rawCreated) {
        const entryDate = parseISO(log.date);

        // Convert UTC createdAt to user's local date string
        const subDate = new Date(rawCreated);
        const y = subDate.getFullYear();
        const m = String(subDate.getMonth() + 1).padStart(2, '0');
        const d = String(subDate.getDate()).padStart(2, '0');
        const submittedDateStr = `${y}-${m}-${d}`;

        // Punctual: submitted on same day (0) or next day (1) in local time
        if (daysDiff >= 0 && daysDiff <= 1) return 'green';

        // Late: submitted more than 1 day after
        return 'orange';
    }

    // No createdAt → treat as orange (late) for past dates to be safe
    return 'orange';
};

const statusColors: Record<DayStatus, { bg: string; text: string; ring: string }> = {
    green: { bg: 'bg-green-500', text: 'text-white', ring: 'ring-green-300' },
    orange: { bg: 'bg-orange-400', text: 'text-white', ring: 'ring-orange-300' },
    red: { bg: 'bg-red-400', text: 'text-white', ring: 'ring-red-300' },
    cream: { bg: 'bg-[#FFFDF0]', text: 'text-[#3D2B1F]/50', ring: 'ring-[#FFB800]/30' }
};

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SadhanaMiniStrip: React.FC<SadhanaMiniStripProps> = ({
    logs, currentStreak, longestStreak, onDateSelect, t
}) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const today = useMemo(() => new Date(), []);

    const logsMap = useMemo(() => {
        const map = new Map<string, SadhnaRecord>();
        logs.forEach(log => map.set(log.date, log));
        return map;
    }, [logs]);

    // Generate last 5 days (including today)
    const days = useMemo(() => {
        return Array.from({ length: 5 }, (_, i) => {
            const date = subDays(today, 4 - i); // oldest first → newest (today) last
            return {
                date,
                dateStr: format(date, 'yyyy-MM-dd'),
                dayNum: format(date, 'd'),
                dayName: dayNames[date.getDay()],
                isToday: i === 4
            };
        });
    }, [today]);

    return (
        <>
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#FFB800]/20 space-y-5">

                {/* Streak Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl shadow-sm transition-all duration-500 ${currentStreak > 0 ? 'bg-orange-100 text-[#FFB800] scale-110' : 'bg-gray-100 text-gray-400'}`}>
                            <Flame className={`w-8 h-8 ${currentStreak > 0 ? 'fill-current animate-pulse' : ''}`} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-serif text-2xl font-black text-[#3D2B1F] leading-tight">
                                    {currentStreak}
                                </h3>
                                <span className="text-sm font-bold text-[#3D2B1F]/60 uppercase tracking-widest">
                                    {t('day_streak') || (currentStreak === 1 ? 'Day Streak' : 'Day Streak')}
                                </span>
                            </div>
                            <p className="text-[10px] text-[#3D2B1F]/50 font-medium mt-0.5">
                                Best Effort: <span className="text-[#FFB800] font-bold">{longestStreak} days</span>
                                {currentStreak > 0 && (
                                    <span className="ml-2 text-green-500 font-bold">● Disciplined</span>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-bold text-[#FFB800] uppercase tracking-widest bg-[#FFB800]/10 px-3 py-1 rounded-full border border-[#FFB800]/20">
                            Lv {Math.floor(currentStreak / 7) + 1}
                        </span>
                    </div>
                </div>

                {/* 5-Day Strip */}
                <div className="flex items-center justify-center gap-2">
                    {days.map(({ dateStr, dayNum, dayName, isToday }) => {
                        const status = getDayStatus(dateStr, logsMap, today);
                        const colors = statusColors[status];
                        return (
                            <button
                                key={dateStr}
                                onClick={() => {
                                    if (status === 'red' || status === 'cream') {
                                        onDateSelect?.(dateStr);
                                    }
                                }}
                                className={`
                  relative flex flex-col items-center justify-center
                  w-14 h-16 rounded-2xl transition-all duration-200
                  ${colors.bg} ${colors.text}
                  ${isToday ? `ring-2 ${colors.ring} ring-offset-1 ring-offset-white` : ''}
                  ${status === 'red' || status === 'cream' ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'}
                  shadow-sm
                `}
                            >
                                <span className="text-[10px] font-bold uppercase opacity-70">{dayName}</span>
                                <span className="text-lg font-bold leading-tight">{dayNum}</span>
                                {isToday && (
                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FFB800] border-2 border-white"></span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Legend + Full Calendar Button */}
                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-[9px] text-[#3D2B1F]/40 font-bold">On-time</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                            <span className="text-[9px] text-[#3D2B1F]/40 font-bold">Late</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-400"></span>
                            <span className="text-[9px] text-[#3D2B1F]/40 font-bold">Missed</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCalendar(true)}
                        className="flex items-center gap-1 text-[10px] font-bold text-[#FFB800] hover:text-orange-600 transition-colors"
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        Full Calendar
                        <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Full Calendar Modal */}
            {showCalendar && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowCalendar(false)}
                            className="absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full bg-white shadow-lg border border-[#3D2B1F]/10 flex items-center justify-center text-[#3D2B1F]/60 hover:text-[#3D2B1F] hover:bg-gray-50 transition-colors text-sm font-bold"
                        >
                            ✕
                        </button>
                        <SadhnaCalendar logs={logs} onDateSelect={(date) => {
                            setShowCalendar(false);
                            onDateSelect?.(date);
                        }} />
                    </div>
                </div>
            )}
        </>
    );
};

export default SadhanaMiniStrip;
