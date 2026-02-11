import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { User } from '../../types';
import { Search, ChevronRight, Shield, ShieldCheck, MoreVertical } from 'lucide-react';

interface DevoteeListProps {
    onSelectUser: (userId: string) => void;
}

const DevoteeList: React.FC<DevoteeListProps> = ({ onSelectUser }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllUsers();
            setUsers(data as any[]);
        } catch (err: any) {
            console.error("Failed to fetch users", err);
            alert(`Failed to load devotees: ${err.message || err}`);
        } finally {
            setLoading(false);
        }
    };

    const handleMakeAdmin = async (userId: string, currentRole?: string) => {
        if (!confirm(`Are you sure you want to ${currentRole === 'admin' ? 'revoke' : 'grant'} admin access?`)) return;

        try {
            const newRole = currentRole === 'admin' ? 'user' : 'admin';
            await adminService.updateUserRole(userId, newRole);
            fetchUsers(); // Refresh list
        } catch (err) {
            alert("Failed to update role");
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center p-12">Loading devotees...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-serif text-3xl font-bold text-[#3D2B1F]">Devotee Management</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search devotees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-full border border-[#3D2B1F]/20 bg-white focus:outline-none focus:border-[#FFB800] w-64"
                    />
                    <Search className="absolute left-3 top-2.5 text-[#3D2B1F]/40" size={16} />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#3D2B1F]/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#FFFDF0] border-b border-[#3D2B1F]/5">
                        <tr>
                            <th className="p-6 font-bold text-[#3D2B1F]/60 uppercase text-xs tracking-widest">Devotee</th>
                            <th className="p-6 font-bold text-[#3D2B1F]/60 uppercase text-xs tracking-widest">City</th>
                            <th className="p-6 font-bold text-[#3D2B1F]/60 uppercase text-xs tracking-widest text-center">Streak</th>
                            <th className="p-6 font-bold text-[#3D2B1F]/60 uppercase text-xs tracking-widest text-center">Level</th>
                            <th className="p-6 font-bold text-[#3D2B1F]/60 uppercase text-xs tracking-widest text-center">Role</th>
                            <th className="p-6 font-bold text-[#3D2B1F]/60 uppercase text-xs tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3D2B1F]/5">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-[#FFFDF0]/50 transition-colors group">
                                <td className="p-6">
                                    <div>
                                        <div className="font-bold text-[#3D2B1F]">{user.name}</div>
                                        <div className="text-xs text-[#3D2B1F]/50">{user.email}</div>
                                    </div>
                                </td>
                                <td className="p-6 text-[#3D2B1F]/80">
                                    {(user as any).city || 'Not Set'}
                                </td>
                                <td className="p-6 text-center">
                                    <div className="inline-flex items-center gap-1 font-bold text-[#FFB800]">
                                        <span>🔥</span> {user.currentStreak || 0}
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    {/* Level logic based on streak */}
                                    <span className="inline-block px-3 py-1 bg-[#3D2B1F]/5 rounded-full text-xs font-bold text-[#3D2B1F]/70">
                                        Lvl {Math.floor((user.longestStreak || 0) / 7) + 1}
                                    </span>
                                </td>
                                <td className="p-6 text-center">
                                    {user.role === 'admin' ? (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200">
                                            <ShieldCheck size={12} /> Admin
                                        </span>
                                    ) : (
                                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold">User</span>
                                    )}
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleMakeAdmin(user.id, user.role)}
                                            className="p-2 hover:bg-[#3D2B1F]/10 rounded-full text-[#3D2B1F]/50 hover:text-[#3D2B1F]"
                                            title={user.role === 'admin' ? "Revoke Admin" : "Make Admin"}
                                        >
                                            <Shield size={16} />
                                        </button>
                                        <button
                                            onClick={() => onSelectUser(user.id)}
                                            className="flex items-center gap-1 px-4 py-2 bg-[#FFB800] text-[#3D2B1F] text-xs font-bold rounded-lg hover:bg-[#E5A500] transition-colors"
                                        >
                                            Details <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center text-[#3D2B1F]/40 italic">
                        No devotees found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </div>
    );
};

export default DevoteeList;
