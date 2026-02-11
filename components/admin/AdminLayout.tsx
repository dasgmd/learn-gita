import React, { useState } from 'react';
import { Users, Calendar, LogOut, LayoutDashboard } from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
    activeTab: 'dashboard' | 'users' | 'festivals';
    onTabChange: (tab: 'dashboard' | 'users' | 'festivals') => void;
    onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab, onTabChange, onLogout }) => {
    return (
        <div className="min-h-screen bg-[#FFFDF0] flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#3D2B1F] text-[#FFFDF0] flex flex-col fixed h-full shadow-2xl z-10">
                <div className="p-8 border-b border-[#FFFDF0]/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#FFB800] rounded-full flex items-center justify-center text-[#3D2B1F] font-serif font-bold">
                            LG
                        </div>
                        <div>
                            <h2 className="font-bold text-lg leading-none">LearnGita</h2>
                            <span className="text-[10px] text-[#FFB800] uppercase tracking-widest">Admin Panel</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => onTabChange('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard'
                                ? 'bg-[#FFB800] text-[#3D2B1F] font-bold'
                                : 'text-[#FFFDF0]/70 hover:bg-[#FFFDF0]/5 hover:text-[#FFFDF0]'
                            }`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </button>

                    <button
                        onClick={() => onTabChange('users')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users'
                                ? 'bg-[#FFB800] text-[#3D2B1F] font-bold'
                                : 'text-[#FFFDF0]/70 hover:bg-[#FFFDF0]/5 hover:text-[#FFFDF0]'
                            }`}
                    >
                        <Users size={20} />
                        <span>Devotees</span>
                    </button>

                    <button
                        onClick={() => onTabChange('festivals')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'festivals'
                                ? 'bg-[#FFB800] text-[#3D2B1F] font-bold'
                                : 'text-[#FFFDF0]/70 hover:bg-[#FFFDF0]/5 hover:text-[#FFFDF0]'
                            }`}
                    >
                        <Calendar size={20} />
                        <span>Festivals</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-[#FFFDF0]/10">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
