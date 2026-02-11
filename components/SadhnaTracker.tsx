
import React, { useState } from 'react';
import { Language, SadhnaRecord } from '../types';
import SadhanaMiniStrip from './SadhanaMiniStrip';
import LevelProgressBar from './LevelProgressBar';
import { sadhnaService } from '../services/sadhnaService';

interface Option {
  id: string;
  label: string;
  points: number;
}

interface Question {
  id: string;
  title: string;
  hindiTitle: string;
  description?: string;
  hindiDescription?: string;
  type: 'text' | 'date' | 'select';
  options?: Option[];
}

interface SadhnaTrackerProps {
  language: Language;
  onComplete?: (score: number, report: any) => void;
  t: (key: string) => string;
  devoteeName?: string;
  currentStreak?: number;
  longestStreak?: number;
  logs?: SadhnaRecord[];
}

const QUESTIONS: Question[] = [
  {
    id: 'date',
    title: 'Date of Sadhana',
    hindiTitle: 'साधना की तिथि',
    type: 'date'
  },
  {
    id: 'name',
    title: 'Devotee Name',
    hindiTitle: 'भक्त का नाम',
    type: 'text'
  },
  {
    id: 'sleep',
    title: "Last Night's Rest",
    hindiTitle: 'कल रात का विश्राम',
    type: 'select',
    options: [
      { id: '9:30', label: '9:30 pm or before', points: 30 },
      { id: '10:00', label: '10:00 pm', points: 25 },
      { id: '10:30', label: '10:30 pm', points: 20 },
      { id: '11:00', label: '11:00 pm', points: 15 },
      { id: 'after_11', label: 'After 11:00 pm', points: 10 }
    ]
  },
  {
    id: 'wake',
    title: 'Morning Awakening',
    hindiTitle: 'सुबह का जागरण',
    type: 'select',
    options: [
      { id: '3:30', label: '3:30 AM or before', points: 30 },
      { id: '4:00', label: 'Before 4:00 AM', points: 25 },
      { id: '4:30', label: 'Before 4:30 AM', points: 20 },
      { id: '5:00', label: 'Before 5:00 AM', points: 15 },
      { id: 'after_5', label: 'After 5:00 AM', points: 0 }
    ]
  },
  {
    id: 'midday',
    title: 'Midday Rest',
    hindiTitle: 'दोपहर का विश्राम',
    type: 'select',
    options: [
      { id: 'none', label: 'No day sleep', points: 30 },
      { id: '30m', label: '30 minutes or less', points: 20 },
      { id: '1h', label: '1 hour', points: 10 },
      { id: '1.5h', label: '1.5 hours or more', points: 0 }
    ]
  },
  {
    id: 'japa_total',
    title: 'Japa Rounds (Total)',
    hindiTitle: 'आज अपने भगवान को हरे कृष्ण महामंत्र की कितनी माला अर्पित करीं?',
    type: 'select',
    options: [
      { id: '16', label: '16+', points: 30 },
      { id: '12', label: '12-16', points: 25 },
      { id: '9', label: '9-11', points: 20 },
      { id: '5', label: '5-8', points: 15 },
      { id: '1', label: '1-4', points: 10 }
    ]
  },
  {
    id: 'japa_morning',
    title: 'Japa Rounds before 7:30 AM',
    hindiTitle: 'सुबह 7:30 बजे से पहले आपने कितनी माला करीं?',
    type: 'select',
    options: [
      { id: '16', label: '16+', points: 30 },
      { id: '12', label: '12-16', points: 25 },
      { id: '9', label: '9-11', points: 20 },
      { id: '5', label: '5-8', points: 15 },
      { id: '1', label: '1-4', points: 10 }
    ]
  },
  {
    id: 'sewa',
    title: 'Vigraha Sewa',
    hindiTitle: 'विग्रह सेवा',
    hindiDescription: 'सुबह नहा कर भगवान को प्रणाम करना, आरती करना, जल और तुलसी अर्पित करना।',
    type: 'select',
    options: [
      { id: 'yes', label: 'Yes', points: 30 },
      { id: 'no', label: 'No', points: 0 }
    ]
  },
  {
    id: 'reading',
    title: 'Sacred Reading',
    hindiTitle: 'शास्त्र अध्ययन',
    type: 'select',
    options: [
      { id: '1h', label: 'More than 1 hour', points: 30 },
      { id: '45m', label: '45 mins', points: 20 },
      { id: '30m', label: 'Less than 30 mins', points: 10 }
    ]
  },
  {
    id: 'class',
    title: 'Gita Class',
    hindiTitle: 'गीता क्लास',
    type: 'select',
    options: [
      { id: 'yes', label: 'Yes', points: 30 },
      { id: 'no', label: 'No', points: 0 }
    ]
  },
  {
    id: 'principles',
    title: '4 Regulative Principles',
    hindiTitle: '४ नियामक सिद्धांत',
    hindiDescription: 'एक भक्त को: १. मांसाहार २. मादक पदार्थ ३. जुआ ४. पर स्त्री/पुरुष संघ नहीं करना चाहिए। क्या आपने आज इन सिद्धांतों का पालन किया?',
    type: 'select',
    options: [
      { id: 'yes', label: 'Yes, Followed', points: 30 },
      { id: 'no', label: 'No', points: 0 }
    ]
  }
];

