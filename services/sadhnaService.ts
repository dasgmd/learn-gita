import { supabase } from '../supabaseClient';
import { SadhnaRecord } from '../types';
import { parseISO, differenceInCalendarDays, format, subDays } from 'date-fns';
import { LEVEL_SYSTEM } from '../constants';

/**
 * Punctual Chain Algorithm:
 * 1. Gather all logs
 * 2. A log is "punctual" if (submissionDate - entryDate) <= 1 calendar day
 * 3. Filter to only punctual logs
 * 4. Sort punctual entry_dates descending
 * 5. Chain must start from today or yesterday
 * 6. Count consecutive days with gap === 1
 */
/**
 * Safely converts a timestamp to a local date string (YYYY-MM-DD).
 * Use this for created_at (which is UTC in DB) to correctly reflect 
 * the user's local day of submission.
 */
function toLocalDateStr(timestamp: string | Date | null): string {
  if (!timestamp) return "";
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  // Use local components to avoid UTC shifting
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Punctual Chain Algorithm - STRICT IMPLEMENTATION
 * 
 * Step 1: Gather all Sadhna logs from the database
 * Step 2: Define 'Punctual': A log is 'Punctual' if (SubmissionDate - EntryDate) <= 1 day
 * Step 3: Filter: Create a new list containing only the logs that are 'Punctual'
 * Step 4: Sort: Sort this list of 'Punctual' logs by EntryDate in descending order (newest first)
 * Step 5: Check Starting Point: If the EntryDate is NOT 'Today' or 'Yesterday', the Current Streak is 0
 * Step 6: Count the Chain: Iterate through sorted list, count consecutive days (gap = 1), stop on first gap > 1
 */
function calculatePunctualStreak(
  logs: { entry_date: string; created_at: string | null }[]
): number {

  // Step 1: Normalize Dates
  const now = new Date();
  const todayStr = format(now, 'yyyy-MM-dd');
  const yesterdayStr = format(subDays(now, 1), 'yyyy-MM-dd');

  // Step 2 & 3: Define Punctuality and Filter
  // Step 2: A record is 'Punctual' if submission_date is SAME or DAY AFTER entry_date.
  // Step 3: Filter the user's logs to find all 'Punctual' entries.
  const punctualDates = new Set<string>();

  logs.forEach(log => {
    // entry_date is already stored as YYYY-MM-DD string in DB
    const entryDateStr = log.entry_date.trim();

    // Convert UTC created_at to user's local YYYY-MM-DD
    // Note: Supabase might return created_at or createdAt depending on mapping
    const rawCreated = (log as any).created_at || (log as any).createdAt;

    if (!rawCreated) {
      return;
    }

    const submittedDateStr = toLocalDateStr(rawCreated);
    const entryDate = parseISO(entryDateStr);
    const submittedDate = parseISO(submittedDateStr);
    const daysDiff = differenceInCalendarDays(submittedDate, entryDate);

    // Punctual if submitted on SAME day (0) or NEXT day (1) in local time
    if (daysDiff >= 0 && daysDiff <= 1) {
      punctualDates.add(entryDateStr);
    }
  });

  const sortedPunctualDates = Array.from(punctualDates).sort((a, b) => b.localeCompare(a));

  // Step 4: Check for Today/Yesterday
  let currentSearchDateStr: string;
  if (punctualDates.has(todayStr)) {
    currentSearchDateStr = todayStr;
  } else if (punctualDates.has(yesterdayStr)) {
    currentSearchDateStr = yesterdayStr;
  } else {
    return 0;
  }

  // Step 5: The Chain Count
  let streak = 1;
  let checkDate = parseISO(currentSearchDateStr);

  while (true) {
    checkDate = subDays(checkDate, 1);
    const checkDateStr = format(checkDate, 'yyyy-MM-dd');

    if (punctualDates.has(checkDateStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export { calculatePunctualStreak };

export const sadhnaService = {
  calculatePunctualStreak, // Export the function on the object too
  async saveSadhna(userId: string, score: number, answers: any) {
    const entryDate = answers.date || format(new Date(), 'yyyy-MM-dd');

    // 1. Save / upsert the log
    const { data, error } = await supabase
      .from('sadhna_logs')
      .upsert({
        user_id: userId,
        entry_date: entryDate,
        total_score: score,
        answers: answers
      }, { onConflict: 'user_id, entry_date' })
      .select()
      .single();

    if (error) throw error;

    // 2. Fetch ALL logs
    const { data: logs, error: logError } = await supabase
      .from('sadhna_logs')
      .select('*') // Select all columns for debugging
      .eq('user_id', userId)
      .order('entry_date', { ascending: false });

    if (logError) {
      console.error("Error fetching logs for streak:", logError);
    }

    // 3. Calculate the Punctual Chain
    const currentStreak = calculatePunctualStreak(
      (logs || []) as { entry_date: string; created_at: string }[]
    );

    // 4. Update user streak in DB
    const { data: userData } = await supabase
      .from('users')
      .select('longest_streak')
      .eq('id', userId)
      .single();

    const newLongest = Math.max(currentStreak, userData?.longest_streak || 0);

    await supabase
      .from('users')
      .update({
        current_streak: currentStreak,
        longest_streak: newLongest,
        last_sadhna_date: entryDate
      })
      .eq('id', userId);

    return { ...data, newStreak: currentStreak, newLongest };
  },

  /**
   * Fetch all entries for the user
   */
  async fetchHistory(userId: string): Promise<SadhnaRecord[]> {
    const { data, error } = await supabase
      .from('sadhna_logs')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false });

    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      date: row.entry_date,
      score: row.total_score,
      answers: row.answers,
      createdAt: row.created_at
    }));
  },

  /**
   * Authentication: Sign Up
   */
  async signUp(email: string, pass: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: name,
          name: name
        }
      }
    });
    if (error) throw error;
    return data;
  },

  /**
   * Authentication: Sign In
   */
  async signIn(email: string, pass: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign Out
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getCurrentLevelInfo(streak: number) {
    let currentLevel = { id: 0, title: 'Novice', minStreak: 0 };
    let nextLevel = LEVEL_SYSTEM[0];

    for (let i = 0; i < LEVEL_SYSTEM.length; i++) {
      if (streak >= LEVEL_SYSTEM[i].minStreak) {
        currentLevel = LEVEL_SYSTEM[i];
        nextLevel = LEVEL_SYSTEM[i + 1] || null;
      } else {
        nextLevel = LEVEL_SYSTEM[i];
        break;
      }
    }

    let progress = 0;
    let daysRemaining = 0;

    if (nextLevel) {
      const range = nextLevel.minStreak - currentLevel.minStreak;
      const currentProgress = streak - currentLevel.minStreak;
      progress = Math.min(100, Math.max(0, (currentProgress / range) * 100));
      daysRemaining = nextLevel.minStreak - streak;
    } else {
      progress = 100;
      daysRemaining = 0;
    }

    return {
      currentLevel,
      nextLevel,
      progress,
      daysRemaining
    };
  },

  checkLevelUp(oldStreak: number, newStreak: number) {
    if (newStreak <= oldStreak) return null;

    const newLevel = this.getCurrentLevelInfo(newStreak).currentLevel;
    const oldLevel = this.getCurrentLevelInfo(oldStreak).currentLevel;

    if (newLevel.id > oldLevel.id) {
      return newLevel;
    }
    return null;
  }
};
