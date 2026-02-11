import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { sadhnaService } from '../../services/sadhnaService';
import { adminService } from '../../services/adminService';
import SadhnaCalendar from '../SadhnaCalendar';
import { ArrowLeft, User as UserIcon, Calendar, Activity } from 'lucide-react';

interface DevoteeDetailProps {
    userId: string;
    onBack: () => void;
}

const DevoteeDetail: React.FC<DevoteeDetailProps> = ({ userId, onBack }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDetails();
    }, [userId]);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            // We need a specific get user details including history
            // Reusing existing services where possible
            const history = await sadhnaService.fetchHistory(userId);
            const profile = await adminService.getAllUsers().then(users => users.find((u: any) => u.id === userId));

            if (profile) {
                // Construct full user object
                const fullUser: User = {
                    ...profile as any,
                    sadhnaHistory: history,
                    currentStreak: sadhnaService.calculatePunctualStreak(history.map(h => ({ entry_date: h.date, created_at: h.createdAt || null }))),
                }
                setUser(fullUser);
            }
        } catch (err) {
            console.error("Failed to fetch user details", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-12 text-center">Loading details...</div>;
    if (!user) return <div className="p-12 text-center">User not found</div>;

    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-[#3D2B1F]/60 hover:text-[#3D2B1F] font-bold text-sm uppercase tracking-widest transition-colors mb-4"
            >
                <ArrowLeft size={16} /> Back to List
            </button>

            {/* Profile Header */}
            <div className="bg-white rounded-[2rem] p-8 border border-[#3D2B1F]/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-[#FFFDF0] rounded-full flex items-center justify-center border-4 border-[#FFB800]/20">
                        <UserIcon size={32} className="text-[#FFB800]" />
                    </div>
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-[#3D2B1F]">{user.name}</h1>
                        <div className="flex items-center gap-4 text-sm text-[#3D2B1F]/60 mt-1">
                            <span>{user.email}</span>
                            <span>•</span>
                            <span>{(user as any).city || 'Unknown City'}</span>
                            <span>•</span>
                            <span>{(user as any).gender || 'Unknown Gender'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="text-center px-6 py-3 bg-[#FFFDF0] rounded-xl border border-[#3D2B1F]/5">
                        <div className="text-2xl font-bold text-[#3D2B1F]">{user.currentStreak || 0}</div>
                        <div className="text-[10px] uppercase font-bold text-[#3D2B1F]/40 tracking-widest">Current Streak</div>
                    </div>
                    <div className="text-center px-6 py-3 bg-[#FFB800]/10 rounded-xl border border-[#FFB800]/20">
                        <div className="text-2xl font-bold text-[#FFB800]">{user.sadhnaHistory.length}</div>
                        <div className="text-[10px] uppercase font-bold text-[#3D2B1F]/40 tracking-widest">Total Reports</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="text-[#3D2B1F]/60" size={20} />
                        <h3 className="font-bold text-[#3D2B1F]">Consistency Calendar</h3>
                    </div>
                    <SadhnaCalendar logs={user.sadhnaHistory} />
                </div>

                {/* Recent Activity Column */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="text-[#3D2B1F]/60" size={20} />
                        <h3 className="font-bold text-[#3D2B1F]">Recent Activity</h3>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#3D2B1F]/10 overflow-hidden max-h-[500px] overflow-y-auto">
                        {user.sadhnaHistory.length > 0 ? (
                            <div className="divide-y divide-[#3D2B1F]/5">
                                {[...user.sadhnaHistory].reverse().slice(0, 10).map((log, i) => (
                                    <div key={i} className="p-4 hover:bg-[#FFFDF0]/50 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-[#3D2B1F] text-sm">{log.date}</span>
                                            <span className="text-[#FFB800] font-bold text-sm">{log.score} pts</span>
                                        </div>
                                        <div className="text-[10px] text-[#3D2B1F]/40">
                                            {log.createdAt ? `Submitted: ${new Date(log.createdAt).toLocaleDateString()}` : 'Manual Entry'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-[#3D2B1F]/40 text-sm">No recent activity</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DevoteeDetail;