const ConfirmationModal: React.FC<{ isOpen: boolean, streak: number, onConfirm: () => void, onCancel: () => void }> = ({ isOpen, streak, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#FFFDF0] rounded-3xl p-8 max-w-sm w-full border-2 border-[#FFB800] shadow-2xl space-y-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-[#3D2B1F] mb-2">Warning: Streak Risk!</h3>
          <p className="text-[#3D2B1F]/70 text-sm">
            This action might break your <span className="font-bold text-[#FFB800]">🔥 {streak} day streak</span>!
            You will lose your progress towards the Radha Krishna Frame.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-[#3D2B1F]/10 font-bold text-[#3D2B1F]/60 hover:bg-[#3D2B1F]/5">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg">
            Continue anyway
          </button>
        </div>
      </div>
    </div>
  );
};

const SadhnaTracker: React.FC<SadhnaTrackerProps> = ({ language, onComplete, t, devoteeName, currentStreak = 0, longestStreak = 0, logs = [] }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({
    date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD local
    name: devoteeName || ''
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDate, setPendingDate] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = QUESTIONS[step];
  const isLastStep = step === QUESTIONS.length;

  const handleNext = () => {
    if (step < QUESTIONS.length) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const handleOptionSelect = (qId: string, option: Option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
    setTimeout(handleNext, 300);
  };

  const calculateTotalScore = () => {
    return QUESTIONS.reduce((acc, q) => {
      const answer = answers[q.id];
      if (answer && typeof answer === 'object' && 'points' in answer) {
        return acc + (answer.points as number);
      }
      return acc;
    }, 0);
  };

  const handleSubmit = () => {
    const score = calculateTotalScore();
    setIsSubmitted(true);
    if (onComplete) onComplete(score, answers);
  };

  const resetTracker = () => {
    setStep(0);
    setAnswers({
      date: new Date().toLocaleDateString('en-CA'),
      name: ''
    });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    const totalScore = calculateTotalScore();
    return (
      <div className="bg-white rounded-[2.5rem] p-10 divine-shadow border border-clay/20 max-w-xl mx-auto text-center space-y-8 animate-in fade-in zoom-in">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-deepBrown">Offering Accepted!</h2>
          <p className="text-charcoal/50">Your daily sadhana report has been successfully recorded.</p>
        </div>
        <div className="bg-orange-50/50 rounded-3xl p-8 border border-orange-100">
          <p className="text-xs font-bold text-charcoal/40 uppercase tracking-widest mb-1">Total Score</p>
          <div className="text-5xl font-bold text-saffron">
            {totalScore} <span className="text-2xl text-charcoal/20 font-serif">/ 270</span>
          </div>
        </div>
        <button
          onClick={resetTracker}
          className="w-full bg-saffron text-white py-5 rounded-2xl font-bold text-lg shadow-lg hover:bg-orange-500 transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Submit New Report
        </button>
      </div>
    );
  }

  if (isLastStep) {
    const totalScore = calculateTotalScore();
    return (
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 divine-shadow border border-clay/20 max-w-2xl mx-auto space-y-10 animate-in slide-in-from-bottom-4">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl font-bold text-deepBrown">Final Offering <span className="text-saffron">*</span></h2>
          <div className="relative inline-block mt-4">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 blur-xl opacity-20 rounded-full"></div>
            <div className="relative bg-white border border-clay/10 p-6 rounded-3xl text-center min-w-[200px]">
              <p className="text-[10px] font-bold text-clay uppercase tracking-widest mb-1">Final Score</p>
              <div className="text-5xl font-bold text-saffron">
                {totalScore} <span className="text-2xl text-charcoal/20">/ 270</span>
              </div>
              <p className="text-[10px] text-charcoal/40 mt-2">Based on your daily sadhana practices</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-clay/10">
            <span className="text-xs font-bold text-clay uppercase tracking-widest">Summary</span>
          </div>

          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <span className="text-charcoal/50">Date</span>
            <span className="text-deepBrown font-bold text-right">{answers.date}</span>

            <span className="text-charcoal/50">Devotee</span>
            <span className="text-deepBrown font-bold text-right">{answers.name || 'Seeker'}</span>

            {QUESTIONS.slice(2).map(q => (
              <React.Fragment key={q.id}>
                <span className="text-charcoal/50">{language === 'hi' ? q.hindiTitle : q.title}</span>
                <div className="text-right">
                  <span className="text-green-600 font-bold block">{answers[q.id]?.label || '-'}</span>
                  <span className="text-[10px] font-bold text-clay uppercase tracking-widest">{answers[q.id]?.points || 0} Points</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            onClick={handleBack}
            className="flex-1 bg-cream text-deepBrown py-4 rounded-2xl font-bold border border-clay/20 flex items-center justify-center gap-2 hover:bg-clay/10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="flex-[2] bg-saffron text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:bg-orange-500 transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0 1 21.485 12 59.77 59.77 0 0 1 3.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
            Submit Offering
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const levelInfo = sadhnaService.getCurrentLevelInfo(currentStreak);

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 divine-shadow border border-clay/20 max-w-2xl mx-auto space-y-12 min-h-[500px] flex flex-col justify-between animate-in fade-in duration-500">

      {/* Level Progress */}
      <LevelProgressBar levelInfo={levelInfo} />

      {/* Mini Streak Strip */}
      <SadhanaMiniStrip
        logs={logs}
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        t={t}
        onDateSelect={(date) => {
          setAnswers(prev => ({ ...prev, date }));
          setStep(0); // go to date step
        }}
      />

      <div className="text-center space-y-6">
        <h2 className="font-serif text-3xl font-bold text-deepBrown leading-tight">
          {(language === 'hi' ? currentQuestion.hindiTitle : currentQuestion.title)} <span className="text-saffron">*</span>
        </h2>

        {(currentQuestion.hindiDescription || currentQuestion.description) && (
          <p className="text-charcoal/60 text-sm leading-relaxed max-w-md mx-auto whitespace-pre-line">
            {(language === 'hi' ? currentQuestion.hindiDescription : currentQuestion.description)}
          </p>
        )}

        {currentQuestion.type === 'date' && (
          <div className="py-12">
            <label className="block text-[10px] font-bold text-clay uppercase tracking-[0.2em] mb-4">Date</label>
            <input
              type="date"
              value={answers.date}
              onChange={(e) => {
                const newDate = e.target.value;
                // Simple check: if changing date and streak > 0, ask confirmation
                if (currentStreak > 0 && newDate !== answers.date) {
                  setPendingDate(newDate);
                  setShowConfirm(true);
                } else {
                  setAnswers(prev => ({ ...prev, date: newDate }));
                }
              }}
              className={`w-full max-w-sm bg-cream/30 border border-clay/20 rounded-full py-4 px-8 focus:outline-none focus:border-saffron text-center font-bold text-deepBrown text-lg ${currentStreak > 0 ? 'border-orange-200' : ''}`}
            />
          </div>
        )}

        <ConfirmationModal
          isOpen={showConfirm}
          streak={currentStreak}
          onCancel={() => { setShowConfirm(false); setPendingDate(null); }}
          onConfirm={() => {
            if (pendingDate) setAnswers(prev => ({ ...prev, date: pendingDate }));
            setShowConfirm(false);
          }}
        />

        {currentQuestion.type === 'text' && (
          <div className="py-12">
            <label className="block text-[10px] font-bold text-clay uppercase tracking-[0.2em] mb-4">Devotee Name</label>
            <input
              type="text"
              value={answers.name}
              placeholder="Start typing your name..."
              onChange={(e) => setAnswers(prev => ({ ...prev, name: e.target.value }))}
              className="w-full max-w-sm bg-cream/30 border border-clay/20 rounded-full py-4 px-8 focus:outline-none focus:border-saffron text-center font-bold text-deepBrown text-lg placeholder:text-clay/50 placeholder:font-normal"
            />
          </div>
        )}

        {currentQuestion.type === 'select' && currentQuestion.options && (
          <div className="space-y-4 pt-4">
            {currentQuestion.options.map(option => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(currentQuestion.id, option)}
                className={`w-full group relative flex items-center justify-between p-5 rounded-2xl border-2 transition-all active:scale-[0.98] ${(answers[currentQuestion.id]?.id === option.id
                  ? 'border-saffron bg-saffron/5'
                  : (option.points >= 25 ? 'border-green-100 bg-green-50/30 hover:border-green-300'
                    : (option.points >= 15 ? 'border-blue-100 bg-blue-50/30 hover:border-blue-300'
                      : 'border-red-100 bg-red-50/30 hover:border-red-300')))
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${answers[currentQuestion.id]?.id === option.id
                    ? 'border-saffron bg-saffron text-white'
                    : 'border-clay/30'
                    }`}>
                    {answers[currentQuestion.id]?.id === option.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span className="font-bold text-deepBrown/80 group-hover:text-deepBrown transition-colors">{option.label}</span>
                </div>
                <div className={`text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded-md ${(option.points >= 25 ? 'text-green-600 bg-green-100/50'
                  : (option.points >= 15 ? 'text-blue-600 bg-blue-100/50'
                    : 'text-red-600 bg-red-100/50'))
                  }`}>
                  {option.points} PTS
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pt-8">
        <div className="flex items-center justify-between mb-6">
          <button
            disabled={step === 0}
            onClick={handleBack}
            className={`w-12 h-12 rounded-full border border-clay/20 flex items-center justify-center transition-all ${step === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-cream active:scale-90'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 text-deepBrown">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="flex-1 max-w-[120px] mx-8 relative">
            <div className="h-2 w-full bg-cream rounded-full overflow-hidden">
              <div className="h-full bg-saffron transition-all duration-500" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}></div>
            </div>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-clay uppercase tracking-widest whitespace-nowrap">
              {step + 1} of {QUESTIONS.length}
            </span>
          </div>

          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-saffron text-white flex items-center justify-center shadow-lg hover:shadow-saffron/20 active:scale-90 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>

  );
};

export default SadhnaTracker;
