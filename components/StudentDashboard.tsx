import React, { useState, useEffect } from 'react';
import { Course, User, SadhnaRecord } from '../types';
import CourseCard from './CourseCard';
import LevelProgressBar from './LevelProgressBar';
import { sadhnaService } from '../services/sadhnaService';
import { festivalService } from '../services/festivalService';
import { Festival } from '../types';
import { differenceInCalendarDays, parseISO, format } from 'date-fns';
import { Bell, ChevronRight } from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  enrolledCourses: Course[];
  onViewCourse: (courseId: string) => void;
  t: (key: string) => string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, enrolledCourses, onViewCourse, t }) => {
  const [selectedRecord, setSelectedRecord] = useState<SadhnaRecord | null>(null);
  const [upcomingFestivals, setUpcomingFestivals] = useState<Festival[]>([]);

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const allFestivals = await festivalService.getUpcomingFestivals(5);
        // "Events occurring in the next 48 hours" or specifically "exactly 2 days away"
        // The prompt says: "If a festival is exactly 2 days away... 2-Day Nudge"
        // It also says: "checkUpcomingEvents(festivals) that filters events occurring in the next 48 hours to trigger the notification."
        // Let's use the helper from service or just inline logic.
        // We'll filter for visual display in the banner.
        setUpcomingFestivals(allFestivals);
      } catch (err) {
        console.error("Failed to fetch festivals", err);
      }
    };
    fetchFestivals();
  }, []);

  const nearFestivals = festivalService.checkUpcomingEvents(upcomingFestivals);
  const nudgeFestival = nearFestivals.find(f => {
    const days = differenceInCalendarDays(parseISO(f.date), new Date());
    return days === 2;
  }) || nearFestivals[0]; // Fallback to any near event for the banner if we want to show it within 48h too

  const formatAnswerKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const levelInfo = sadhnaService.getCurrentLevelInfo(user.currentStreak || 0);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* 2-Day Nudge Banner */}
      {nudgeFestival && differenceInCalendarDays(parseISO(nudgeFestival.date), new Date()) <= 2 && (
        <div className="bg-saffron/10 border border-saffron/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4">
            <div className="bg-saffron text-white p-3 rounded-full animate-pulse">
              <Bell size={24} />
            </div>
            <div>
              <h3 className="text-deepBrown font-bold text-lg">
                🔔 {nudgeFestival.name} is {differenceInCalendarDays(parseISO(nudgeFestival.date), new Date()) === 0 ? 'Today' : differenceInCalendarDays(parseISO(nudgeFestival.date), new Date()) === 1 ? 'Tomorrow' : `in ${differenceInCalendarDays(parseISO(nudgeFestival.date), new Date())} days`}!
              </h3>
              <p className="text-charcoal/60 text-sm">
                Prepare yourself for extra Seva.
              </p>
            </div>
          </div>
          <button
            onClick={() => window.location.hash = '#vaishnava-hub'} // Or use navigation prop if passed
            className="bg-saffron text-white px-6 py-2 rounded-full font-bold text-sm hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap"
          >
            View Seva
          </button>
        </div>
      )}

      {/* Level & Progression Nudge */}
      <LevelProgressBar levelInfo={levelInfo} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 md:p-12 rounded-[2.5rem] border border-clay/20 divine-shadow">
        <div className="space-y-2">
          <h1 className="font-serif text-4xl font-bold text-deepBrown">
            {t('welcome_back')}, <span className="text-saffron italic">{user.name}</span>
          </h1>
          <p className="text-charcoal/50">{t('dashboard_subtitle')}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-cream/50 px-6 py-4 rounded-2xl text-center border border-clay/10">
            <div className="text-2xl font-bold text-deepBrown">{enrolledCourses.length}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-clay">{t('stat_enrolled')}</div>
          </div>
          <div className="bg-saffron/10 px-6 py-4 rounded-2xl text-center border border-saffron/10">
            <div className="text-2xl font-bold text-saffron">85%</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-saffron/60">{t('stat_avg_progress')}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="font-serif text-3xl font-bold text-deepBrown border-l-4 border-saffron pl-4">
            {t('my_courses')}
          </h2>

          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {enrolledCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isEnrolled={true}
                  showProgress={true}
                  onEnroll={() => onViewCourse(course.id)}
                  t={t}
                />
              ))}
            </div>
          ) : (
            <div className="bg-cream/30 border-2 border-dashed border-clay/30 rounded-[2.5rem] p-16 text-center space-y-4">
              <div className="text-4xl text-clay opacity-50">✦</div>
              <p className="text-charcoal/50 italic">{t('no_courses_yet')}</p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <h2 className="font-serif text-3xl font-bold text-deepBrown border-l-4 border-saffron pl-4">
            {t('sadhna_history')}
          </h2>
          <div className="bg-white rounded-[2rem] border border-clay/20 divine-shadow overflow-hidden">
            {user.sadhnaHistory.length > 0 ? (
              <div className="divide-y divide-clay/10">
                {[...user.sadhnaHistory].reverse().map((record) => (
                  <button
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-saffron/5 transition-all group"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-deepBrown group-hover:text-saffron transition-colors">{record.date}</div>
                      <div className="flex items-center gap-1.5 text-[10px] text-clay font-bold uppercase tracking-widest">
                        <span>{t('view_details_tap') || 'View full record'}</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-saffron">{record.score}</div>
                      <div className="text-[9px] text-charcoal/30 uppercase font-black tracking-tighter">PTS / 270</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-charcoal/40 italic text-sm">
                {t('no_sadhna_history')}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-deepBrown/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden divine-shadow flex flex-col max-h-[85vh] animate-in zoom-in slide-in-from-bottom-4 duration-300">
            <div className="bg-deepBrown p-6 text-cream flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold">{t('report_details') || 'Offering Details'}</h3>
                <p className="text-[10px] uppercase tracking-widest text-clay">{selectedRecord.date}</p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="bg-saffron/5 border border-saffron/10 p-8 rounded-[2rem] text-center shadow-inner">
                <p className="text-[10px] font-bold text-saffron/60 uppercase tracking-widest mb-1">{t('total_score') || 'Offering Score'}</p>
                <div className="text-5xl font-bold text-saffron">
                  {selectedRecord.score} <span className="text-2xl text-charcoal/20 font-serif">/ 270</span>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-bold text-clay uppercase tracking-[0.2em] border-b border-clay/10 pb-2">{t('full_breakdown') || 'Itemized Wisdom'}</h4>
                <div className="space-y-5">
                  {Object.entries(selectedRecord.answers).map(([key, val]) => {
                    if (key === 'date' || key === 'name') return null;
                    const option = val as { label: string; points: number };
                    if (!option || typeof option !== 'object' || !('points' in option)) return null;

                    return (
                      <div key={key} className="flex justify-between items-start gap-6 group">
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-deepBrown group-hover:text-saffron transition-colors">{formatAnswerKey(key)}</div>
                          <div className="text-[11px] text-charcoal/60 leading-relaxed italic">"{option.label}"</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className={`text-[10px] font-black tracking-widest px-2.5 py-1 rounded-lg shadow-sm border ${option.points >= 25 ? 'bg-green-50 border-green-100 text-green-600' :
                            option.points >= 15 ? 'bg-blue-50 border-blue-100 text-blue-600' :
                              'bg-red-50 border-red-100 text-red-600'
                            }`}>
                            {option.points} PTS
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-8 bg-cream/30 border-t border-clay/10">
              <button
                onClick={() => setSelectedRecord(null)}
                className="w-full bg-deepBrown text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
              >
                {t('close_details') || 'Return to Dashboard'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
