
import React from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
  isEnrolled?: boolean;
  showProgress?: boolean;
  t: (key: string) => string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll, isEnrolled, showProgress, t }) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-clay/20 divine-shadow hover:-translate-y-1 transition-all group flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.cover_image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-saffron uppercase tracking-widest shadow-sm">
          {course.level}
        </div>
      </div>
      <div className="p-6 space-y-4 flex flex-col flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-serif text-xl font-bold text-deepBrown">{course.title}</h3>
          <span className="text-[10px] text-charcoal/40 font-bold uppercase tracking-wider">{course.duration}</span>
        </div>
        <p className="text-charcoal/70 text-sm leading-relaxed line-clamp-2">
          {course.description}
        </p>

        {showProgress && course.progress !== undefined && (
          <div className="mt-2 space-y-2">
            <div className="flex justify-between text-xs font-bold text-charcoal/50">
              <span>{t('course_progress')}</span>
              <span>{course.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-cream rounded-full overflow-hidden">
              <div
                className="h-full bg-saffron transition-all duration-1000"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-auto pt-4">
          {isEnrolled ? (
            <button
              onClick={() => onEnroll && onEnroll(course.id)}
              className="w-full bg-cream text-deepBrown border border-clay/20 py-2.5 rounded-xl font-bold text-sm hover:bg-clay/10 transition-all shadow-sm active:scale-95"
            >
              {t('view_lessons') || 'View Lessons'}
            </button>
          ) : (
            <button
              onClick={() => onEnroll && onEnroll(course.id)}
              className="w-full bg-deepBrown text-cream py-2.5 rounded-xl font-bold text-sm hover:bg-saffron transition-all shadow-md active:scale-95"
            >
              {t('btn_enroll_now')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CourseCard);
