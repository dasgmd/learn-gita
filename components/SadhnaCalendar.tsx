
import React, { useState, useMemo } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    addMonths,
    subMonths,
    isSameMonth,
    isSameDay,
    isAfter,
    parseISO,
    differenceInCalendarDays
} from 'date-fns';
import { SadhnaRecord } from '../types';
import { ChevronLeft, ChevronRight, Eye, Edit3 } from 'lucide-react';

type DateStatus = 'green' | 'orange' | 'red' | 'default';

interface SadhnaCalendarProps {
    logs: SadhnaRecord[];
    onDateSelect?: (date: string) => void;
}

const getDateStatus = (
    dateStr: string,
    logsMap: Map<string, SadhnaRecord>,
    today: Date
): DateStatus => {
    const date = parseISO(dateStr);

    // Future dates or today (if not yet filled) → default
    if (isAfter(date, today)) return 'default';

    const log = logsMap.get(dateStr);

    if (!log) {
        // Past date with no entry → red (missed)
        if (isSameDay(date, today)) return 'default';
        return 'red';
    }

    // Has an entry — check timeliness
    const rawCreated = (log as any).createdAt || (log as any).created_at;
    if (rawCreated) {
        const entryDate = parseISO(log.date);

        // Convert UTC createdAt to user's local date string
        const subDate = new Date(rawCreated);
        const y = subDate.getFullYear();
        const m = String(subDate.getMonth() + 1).padStart(2, '0');
        const d = String(subDate.getDate()).padStart(2, '0');
        const submittedDateStr = `${y}-${m}-${d}`;

        const submittedDate = parseISO(submittedDateStr);
        const daysDiff = differenceInCalendarDays(submittedDate, entryDate);

        if (daysDiff >= 0 && daysDiff <= 1) return 'green';  // On-time (same day or next day) in local time
        return 'orange';                     // Delayed (2+ days late)
    }

    return 'orange'; // If no created_at info, treat as delayed
};

const statusStyles: Record<DateStatus, string> = {
    green: 'bg-green-500 text-white shadow-green-200 shadow-md',
    orange: 'bg-orange-400 text-white shadow-orange-200 shadow-md',
    red: 'bg-red-400/80 text-white shadow-red-200 shadow-md',
    default: 'bg-transparent text-[#3D2B1F]/70'
};

const SadhnaCalendar: React.FC<SadhnaCalendarProps> = ({ logs, onDateSelect }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [tooltipLog, setTooltipLog] = useState<SadhnaRecord | null>(null);

    const today = useMemo(() => new Date(), []);

    // Build a map of date → log for O(1) lookups
    const logsMap = useMemo(() => {
        const map = new Map<string, SadhnaRecord>();
        logs.forEach(log => map.set(log.date, log));
        return map;
    }, [logs]);

    // Generate all calendar cells for the month
    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const calStart = startOfWeek(monthStart); // Sunday
        const calEnd = endOfWeek(monthEnd);

        const days: Date[] = [];
        let day = calStart;
        while (day <= calEnd) {
            days.push(day);
            day = addDays(day, 1);
        }
        return days;
    }, [currentMonth]);

    const handleDateClick = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const log = logsMap.get(dateStr);
        const status = getDateStatus(dateStr, logsMap, today);

        if (status === 'green' || status === 'orange') {
            // Show summary tooltip
            setTooltipLog(log || null);
            setSelectedDate(dateStr);
        } else if (status === 'red' || (status === 'default' && isSameDay(date, today))) {
            // Open form for this date
            setTooltipLog(null);
            setSelectedDate(null);
            if (onDateSelect) onDateSelect(dateStr);
        }
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-[#FFFDF0] rounded-[2rem] p-6 md:p-8 border border-[#FFB800]/20 shadow-sm space-y-6">

            {/* Header: Month Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
                    className="w-10 h-10 rounded-full border border-[#3D2B1F]/10 flex items-center justify-center hover:bg-[#FFB800]/10 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-[#3D2B1F]" />
                </button>
                <h3 className="font-serif text-xl font-bold text-[#3D2B1F]">
                    {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <button
                    onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
                    className="w-10 h-10 rounded-full border border-[#3D2B1F]/10 flex items-center justify-center hover:bg-[#FFB800]/10 transition-colors"
                >
                    <ChevronRight className="w-5 h-5 text-[#3D2B1F]" />
                </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1">
                {weekDays.map(day => (
                    <div key={day} className="text-center text-[10px] font-bold text-[#3D2B1F]/40 uppercase tracking-widest py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1.5">
                {calendarDays.map((day, i) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isToday = isSameDay(day, today);
                    const status = isCurrentMonth ? getDateStatus(dateStr, logsMap, today) : 'default';
                    const isSelected = selectedDate === dateStr;

                    return (
                        <button
                            key={i}
                            onClick={() => isCurrentMonth && handleDateClick(day)}
                            disabled={!isCurrentMonth}
                            className={`
                relative aspect-square rounded-xl flex items-center justify-center text-sm font-bold
                transition-all duration-200
                ${isCurrentMonth ? 'cursor-pointer hover:scale-110' : 'opacity-20 cursor-default'}
                ${statusStyles[status]}
                ${isToday && status === 'default' ? 'ring-2 ring-[#FFB800] ring-offset-2 ring-offset-[#FFFDF0]' : ''}
                ${isSelected ? 'ring-2 ring-[#3D2B1F] ring-offset-1 ring-offset-[#FFFDF0]' : ''}
              `}
                        >
                            {format(day, 'd')}
                            {isToday && status === 'default' && (
                                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FFB800]"></span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tooltip / Summary */}
            {tooltipLog && selectedDate && (
                <div className="bg-white rounded-2xl p-4 border border-[#3D2B1F]/10 shadow-sm space-y-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-[#FFB800]" />
                            <span className="text-xs font-bold text-[#3D2B1F]/60 uppercase tracking-widest">
                                {format(parseISO(selectedDate), 'dd MMM yyyy')}
                            </span>
                        </div>
                        <button onClick={() => { setTooltipLog(null); setSelectedDate(null); }} className="text-[#3D2B1F]/30 hover:text-[#3D2B1F] transition-colors text-xs font-bold">
                            ✕
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[#3D2B1F]/60 text-sm">Score</span>
                        <span className="font-bold text-[#FFB800] text-lg">{tooltipLog.score} <span className="text-xs text-[#3D2B1F]/30">/ 270</span></span>
                    </div>
                    {tooltipLog.createdAt && (
                        <p className="text-[10px] text-[#3D2B1F]/40">
                            Submitted on {format(parseISO(tooltipLog.createdAt), 'dd MMM yyyy, hh:mm a')}
                        </p>
                    )}
                </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 border-t border-[#3D2B1F]/5">
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="text-[10px] font-bold text-[#3D2B1F]/50 uppercase tracking-wider">On-time</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-orange-400"></span>
                    <span className="text-[10px] font-bold text-[#3D2B1F]/50 uppercase tracking-wider">Delayed</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="text-[10px] font-bold text-[#3D2B1F]/50 uppercase tracking-wider">Missed</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full border-2 border-[#FFB800]"></span>
                    <span className="text-[10px] font-bold text-[#3D2B1F]/50 uppercase tracking-wider">Today</span>
                </div>
            </div>
        </div>
    );
};

export default SadhnaCalendar;
