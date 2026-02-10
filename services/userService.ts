
import { supabase } from '../supabaseClient';

export const userService = {
    /**
     * Update or create a user profile in the 'users' table.
     * Note: This assumes a 'users' table exists with the specified columns.
     */
    async updateProfile(userId: string, email: string | undefined, profile: { name: string, phone: string, dob: string, city: string, gender: string }) {
        const { data, error } = await supabase
            .from('users')
            .upsert({
                id: userId,
                email: email, // Save email
                name: profile.name,
                phone_number: profile.phone,
                date_of_birth: profile.dob,
                city: profile.city,
                gender: profile.gender,
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' })
            .select()
            .single();

        if (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
        return data;
    },

    /**
     * Fetch a user profile by ID.
     */
    async fetchProfile(userId: string) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows returned'
            console.error("Error fetching profile:", error);
            throw error;
        }
        return data;
    }
};
