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
    async getAllUsers() {
        // We need to fetch users and potentially their calculated stats
        // Ideally we join or just fetch basic info + streak
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
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
    }
};
