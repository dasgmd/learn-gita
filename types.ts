
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
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  image: string;
  progress?: number;
  lessons?: Lesson[];
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
  ProfileSetup = 'profile-setup'
}
