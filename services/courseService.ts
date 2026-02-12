import { supabase } from '../supabaseClient';
import { Course, Enrollment, Sopana, UserSopanaProgress } from '../types';

export const courseService = {
    // Fetch all available courses
    async getAllCourses(): Promise<Course[]> {
        const { data, error } = await supabase
            .from('courses')
            .select('*');

        if (error) throw error;
        return data || [];
    },

    // Fetch a specific course by slug
    async getCourseBySlug(slug: string): Promise<Course | null> {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) return null;
        return data;
    },

    // Check if user is enrolled
    async getEnrollment(courseId: string): Promise<Enrollment | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('enrollments')
            .select('*')
            .eq('user_id', user.id)
            .eq('course_id', courseId)
            .maybeSingle();

        if (error) return null;
        return data;
    },

    // Enroll user in a course
    async enrollUser(courseId: string): Promise<Enrollment> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('enrollments')
            .insert({ user_id: user.id, course_id: courseId })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Fetch sopanas for a course (ordered)
    async getCourseSopanas(bookName: string): Promise<Sopana[]> {
        const { data, error } = await supabase
            .from('sopanas')
            .select('*')
            .eq('book_name', bookName)
            .order('book_order', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    // Fetch user progress for all sopanas in a course
    async getUserProgress(sopanaIds: string[]): Promise<UserSopanaProgress[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || sopanaIds.length === 0) return [];

        const { data, error } = await supabase
            .from('user_sopana_progress')
            .select('*')
            .eq('user_id', user.id)
            .in('sopana_id', sopanaIds);

        if (error) throw error;
        return data || [];
    },

    // Update progress for a specific sopana
    async updateSopanaProgress(sopanaId: string, status: 'unlocked' | 'completed', score: number = 0) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Upsert progress
        const { data, error } = await supabase
            .from('user_sopana_progress')
            .upsert({
                user_id: user.id,
                sopana_id: sopanaId,
                status,
                score,
                completed_at: status === 'completed' ? new Date().toISOString() : undefined
            }, { onConflict: 'user_id,sopana_id' })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Calculate total course completion percentage
    calculateCompletion(totalSopanas: number, completedCount: number): number {
        if (totalSopanas === 0) return 0;
        return Math.min(100, Math.round((completedCount / totalSopanas) * 100));
    }
};
