
import React, { useState } from 'react';
import { Course, Lesson, Language } from '../types';

interface CourseViewProps {
  course: Course;
  language: Language;
  onMarkComplete: (lessonId: string) => void;
  completedLessons: string[];
  t: (key: string) => string;
}

const CourseView: React.FC<CourseViewProps> = ({ course, language, onMarkComplete, completedLessons, t }) => {
  const [activeLessonId, setActiveLessonId] = useState(course.lessons?.[0]?.id || '');

  const activeLesson = course.lessons?.find(l => l.id === activeLessonId);
  const progress = course.lessons ? Math.round((completedLessons.length / course.lessons.length) * 100) : 0;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-cream">
      {/* Sidebar: Lesson Navigation */}
      <aside className="w-full lg:w-80 bg-white border-r border-clay/20 divine-shadow z-10 flex flex-col">
        <div className="p-6 border-b border-clay/10 bg-cream/30">
          <h2 className="font-serif text-xl font-bold text-deepBrown mb-4">{course.title}</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-clay uppercase tracking-widest">
              <span>{t('course_progress') || 'Progress'}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-clay/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-saffron transition-all duration-700" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-6 mb-2">
            <span className="text-[10px] font-black text-clay uppercase tracking-[0.2em]">{t('lessons') || 'Lessons'}</span>
          </div>
          <div className="space-y-1">
            {course.lessons?.map((lesson, idx) => {
              const isActive = lesson.id === activeLessonId;
              const isDone = completedLessons.includes(lesson.id);
              
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`w-full text-left px-6 py-4 flex items-center gap-4 transition-all ${
                    isActive ? 'bg-saffron/10 border-r-4 border-saffron' : 'hover:bg-cream/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    isDone ? 'bg-green-100 text-green-600' : (isActive ? 'bg-saffron text-white' : 'bg-clay/10 text-clay')
                  }`}>
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${isActive ? 'text-saffron' : 'text-deepBrown/80'}`}>
                      {language === 'hi' ? lesson.hindiTitle : lesson.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-white/50">
        {activeLesson ? (
          <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-10 animate-in fade-in duration-500">
            {/* YouTube Video Section */}
            <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden divine-shadow bg-black">
              <iframe
                src={activeLesson.videoUrl}
                title={activeLesson.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Shloka Callout */}
            {activeLesson.shloka && (
              <div className="relative group">
                <div className="absolute inset-0 bg-saffron/10 blur-2xl group-hover:bg-saffron/20 transition-all rounded-full"></div>
                <div className="relative bg-white border border-saffron/20 p-8 md:p-12 rounded-[2.5rem] divine-shadow text-center space-y-6">
                  <div className="text-saffron text-2xl">✦</div>
                  <p className="font-serif text-xl md:text-2xl text-deepBrown leading-relaxed italic">
                    {activeLesson.shloka.sanskrit}
                  </p>
                  <div className="h-px w-20 bg-saffron/30 mx-auto"></div>
                  <p className="text-charcoal/70 text-base md:text-lg leading-relaxed">
                    "{language === 'hi' ? activeLesson.shloka.hindiTranslation : activeLesson.shloka.translation}"
                  </p>
                </div>
              </div>
            )}

            {/* Study Material Text Area */}
            <article className="prose prose-stone max-w-none bg-white p-8 md:p-12 rounded-[2.5rem] border border-clay/10 divine-shadow">
              <h1 className="font-serif text-3xl font-bold text-deepBrown mb-6 border-l-4 border-saffron pl-4">
                {language === 'hi' ? activeLesson.hindiTitle : activeLesson.title}
              </h1>
              <div className="text-charcoal/80 text-lg leading-relaxed space-y-6">
                <p>{language === 'hi' ? activeLesson.hindiContent : activeLesson.content}</p>
                <div className="p-6 bg-cream rounded-2xl border border-clay/10 italic text-charcoal/60 text-sm">
                  {t('study_note') || 'Take a moment to reflect on these teachings before proceeding to the next lesson.'}
                </div>
              </div>
            </article>

            {/* Mark as Complete Button */}
            <div className="flex justify-center pt-8 pb-12">
              <button
                onClick={() => onMarkComplete(activeLesson.id)}
                disabled={completedLessons.includes(activeLesson.id)}
                className={`flex items-center gap-3 px-12 py-5 rounded-full font-bold text-lg transition-all active:scale-95 shadow-lg ${
                  completedLessons.includes(activeLesson.id)
                    ? 'bg-green-500 text-white cursor-default'
                    : 'bg-saffron text-white hover:bg-orange-500 hover:shadow-saffron/30'
                }`}
              >
                {completedLessons.includes(activeLesson.id) ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {t('completed') || 'Completed'}
                  </>
                ) : (
                  <>
                    {t('mark_complete') || 'Mark as Complete'}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-12 text-center text-clay">
            <div className="space-y-4">
              <div className="text-6xl">✦</div>
              <p className="font-serif text-2xl italic">{t('select_lesson') || 'Please select a lesson to begin.'}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseView;
