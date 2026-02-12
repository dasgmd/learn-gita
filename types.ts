
export type Language = 'en' | 'hi';

export interface SadhnaRecord {
  id: string;
  date: string;
  score: number;
  answers: Record<string, any>;
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  sadhnaHistory: SadhnaRecord[];
  currentStreak?: number;
  longestStreak?: number;
  lastSadhnaDate?: string;
  role?: 'user' | 'admin';
}

export interface Lesson {
  id: string;
  title: string;
  hindiTitle: string;
  videoUrl: string;
  shloka?: {
    sanskrit: string;
    translation: string;
    hindiTranslation: string;
  };
  content: string;
  hindiContent: string;
  isCompleted?: boolean;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  duration?: string;
  cover_image?: string;
  lessons?: Lesson[]; // kept for backward compatibility if needed, but we use Sopana now
  progress?: number; // calculated at runtime
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
}

export interface UserSopanaProgress {
  id: string;
  user_id: string;
  sopana_id: string;
  status: 'locked' | 'unlocked' | 'completed';
  score: number;
  completed_at?: string;
}

export interface SadhnaItem {
  id: string;
  label: string;
  completed: boolean;
  target: number;
  current: number;
  unit: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export enum AppSection {
  Home = 'home',
  Explore = 'explore',
  Sadhna = 'sadhna',
  Auth = 'auth',
  Dashboard = 'dashboard',
  CourseView = 'course-view',
  About = 'about',
  ProfileSetup = 'profile-setup',
  VaishnavaHub = 'vaishnava-hub',
  AdminLogin = 'admin-login',
  AdminDashboard = 'admin-dashboard'
}

export interface Festival {
  id: string;
  name: string;
  date: string;
  description: string;
  significance: string;
  fast_type: string;
}

export interface FestivalTask {
  id: string;
  festival_id: string;
  task_description: string;
  point_value: number;
}

export interface UserFestivalCompletion {
  id: string;
  user_id: string;
  task_id: string;
  completed_at: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Sopana {
  id?: string;
  book_name?: string;
  book_order?: number;
  title: string;
  reading_text: string;
  revision_notes: string[];
  quiz: QuizQuestion[];
  created_at?: string;
}
