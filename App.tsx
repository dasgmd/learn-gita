
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CourseCard from './components/CourseCard';

import GitaChat from './components/GitaChat';
import AuthForm from './components/AuthForm';
import StudentDashboard from './components/StudentDashboard';
import CourseView from './components/CourseView';
import AboutUs from './components/AboutUs';
import SadhnaTracker from './components/SadhnaTracker';
import ProfileSetup from './components/ProfileSetup';
import LevelUpModal from './components/LevelUpModal';
import VaishnavaHub from './components/VaishnavaHub';
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import DevoteeList from './components/admin/DevoteeList';
import DevoteeDetail from './components/admin/DevoteeDetail';
import FestivalManager from './components/admin/FestivalManager';
import CourseFactory from './components/admin/CourseFactory';
import SopanaManager from './components/admin/SopanaManager';
import { AppSection, Language, User, Course, SadhnaRecord } from './types';
import { COURSES, LEVEL_SYSTEM } from './constants';
import { getVerseOfTheDay } from './services/geminiService';
import { sadhnaService } from './services/sadhnaService';
import { userService } from './services/userService';
import { supabase } from './supabaseClient';

const translations: Record<Language, Record<string, string>> = {
  en: {
    nav_explore: 'Explore Courses',
    nav_sadhna: 'Sadhna Tracker',
    nav_about: 'About Us',
    nav_login: 'Login / Register',
    nav_dashboard: 'My Dashboard',
    nav_dashboard_short: 'My Portal',
    nav_logout: 'Logout',
    btn_get_started: 'Get Started',
    hero_badge: 'Wisdom for the Modern World',
    hero_title_1: 'Awaken Your',
    hero_title_2: 'Divine Potential',
    hero_desc: 'Embark on a structured, interactive journey through the timeless verses of the Bhagavad Gita. Experience ancient wisdom through modern technology.',
    hero_btn_start: 'Begin Your Journey',
    hero_btn_browse: 'Browse Courses',
    votd_title: 'Verse of the Day',
    votd_insight: 'Modern Insight',
    featured_title: 'Featured Courses',
    featured_desc: 'Structured learning paths for every stage of your journey.',
    view_all: 'View All Courses',
    chat_guide_title: 'Your Personal',
    chat_guide_subtitle: 'Gita AI Guide',
    chat_guide_desc: "Have questions about life, work, or relationships? Our AI assistant is trained on the Bhagavad Gita's deep philosophy to provide you with tailored spiritual insights whenever you need them.",
    chat_title: 'Ask Krishna',
    chat_subtitle: 'AI Companion',
    chat_welcome: '"Arise! Awake! And stop not until the goal is reached."\nHow may I assist your spiritual journey today?',
    chat_placeholder: 'Type your question...',
    explore_title: 'Master the Wisdom',
    sadhna_title: 'Daily Sadhana',
    sadhna_desc: '"For him who has conquered the mind, the mind is the best of friends; but for one who has failed to do so, his very mind will be his greatest enemy."',
    footer_desc: 'Bringing the eternal message of Shri Krishna to the digital generation through structured study and daily practice.',
    footer_nav: 'Navigation',
    footer_resources: 'Resources',
    footer_stay_guided: 'Stay Guided',
    auth_login_title: 'Welcome Back',
    auth_login_subtitle: 'Continue your journey to self-realization',
    auth_signup_title: 'Begin Your Path',
    auth_signup_subtitle: 'Create an account to track your spiritual growth',
    label_name: 'Your Name',
    label_email: 'Divine Email',
    label_password: 'Soul Key (Password)',
    btn_login: 'Login to Portal',
    btn_create_account: 'Create Account',
    auth_switch_signup: "New seeker? Join the path",
    auth_switch_login: "Already a member? Sign in",
    welcome_back: 'Hare Krishna!',
    dashboard_subtitle: 'Here is an overview of your spiritual studies.',
    my_courses: 'My Enrolled Courses',
    stat_enrolled: 'Active Courses',
    stat_avg_progress: 'Avg. Mastery',
    no_courses_yet: 'You haven\'t embarked on a course yet.',
    btn_browse_catalog: 'Browse the Knowledge Catalog',
    btn_enroll_now: 'Enroll Now',
    btn_enrolled: 'Already Enrolled',
    course_progress: 'Mastery',
    sadhna_history: 'Report History',
    no_sadhna_history: 'No reports filed yet.',
    view_details_tap: 'Tap to view details',
    report_details: 'Report Details',
    total_score: 'Total Score',
    full_breakdown: 'Full Breakdown',
    close_details: 'Close',
    lessons: 'Lessons',
    mark_complete: 'Mark as Complete',
    completed: 'Completed',
    study_note: 'Take a moment to reflect on these teachings before proceeding to the next lesson.',
    select_lesson: 'Please select a lesson to begin.',
    loading: 'Loading...',
    save_error: 'Failed to save your sacred offering. Please check your database connection or SQL constraints.'
  },
  hi: {
    nav_explore: 'कोर्स देखें',
    nav_sadhna: 'साधना ट्रैकर',
    nav_about: 'हमारे बारे में',
    nav_login: 'लॉगिन / रजिस्टर',
    nav_dashboard: 'मेरा डैशबोर्ड',
    nav_dashboard_short: 'मेरा पोर्टल',
    nav_logout: 'लॉगआउट',
    btn_get_started: 'शुरू करें',
    hero_badge: 'आधुनिक दुनिया के लिए ज्ञान',
    hero_title_1: 'अपनी',
    hero_title_2: 'दिव्य क्षमता जगाएं',
    hero_desc: 'भगवद गीता के कालातीत श्लोकों के माध्यम से एक व्यवस्थित, संवादात्मक यात्रा पर निकलें। आधुनिक तकनीक के माध्यम से प्राचीन ज्ञान का अनुभव करें।',
    hero_btn_start: 'अपनी यात्रा शुरू करें',
    hero_btn_browse: 'कोर्स देखें',
    votd_title: 'आज का श्लोक',
    votd_insight: 'आधुनिक अंतर्दृष्टि',
    featured_title: 'विशेष पाठ्यक्रम',
    featured_desc: 'आपकी यात्रा के हर चरण के लिए संरचित शिक्षण पथ।',
    view_all: 'सभी पाठ्यक्रम देखें',
    chat_guide_title: 'आपका व्यक्तिगत',
    chat_guide_subtitle: 'गीता एआई गाइड',
    chat_guide_desc: "जीवन, कार्य या रिश्तों के बारे में प्रश्न हैं? हमारा एआई सहायक भगवद गीता के गहन दर्शन पर प्रशिक्षित है ताकि आपको जब भी आवश्यकता हो, अनुकूलित आध्यात्मिक अंतर्दृष्टि प्रदान की जा सके।",
    chat_title: 'कृष्ण से पूछें',
    chat_subtitle: 'एआई साथी',
    chat_welcome: '"उठो! जागो! और लक्ष्य प्राप्ति तक मत रुको।"\nआज मैं आपकी आध्यात्मिक यात्रा में कैसे सहायता कर सकता हूँ?',
    chat_placeholder: 'अपना प्रश्न लिखें...',
    explore_title: 'ज्ञान में महारत हासिल करें',
    sadhna_title: 'दैनिक साधना',
    sadhna_desc: '"जिसने मन को जीत लिया है, उसके लिए मन सबसे अच्छा मित्र है; लेकिन जो ऐसा करने में विफल रहा है, उसके लिए उसका अपना मन ही सबसे बड़ा शत्रु होगा।"',
    footer_desc: 'संरचित अध्ययन और दैनिक अभ्यास के माध्यम से श्री कृष्ण के शाश्वत संदेश को डिजिटल पीढ़ी तक पहुँचाना।',
    footer_nav: 'नेविगेशन',
    footer_resources: 'संसाधन',
    footer_stay_guided: 'मार्गदर्शन प्राप्त करें',
    auth_login_title: 'स्वागत है',
    auth_login_subtitle: 'आत्म-साक्षात्कार की अपनी यात्रा जारी रखें',
    auth_signup_title: 'अपना मार्ग शुरू करें',
    auth_signup_subtitle: 'अपनी आध्यात्मिक प्रगति को ट्रैक करने के लिए एक खाता बनाएं',
    label_name: 'आपका नाम',
    label_email: 'ईमेल',
    label_password: 'पासवर्ड',
    btn_login: 'पोर्टल में लॉगिन करें',
    btn_create_account: 'खाता बनाएं',
    auth_switch_signup: "नए साधक? मार्ग में शामिल हों",
    auth_switch_login: "पहले से सदस्य हैं? साइन इन करें",
    welcome_back: 'नमस्ते',
    dashboard_subtitle: 'यहाँ आपके आध्यात्मिक अध्ययन का अवलोकन है।',
    my_courses: 'मेरे नामांकित पाठ्यक्रम',
    stat_enrolled: 'सक्रिय पाठ्यक्रम',
    stat_avg_progress: 'औसत निपुणता',
    no_courses_yet: 'आपने अभी तक कोई पाठ्यक्रम शुरू नहीं किया है।',
    btn_browse_catalog: 'ज्ञान कैटलॉग ब्राउज़ करें',
    btn_enroll_now: 'अभी नामांकन करें',
    btn_enrolled: 'नामांकित',
    course_progress: 'निपुणता',
    sadhna_history: 'रिपोर्ट इतिहास',
    no_sadhna_history: 'अभी तक कोई रिपोर्ट नहीं।',
    view_details_tap: 'विवरण देखने के लिए टैप करें',
    report_details: 'रिपोर्ट विवरण',
    total_score: 'कुल अंक',
    full_breakdown: 'पूरा विवरण',
    close_details: 'बंद करें',
    lessons: 'पाठ',
    mark_complete: 'पूर्ण चिह्नित करें',
    completed: 'पूर्ण',
    study_note: 'अगले पाठ पर आगे बढ़ने से पहले इन शिक्षाओं पर विचार करने के लिए कुछ समय निकालें।',
    select_lesson: 'कृपया शुरू करने के लिए एक पाठ चुनें।',
    loading: 'लोड हो रहा है...',
    save_error: 'आपकी रिपोर्ट सहेजने में विफल। कृपया अपनी डेटाबेस सेटिंग्स (SQL) जांचें।'
  }
};

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.Home);
  const [language, setLanguage] = useState<Language>('en');
  const [votd, setVotd] = useState<any>(null);
  const [loadingVotd, setLoadingVotd] = useState(true);

  // Auth State
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [levelUp, setLevelUp] = useState<any>(null);

  // App State
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [completedLessonsMap, setCompletedLessonsMap] = useState<Record<string, string[]>>({});
  // Admin State
  const [adminTab, setAdminTab] = useState<'dashboard' | 'users' | 'festivals' | 'factory'>('dashboard');
  const [selectedAdminUser, setSelectedAdminUser] = useState<string | null>(null);

  const t = (key: string) => translations[language][key] || key;

  // 1. Initial Session Check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserData(session.user);
      else setLoadingUser(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserData(session.user);
      else {
        setUser(null);
        setLoadingUser(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (sbUser: any) => {
    setLoadingUser(true);
    try {
      const [history, profile] = await Promise.all([
        sadhnaService.fetchHistory(sbUser.id),
        userService.fetchProfile(sbUser.id)
      ]);

      const recalculatedStreak = sadhnaService.calculatePunctualStreak(
        history.map(h => ({ entry_date: h.date, created_at: h.createdAt || null }))
      );

      setUser({
        id: sbUser.id,
        name: profile?.name || sbUser.user_metadata?.full_name || 'Seeker',
        email: sbUser.email || '',
        sadhnaHistory: history,
        currentStreak: recalculatedStreak,
        longestStreak: Math.max(recalculatedStreak, profile?.longest_streak || 0),
        lastSadhnaDate: profile?.last_sadhna_date
      });
    } catch (err) {
      console.error("Failed to fetch user data", err);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    const fetchVotd = async () => {
      setLoadingVotd(true);
      const data = await getVerseOfTheDay(language);
      setVotd(data);
      setLoadingVotd(false);
    };
    fetchVotd();
  }, [language]);

  const navigate = (section: AppSection, courseId?: string, replace = false) => {
    if (section === AppSection.CourseView && courseId) {
      setActiveCourseId(courseId);
      setActiveSection(AppSection.CourseView);
    } else {
      setActiveSection(section);
    }

    const state = { section, courseId };
    const url = section === AppSection.Home ? '/' : `/${section}${courseId ? `/${courseId}` : ''}`;

    if (replace) {
      window.history.replaceState(state, '', url);
    } else {
      window.history.pushState(state, '', url);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync state with browser history
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        const { section, courseId } = event.state;
        if (section === AppSection.CourseView && courseId) {
          setActiveCourseId(courseId);
          setActiveSection(AppSection.CourseView);
        } else {
          setActiveSection(section);
        }
      } else {
        // Handle initial load or empty state
        setActiveSection(AppSection.Home);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Initial sync for current URL
    const path = window.location.pathname.slice(1);
    if (path) {
      const parts = path.split('/');
      const section = parts[0] as AppSection;
      const id = parts[1];
      if (Object.values(AppSection).includes(section)) {
        if (section === AppSection.CourseView && id) {
          setActiveCourseId(id);
          setActiveSection(AppSection.CourseView);
        } else {
          setActiveSection(section);
        }
        // Replace current state so we have it for future popstate
        window.history.replaceState({ section, courseId: id }, '', window.location.pathname);
      }
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLogout = async () => {
    await sadhnaService.signOut();
    navigate(AppSection.Home);
  };

  const handleEnroll = (courseId: string) => {
    if (!session) {
      navigate(AppSection.Auth);
      return;
    }
    if (!enrolledCourseIds.includes(courseId)) {
      setEnrolledCourseIds(prev => [...prev, courseId]);
    }
  };



  const handleMarkLessonComplete = (courseId: string, lessonId: string) => {
    setCompletedLessonsMap(prev => {
      const current = prev[courseId] || [];
      if (!current.includes(lessonId)) {
        return { ...prev, [courseId]: [...current, lessonId] };
      }
      return prev;
    });
  };

  const handleSadhnaComplete = async (score: number, report: any) => {
    if (!session || !user) return;
    try {
      const oldStreak = user.currentStreak || 0;
      const result = await sadhnaService.saveSadhna(user.id, score, report);
      const newStreak = result.newStreak;

      // Refresh user history
      const history = await sadhnaService.fetchHistory(user.id);
      setUser(prev => prev ? {
        ...prev,
        sadhnaHistory: history,
        currentStreak: newStreak,
        longestStreak: result.newLongest
      } : null);

      // Check for level up
      const newLevel = sadhnaService.checkLevelUp(oldStreak, newStreak);
      if (newLevel) {
        setLevelUp(newLevel);
      }
    } catch (err: any) {
      console.error("Failed to save sadhna", err);
      alert(t('save_error') || "Failed to save your sacred offering. Please check your database connection.");
    }
  };

  const activeCourse = COURSES.find(c => c.id === activeCourseId);

  const enrolledCourses: Course[] = COURSES
    .filter(c => enrolledCourseIds.includes(c.id))
    .map(c => {
      const completed = completedLessonsMap[c.id] || [];
      const total = c.lessons?.length || 1;
      return {
        ...c,
        progress: Math.round((completed.length / total) * 100)
      };
    });

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-saffron border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-serif text-deepBrown font-bold">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-saffron/20 selection:text-deepBrown">
      <Navbar
        onNavigate={navigate}
        activeSection={activeSection}
        language={language}
        onLanguageChange={setLanguage}
        t={t}
        isLoggedIn={!!session}
        user={user}
      />

      {session && (
        <div className="bg-deepBrown text-cream/60 py-2 px-12 flex justify-end gap-6 text-[10px] font-bold uppercase tracking-widest border-b border-white/5">
          <button
            onClick={() => navigate(AppSection.Dashboard)}
            className={`hover:text-saffron transition-colors ${activeSection === AppSection.Dashboard ? 'text-saffron' : ''}`}
          >
            {t('nav_dashboard')}
          </button>
          <button onClick={handleLogout} className="hover:text-red-400 transition-colors">
            {t('nav_logout')}
          </button>
        </div>
      )}


      <main className="flex-grow">
        {activeSection === AppSection.Home && (
          <>
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-6">
              <div className="absolute top-0 left-0 w-full h-full -z-10">
                <img src="https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&q=80&w=1920" alt="" className="w-full h-full object-cover opacity-10" />
                <div className="absolute inset-0 gradient-overlay"></div>
              </div>
              <div className="max-w-4xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-saffron/10 text-saffron rounded-full text-[10px] font-bold tracking-[0.2em] uppercase">
                  <span>{t('hero_badge')}</span>
                </div>
                <h1 className="font-serif text-5xl md:text-7xl text-deepBrown leading-tight">
                  {t('hero_title_1')} <br />
                  <span className="text-saffron relative italic">{t('hero_title_2')}</span>
                </h1>
                <p className="text-charcoal/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">{t('hero_desc')}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button onClick={() => navigate(AppSection.Explore)} className="w-full sm:w-auto bg-saffron text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
                    {t('hero_btn_start')}
                  </button>
                  <button onClick={() => navigate(AppSection.Explore)} className="w-full sm:w-auto bg-white border-2 border-clay/30 text-deepBrown px-10 py-4 rounded-full font-bold text-lg hover:border-saffron transition-all">
                    {t('hero_btn_browse')}
                  </button>
                </div>
              </div>
            </section>

            <section className="py-20 px-6 bg-white relative overflow-hidden">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="inline-block">
                  <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-clay mb-2">{t('votd_title')}</h2>
                  <div className="h-0.5 w-12 bg-saffron mx-auto"></div>
                </div>

                {loadingVotd ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-cream rounded w-3/4 mx-auto"></div>
                    <div className="h-20 bg-cream rounded w-full"></div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in duration-1000">
                    <p className="font-serif text-2xl md:text-3xl text-deepBrown italic leading-relaxed">
                      "{votd?.sanskrit}"
                    </p>
                    <div className="space-y-2">
                      <p className="text-charcoal/80 text-lg">"{votd?.translation}"</p>
                      <p className="text-saffron font-bold text-xs tracking-widest uppercase">{votd?.reference}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="py-24 px-6 md:px-12 bg-cream/30">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                  <div className="space-y-2">
                    <h2 className="font-serif text-4xl font-bold text-deepBrown">{t('featured_title')}</h2>
                    <p className="text-charcoal/60">{t('featured_desc')}</p>
                  </div>
                  <button
                    onClick={() => navigate(AppSection.Explore)}
                    className="text-saffron font-bold text-sm tracking-widest uppercase flex items-center gap-2 hover:gap-4 transition-all"
                  >
                    {t('view_all')}
                    <span>→</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {COURSES.map(course => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onEnroll={handleEnroll}
                      isEnrolled={enrolledCourseIds.includes(course.id)}
                      t={t}
                    />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {activeSection === AppSection.Explore && (
          <section className="py-20 px-6 max-w-7xl mx-auto">
            <h1 className="font-serif text-5xl font-bold text-deepBrown mb-12 text-center">{t('explore_title')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {COURSES.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEnroll={handleEnroll}
                  isEnrolled={enrolledCourseIds.includes(course.id)}
                  t={t}
                />
              ))}
            </div>
          </section>
        )}

        {activeSection === AppSection.Sadhna && (
          <section className="py-8 px-6 bg-cream/40 min-h-screen max-w-2xl mx-auto">
            <SadhnaTracker
              language={language}
              t={t}
              devoteeName={user?.name}
              currentStreak={user?.currentStreak}
              longestStreak={user?.longestStreak}
              logs={user?.sadhnaHistory}
              onComplete={handleSadhnaComplete}
            />
          </section>
        )}

        {activeSection === AppSection.Dashboard && user && (
          <section className="py-16 px-6 md:px-12 bg-cream/30 min-h-screen">
            <StudentDashboard
              user={user}
              enrolledCourses={enrolledCourses}
              onViewCourse={(id) => navigate(AppSection.CourseView, id)}
              onNavigate={navigate}
              t={t}
            />
          </section>
        )}

        {activeSection === AppSection.CourseView && activeCourse && (
          <CourseView
            course={activeCourse}
            language={language}
            onMarkComplete={(lessonId) => handleMarkLessonComplete(activeCourse.id, lessonId)}
            completedLessons={completedLessonsMap[activeCourse.id] || []}
            t={t}
          />
        )}

        {activeSection === AppSection.Auth && (
          <section className="py-20 px-6 flex items-center justify-center min-h-[80vh] bg-cream/20">
            <AuthForm
              onLogin={() => navigate(AppSection.Dashboard)}
              t={t}
            />
          </section>
        )}

        {activeSection === AppSection.About && (
          <AboutUs t={t} />
        )}

        {activeSection === AppSection.ProfileSetup && (
          <ProfileSetup
            userId={user?.id}
            userEmail={user?.email}
            userName={user?.name}
            onComplete={() => navigate(AppSection.Dashboard)}
          />
        )}

        {activeSection === AppSection.VaishnavaHub && user && (
          <section className="py-20 px-6 min-h-screen bg-cream">
            <VaishnavaHub user={user} />
          </section>
        )}

        {activeSection === AppSection.AdminLogin && (
          <AdminLogin onLoginSuccess={() => navigate(AppSection.AdminDashboard)} />
        )}

        {activeSection === AppSection.AdminDashboard && (
          <AdminLayout
            activeTab={adminTab}
            onTabChange={(tab) => { setAdminTab(tab); setSelectedAdminUser(null); }}
            onLogout={() => {
              supabase.auth.signOut();
              setActiveSection(AppSection.Home);
            }}
          >
            {adminTab === 'dashboard' && (
              <div className="space-y-6">
                <h1 className="font-serif text-3xl font-bold text-[#3D2B1F]">Welcome, Director</h1>
                <p className="text-[#3D2B1F]/60">Select a module from the sidebar to begin managing the platform.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button onClick={() => setAdminTab('users')} className="p-8 bg-white rounded-2xl border border-[#3D2B1F]/5 shadow-sm hover:shadow-md transition-all text-left group">
                    <div className="w-12 h-12 bg-[#FFB800]/20 text-[#3D2B1F] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#FFB800] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    </div>
                    <h3 className="font-bold text-xl text-[#3D2B1F] mb-1">Manage Devotees</h3>
                    <p className="text-sm text-[#3D2B1F]/60">View profiles, check streaks, and assign roles.</p>
                  </button>
                  <button onClick={() => setAdminTab('festivals')} className="p-8 bg-white rounded-2xl border border-[#3D2B1F]/5 shadow-sm hover:shadow-md transition-all text-left group">
                    <div className="w-12 h-12 bg-[#FFB800]/20 text-[#3D2B1F] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#FFB800] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                    </div>
                    <h3 className="font-bold text-xl text-[#3D2B1F] mb-1">Push Festivals</h3>
                    <p className="text-sm text-[#3D2B1F]/60">Create events and assign Seva tasks.</p>
                  </button>
                </div>
              </div>
            )}
            {adminTab === 'users' && (
              selectedAdminUser ? (
                <DevoteeDetail userId={selectedAdminUser} onBack={() => setSelectedAdminUser(null)} />
              ) : (
                <DevoteeList onSelectUser={setSelectedAdminUser} />
              )
            )}
            {adminTab === 'festivals' && <FestivalManager />}
            {adminTab === 'factory' && <CourseFactory />}
            {adminTab === 'archive' && <SopanaManager />}
          </AdminLayout>
        )}
      </main>

      <footer className="bg-deepBrown text-cream py-16 px-6 md:px-12 border-t-8 border-saffron">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-saffron rounded-full flex items-center justify-center text-white font-serif text-xl">ॐ</div>
              <span className="font-serif text-2xl font-bold">LearnGita</span>
            </div>
            <p className="text-cream/60 text-sm leading-relaxed">{t('footer_desc')}</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-saffron uppercase tracking-widest text-[10px]">{t('footer_nav')}</h4>
            <ul className="space-y-3 text-cream/70 text-xs font-bold uppercase tracking-widest">
              <li className="hover:text-saffron transition-colors cursor-pointer" onClick={() => navigate(AppSection.Explore)}>{t('nav_explore')}</li>
              <li className="hover:text-saffron transition-colors cursor-pointer" onClick={() => navigate(AppSection.Sadhna)}>{t('nav_sadhna')}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-saffron uppercase tracking-widest text-[10px]">{t('footer_resources')}</h4>
            <ul className="space-y-3 text-cream/70 text-xs font-bold uppercase tracking-widest">
              <li className="hover:text-saffron transition-colors cursor-pointer">Gita Library</li>
              <li className="hover:text-saffron transition-colors cursor-pointer" onClick={() => navigate(AppSection.AdminLogin)}>Admin Portal</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-saffron uppercase tracking-widest text-[10px]">{t('footer_stay_guided')}</h4>
            <div className="flex gap-2">
              <input type="email" placeholder="Email..." className="bg-cream/10 border border-cream/20 rounded-lg px-4 py-2 text-sm flex-1 focus:outline-none focus:border-saffron" />
              <button className="bg-saffron text-white px-4 py-2 rounded-lg font-bold text-sm">Join</button>
            </div>
          </div>
        </div>
      </footer>

      {levelUp && (
        <LevelUpModal
          level={levelUp}
          nextLevel={sadhnaService.getCurrentLevelInfo(user?.currentStreak || 0).nextLevel}
          onClose={() => setLevelUp(null)}
        />
      )}
    </div>
  );
};

export default App;
