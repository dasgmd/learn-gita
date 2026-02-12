import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { courseService } from '../services/courseService';
import { Course, Sopana, UserSopanaProgress, AppSection } from '../types';
import CourseOverview from './CourseOverview';
import JourneyMap from './JourneyMap';
import SarathiAssistant from './SarathiAssistant';
import { ArrowLeft, Check, ChevronRight, HelpCircle } from 'lucide-react';

interface CourseViewProps {
  course: Course;
  language: string;
  onMarkComplete: (lessonId: string) => void;
  completedLessons: string[];
  t: (key: string) => string;
  onNavigate: (section: AppSection, id?: string) => void;
}

const CourseView: React.FC<CourseViewProps> = ({ course, language, onMarkComplete, completedLessons, t, onNavigate }) => {
  // const { slug } = useParams<{ slug: string }>(); // REMOVED
  // const navigate = useNavigate(); // REMOVED
  const [enrollmentStatus, setEnrollmentStatus] = useState<'overview' | 'journey' | 'lesson'>('overview');
  // const [course, setCourse] = useState<Course | null>(null); // REMOVED, using prop
  const [sopanas, setSopanas] = useState<Sopana[]>([]);
  const [progress, setProgress] = useState<UserSopanaProgress[]>([]);
  const [currentSopana, setCurrentSopana] = useState<Sopana | null>(null);
  const [sarathiMsg, setSarathiMsg] = useState<string>('');
  const [sarathiMood, setSarathiMood] = useState<'happy' | 'neutral' | 'guiding' | 'celebrating'>('neutral');

  // Lesson State
  const [viewMode, setViewMode] = useState<'reading' | 'quiz'>('reading');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizResults, setQuizResults] = useState<boolean[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  const BOOK_NAME_KEY = "MOG"; // Matches book_name in sopanas table

  useEffect(() => {
    loadData();
  }, [course.id]); // Use stable string ID, not object reference

  const loadData = async () => {
    // 1. Check enrollment
    if (course) {
      // We use the prop 'course', no need to fetch by slug again unless missing details
      checkEnrollment(course.id);
    }
  };

  const checkEnrollment = async (courseId: string) => {
    const enr = await courseService.getEnrollment(courseId);
    if (enr) {
      setEnrollmentStatus('journey');
      loadJourneyData();
    } else {
      setEnrollmentStatus('overview');
    }
  };

  const loadJourneyData = async () => {
    try {
      const s = await courseService.getCourseSopanas(BOOK_NAME_KEY);
      setSopanas(s);
      // Map sopana IDs to get progress
      if (s.length > 0) {
        const p = await courseService.getUserProgress(s.map((i: Sopana) => i.id!));
        setProgress(p);
      }
    } catch (err) {
      console.error("Failed to load journey data", err);
    }
  };

  const handleStartJourney = () => {
    setEnrollmentStatus('journey');
    loadJourneyData();
    setSarathiMsg(`Welcome to the path of wisdom! Each step brings you closer to the Absolute Truth.`);
    setSarathiMood('happy');
  };

  const handleSelectSopana = (sopana: Sopana) => {
    setCurrentSopana(sopana);
    setEnrollmentStatus('lesson');
    setViewMode('reading');
    setQuizResults([]);
    setCurrentQuestionIdx(0);
    setSarathiMsg(`Let's dive into "${sopana.title}". Read carefully!`);
    setSarathiMood('guiding');
  };

  const handleBackToJourney = () => {
    setEnrollmentStatus('journey');
    setCurrentSopana(null);
    loadJourneyData(); // Refresh progress
  };

  const handleQuizAnswer = (optionIdx: number) => {
    if (!currentSopana) return;
    setSelectedOption(optionIdx);

    const correct = currentSopana.quiz[currentQuestionIdx].correctAnswer === optionIdx;

    if (correct) {
      setSarathiMsg("Excellent realization! You have grasped the essence.");
      setSarathiMood('happy');
    } else {
      setSarathiMsg("Not quite. Reflect on the reading again. Even Arjuna had questions!");
      setSarathiMood('guiding');
    }
  };

  const handleNextQuestion = async () => {
    if (!currentSopana || selectedOption === null) return;

    const correct = currentSopana.quiz[currentQuestionIdx].correctAnswer === selectedOption;
    const newResults = [...quizResults, correct];
    setQuizResults(newResults);
    setSelectedOption(null);

    if (currentQuestionIdx < currentSopana.quiz.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Finish Quiz
      const score = Math.round((newResults.filter(Boolean).length / newResults.length) * 100);

      if (score >= 70) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFB800', '#FFFDF0', '#FFA500']
        });
        setSarathiMsg(`Sopana Mastered! You've advanced one step further.`);
        setSarathiMood('celebrating');

        try {
          await courseService.updateSopanaProgress(currentSopana.id!, 'completed', score);
        } catch (err) {
          console.error("Failed to save progress", err);
        }

        setTimeout(handleBackToJourney, 3000);
      } else {
        setSarathiMsg("Review the text once more to solidify your understanding.");
        setSarathiMood('neutral');
        setViewMode('reading'); // Send back to reading
        setQuizResults([]);
        setCurrentQuestionIdx(0);
      }
    }
  };

  if (enrollmentStatus === 'overview') {
    return <CourseOverview slug={course.slug || 'Message of Godhead'} onStartJourney={handleStartJourney} />;
  }

  return (
    <div className="bg-[#FFFDF0] min-h-screen pb-20 font-sans">
      <SarathiAssistant message={sarathiMsg} mood={sarathiMood} />

      {enrollmentStatus === 'journey' && (
        <div className="animate-in fade-in duration-500">
          <div className="sticky top-0 bg-[#FFFDF0]/80 backdrop-blur-md z-50 p-4 border-b border-clay/5">
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <button onClick={() => onNavigate(AppSection.Dashboard)} className="p-2 hover:bg-black/5 rounded-full"><ArrowLeft size={20} className="text-[#4A3728]" /></button>
              <h1 className="font-serif text-xl font-bold text-[#4A3728]">Your Journey</h1>
            </div>
          </div>
          <div className="pt-4">
            <JourneyMap sopanas={sopanas} progress={progress} onSelectSopana={handleSelectSopana} />
          </div>
        </div>
      )}

      {enrollmentStatus === 'lesson' && currentSopana && (
        <div className="max-w-3xl mx-auto p-4 md:p-8 animate-in slide-in-from-bottom duration-500">
          <button onClick={handleBackToJourney} className="mb-6 flex items-center gap-2 text-[#4A3728]/60 hover:text-saffron font-bold text-sm uppercase tracking-widest transition-colors">
            <ArrowLeft size={16} /> Back to Path
          </button>

          <div className="bg-white rounded-[2.5rem] shadow-xl border border-clay/5 overflow-hidden min-h-[60vh]">
            {/* Progress Header */}
            <div className="bg-cream/30 p-6 border-b border-clay/5 flex justify-between items-center bg-[#FFFDF0]">
              <h2 className="font-serif text-xl md:text-2xl font-bold text-[#4A3728] line-clamp-1">{currentSopana.title}</h2>
              <div className="flex gap-2 shrink-0">
                {viewMode === 'reading' ? (
                  <span className="bg-saffron/10 text-saffron px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-saffron/20">Reading</span>
                ) : (
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">Quiz {currentQuestionIdx + 1}/{currentSopana.quiz.length}</span>
                )}
              </div>
            </div>

            <div className="p-6 md:p-12">
              <AnimatePresence mode="wait">
                {viewMode === 'reading' ? (
                  <motion.div
                    key="reading"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8"
                  >
                    <div className="prose prose-lg prose-amber text-[#4A3728]/80 leading-relaxed font-medium">
                      {currentSopana.reading_text.split('\n').map((para, i) => para && (
                        <p key={i} className="mb-4 text-justify">{para}</p>
                      ))}
                    </div>

                    {/* Revision Notes */}
                    <div className="bg-[#FFFDF0] p-6 rounded-2xl border border-saffron/10 shadow-inner">
                      <h3 className="font-bold text-saffron uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                        <HelpCircle size={14} /> Key Points
                      </h3>
                      <ul className="space-y-3">
                        {currentSopana.revision_notes.map((note, i) => (
                          <li key={i} className="flex gap-3 text-sm text-[#4A3728] items-start">
                            <span className="text-saffron font-bold mt-1">•</span>
                            <span className="leading-relaxed">{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => { setViewMode('quiz'); setSarathiMsg("Ready to test your knowledge?"); }}
                      className="w-full bg-gradient-to-r from-saffron to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-saffron/30 transition-all flex items-center justify-center gap-2 active:scale-95 duration-200"
                    >
                      Start Quiz <ChevronRight />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="quiz"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <h3 className="font-serif text-2xl font-bold text-[#4A3728] leading-tight">
                        {currentSopana.quiz[currentQuestionIdx].question}
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {currentSopana.quiz[currentQuestionIdx].options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuizAnswer(idx)}
                          disabled={selectedOption !== null}
                          className={`w-full p-5 rounded-2xl text-left font-medium transition-all border-2 relative overflow-hidden group
                                                   ${selectedOption === idx
                              ? (currentSopana.quiz[currentQuestionIdx].correctAnswer === idx
                                ? 'bg-green-50 border-green-500 text-green-800'
                                : 'bg-red-50 border-red-500 text-red-800')
                              : 'bg-white border-clay/10 hover:border-saffron/50 hover:bg-cream/30'
                            }
                                               `}
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border shrink-0
                                                       ${selectedOption === idx
                                ? 'border-transparent bg-white/50'
                                : 'bg-clay/5 border-transparent text-clay group-hover:bg-saffron/10 group-hover:text-saffron'
                              }`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="leading-snug">{opt}</span>
                            {selectedOption === idx && currentSopana.quiz[currentQuestionIdx].correctAnswer === idx && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-auto"
                              >
                                <Check className="text-green-600" strokeWidth={3} />
                              </motion.div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {selectedOption !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-saffron/5 rounded-xl text-sm leading-relaxed border border-saffron/10"
                      >
                        <span className="font-bold text-saffron block mb-1 uppercase tracking-widest text-[10px]">Insight</span>
                        <span className="text-[#4A3728]/80 italic">
                          {currentSopana.quiz[currentQuestionIdx].explanation}
                        </span>
                      </motion.div>
                    )}

                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={handleNextQuestion}
                        disabled={selectedOption === null}
                        className="bg-[#4A3728] text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-black transition-all hover:shadow-lg disabled:hover:shadow-none active:scale-95"
                      >
                        {currentQuestionIdx < currentSopana.quiz.length - 1 ? 'Next Question' : 'Finish Lesson'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseView;
