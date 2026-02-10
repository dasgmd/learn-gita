
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Resilient initialization: Return a mock client if keys are missing to preventing crashing
export const supabase = (() => {
    const isPlaceholder = !SUPABASE_URL || SUPABASE_URL.includes('YOUR_SUPABASE_URL') || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY');

    if (isPlaceholder) {
        console.warn('⚠️ Supabase credentials missing or placeholders found. App running in offline/demo mode.');
        return {
            auth: {
                getSession: () => Promise.resolve({ data: { session: null }, error: null }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
                signUp: () => Promise.reject(new Error("Supabase not configured")),
                signInWithPassword: () => Promise.reject(new Error("Supabase not configured")),
                signOut: () => Promise.resolve({ error: null }),
            },
            from: () => ({
                select: () => ({ eq: () => ({ order: () => ({ limit: () => ({ data: [], error: null }) }) }) }),
                upsert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) })
            })
        } as any;
    }
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();
