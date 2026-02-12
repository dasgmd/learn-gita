import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Loader2, User, Trophy } from 'lucide-react';

interface StudentProgress {
    user_id: string;
    user_name: string;
    email: string;
    completed_sopanas: number;
    total_sopanas: number;
    progress_percentage: number;
    enrolled_at: string;
}

const StudentProgressView: React.FC = () => {
    const [students, setStudents] = useState<StudentProgress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            // 1. Get all enrollments for "Message of Godhead"
            // Ideally we'd filter by course_id, but for now we'll assume there's one main course or we get all
            const { data: enrollments, error: enrollError } = await supabase
                .from('enrollments')
                .select(`
            user_id,
            enrolled_at,
            course_id
        `);

            if (enrollError) throw enrollError;

            // 2. Get total sopanas count for "Message of Godhead"
            // In a real app we'd join with courses table
            const { count: totalSopanas } = await supabase
                .from('sopanas')
                .select('*', { count: 'exact', head: true })
                .eq('book_name', 'Message of Godhead');

            const total = totalSopanas || 1; // Avoid division by zero

            // 3. For each student, get their completed progress count
            const studentData: StudentProgress[] = [];

            for (const enr of enrollments || []) {
                // Fetch user details (mocking name for now if profile table isn't joined)
                const { data: userData } = await supabase.auth.admin.getUserById(enr.user_id).catch(() => ({ data: null })); // Admin only
                // Fallback: we might not have access to auth.users from client. 
                // We'll trust we have a profiles table or just use ID. 
                // For this demo, we'll try to fetch from a 'profiles' table if it exists, otherwise placeholder.

                // Count completed sopanas for this user
                const { count: completedCount } = await supabase
                    .from('user_sopana_progress')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', enr.user_id)
                    .eq('status', 'completed');

                studentData.push({
                    user_id: enr.user_id,
                    user_name: 'Devotee', // Placeholder until we have profile fetch
                    email: 'Hidden',
                    completed_sopanas: completedCount || 0,
                    total_sopanas: total,
                    progress_percentage: Math.round(((completedCount || 0) / total) * 100),
                    enrolled_at: new Date(enr.enrolled_at).toLocaleDateString()
                });
            }

            // Sort by progress desc
            studentData.sort((a, b) => b.progress_percentage - a.progress_percentage);
            setStudents(studentData);

        } catch (err) {
            console.error("Error fetching progress:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-saffron" /></div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="font-serif text-2xl font-bold text-[#4A3728]">Student Journey Tracker</h2>
                    <p className="text-[#4A3728]/60">Monitoring progress for "Message of Godhead"</p>
                </div>
                <div className="bg-saffron/10 text-saffron px-4 py-2 rounded-xl font-bold">
                    {students.length} Active Students
                </div>
            </div>

            <div className="grid gap-4">
                {students.map((student) => (
                    <div key={student.user_id} className="bg-white p-6 rounded-2xl border border-clay/10 shadow-sm flex items-center gap-6">
                        <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center text-clay font-bold text-xl">
                            <User />
                        </div>

                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-[#4A3728]">{student.user_name} <span className="text-xs font-normal text-gray-400">({student.user_id.slice(0, 8)}...)</span></h3>
                                <span className="text-saffron font-bold">{student.progress_percentage}%</span>
                            </div>

                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-saffron to-orange-500 transition-all duration-1000"
                                    style={{ width: `${student.progress_percentage}%` }}
                                />
                            </div>

                            <div className="flex justify-between text-xs text-gray-400 font-medium">
                                <span>Enrolled: {student.enrolled_at}</span>
                                <span>{student.completed_sopanas} / {student.total_sopanas} Steps Completed</span>
                            </div>
                        </div>

                        {student.progress_percentage === 100 && (
                            <div className="text-yellow-500 animate-bounce">
                                <Trophy size={32} />
                            </div>
                        )}
                    </div>
                ))}

                {students.length === 0 && (
                    <div className="text-center p-10 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        No students enrolled yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentProgressView;
