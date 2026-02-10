import { supabase } from '../supabaseClient';
import { SadhnaRecord } from '../types';
import { parseISO, differenceInCalendarDays, format, subDays } from 'date-fns';

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
 * Extract just the date portion (yyyy-MM-dd) from any timestamp string.
 * Handles: "2026-02-10T14:30:00Z", "2026-02-10 14:30:00+00", "2026-02-10"
 */
function extractDateStr(timestamp: string): string {
  // Split on T or space to handle both ISO and Postgres formats
  return timestamp.split(/[T ]/)[0];
}

function calculatePunctualStreak(
  logs: { entry_date: string; created_at: string | null }[]
): number {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');

  console.log('[Streak Debug] Today:', todayStr, '| Yesterday:', yesterdayStr);
  console.log('[Streak Debug] Total logs:', logs.length);

  // Step 2 & 3: Filter to only punctual entries
  const punctualDates = new Set<string>();
  for (const log of logs) {
    const entryDateStr = extractDateStr(log.entry_date);

    // If created_at is missing, treat as punctual (benefit of the doubt)
    if (!log.created_at) {
      console.log('[Streak Debug]', entryDateStr, '→ no created_at, treating as punctual');
      punctualDates.add(entryDateStr);
      continue;
    }

    const submittedDateStr = extractDateStr(log.created_at);
    const entryD = parseISO(entryDateStr);
    const submittedD = parseISO(submittedDateStr);
    const daysDiff = differenceInCalendarDays(submittedD, entryD);

    console.log('[Streak Debug]', entryDateStr, '| submitted:', submittedDateStr, '| diff:', daysDiff, daysDiff <= 1 ? '✅ punctual' : '⚠️ late');

    if (daysDiff >= 0 && daysDiff <= 1) {
      punctualDates.add(entryDateStr);
    }
  }

  // Step 4: Sort punctual dates descending
  const sorted = Array.from(punctualDates).sort((a, b) =>
    parseISO(b).getTime() - parseISO(a).getTime()
  );

  console.log('[Streak Debug] Punctual dates (sorted desc):', sorted);

  if (sorted.length === 0) {
    console.log('[Streak Debug] No punctual dates → streak = 0');
    return 0;
  }

  // Step 5: Chain must start from today or yesterday
  const mostRecent = sorted[0];
  if (mostRecent !== todayStr && mostRecent !== yesterdayStr) {
    console.log('[Streak Debug] Most recent', mostRecent, 'is not today/yesterday → streak = 0');
    return 0;
  }

  // Step 6: Count the chain
  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const gap = differenceInCalendarDays(parseISO(sorted[i]), parseISO(sorted[i + 1]));
    if (gap === 1) {
      streak++;
    } else {
      break;
    }
  }

  console.log('[Streak Debug] Final streak:', streak);
  return streak;
}

export { calculatePunctualStreak };

export const sadhnaService = {
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
      .select('entry_date, created_at')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false });

    if (logError) console.error("Error fetching logs for streak:", logError);

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
  }
};
