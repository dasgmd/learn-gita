import { supabase } from '../supabaseClient';
import { User, Festival, FestivalTask } from '../types';

export const adminService = {
    /**
     * Check if current user is admin.
     * This is a client-side check for UI convenience.
     * Real security is handled by RLS on the backend.
     */
    async isAdmin(): Promise<boolean> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        // Hardcoded check for bootstrap admin
        if (user.email === 'gmd@learngita.com') return true;

        // Check role in DB
        const { data } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        return data?.role === 'admin';
    },

    /**
     * Fetch all users for the Devotee List.
     */
    async getAllUsers(): Promise<User[]> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false, nullsFirst: true });

        const mapUser = (row: any): User => ({
            id: row.id,
            name: row.name || 'Unnamed Devotee',
            email: row.email,
            role: row.role,
            currentStreak: row.current_streak,
            longestStreak: row.longest_streak,
            lastSadhnaDate: row.last_sadhna_date,
            sadhnaHistory: [], // Not fetched here for performance
            city: row.city,
            gender: row.gender
        } as any);

        if (error) {
            console.error("Supabase error fetching users:", error);
            if (error.message.includes('column "created_at" does not exist')) {
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from('users')
                    .select('*');
                if (fallbackError) throw fallbackError;
                return (fallbackData || []).map(mapUser);
            }
            throw error;
        }
        return (data || []).map(mapUser);
    },

    /**
     * Update a user's role.
     */
    async updateUserRole(userId: string, role: 'user' | 'admin') {
        const { data, error } = await supabase
            .from('users')
            .update({ role })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Create a new festival.
     */
    async createFestival(festival: Omit<Festival, 'id'>) {
        const { data, error } = await supabase
            .from('festivals')
            .insert(festival)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update an existing festival.
     */
    async updateFestival(id: string, festival: Partial<Festival>) {
        const { data, error } = await supabase
            .from('festivals')
            .update(festival)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete a festival.
     */
    async deleteFestival(id: string) {
        const { error } = await supabase
            .from('festivals')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * Add a task to a festival.
     */
    async addTaskToFestival(task: Omit<FestivalTask, 'id'>) {
        const { data, error } = await supabase
            .from('festival_tasks')
            .insert(task)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete a task from a festival.
     */
    async deleteFestivalTask(taskId: string) {
        const { error } = await supabase
            .from('festival_tasks')
            .delete()
            .eq('id', taskId);

        if (error) throw error;
    },

    /**
     * Fetch all Sopanas (lessons) from the database.
     */
    async getSopanas() {
        const { data, error } = await supabase
            .from('sopanas')
            .select('*')
            .order('book_name', { ascending: true })
            .order('book_order', { ascending: true });

        if (error) throw error;
        return data;
    },

    /**
     * Update an existing Sopana.
     */
    async updateSopana(id: string, updates: any) {
        const { data, error } = await supabase
            .from('sopanas')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete a Sopana.
     */
    async deleteSopana(id: string) {
        const { error } = await supabase
            .from('sopanas')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * Delete all Sopanas associated with a specific book.
     */
    async deleteBook(bookName: string) {
        const { error } = await supabase
            .from('sopanas')
            .delete()
            .eq('book_name', bookName);

        if (error) throw error;
    },

    /**
     * Delete ALL Sopanas from the database.
     * WARNING: This action is irreversible.
     */
    async deleteAllSopanas() {
        // We use not-eq to 0-0-0-0 as a hack to delete all rows since supabase delete requires a filter
        // Or we can just use id is not null if we had a filter for that, but RLS usually handles 'true'
        // For safety/easiness, we'll iterate or use a broad filter.
        // A better approach for "delete all" in Supabase client is:
        const { error } = await supabase
            .from('sopanas')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Assuming valid UUIDs are not all zeros

        if (error) throw error;
    }
};
