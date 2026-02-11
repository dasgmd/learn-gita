import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { adminService } from '../../services/adminService';
import { ShieldCheck, Lock } from 'lucide-react';

interface AdminLoginProps {
    onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Check if user is actually an admin
            const isAdmin = await adminService.isAdmin();
            if (!isAdmin) {
                await supabase.auth.signOut();
                throw new Error('Unauthorized: You do not have admin access.');
            }

            onLoginSuccess();
        } catch (err: any) {
            console.error('Admin login failed:', err);
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFDF0] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-[#3D2B1F]/10 overflow-hidden">
                <div className="bg-[#3D2B1F] p-8 text-center">
                    <div className="w-16 h-16 bg-[#FFB800] rounded-full flex items-center justify-center mx-auto mb-4 text-[#3D2B1F]">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-[#FFFDF0]">Admin Portal</h1>
                    <p className="text-[#FFFDF0]/60 text-sm mt-2">Restricted Access Only</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/60">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-[#FFFDF0] border border-[#3D2B1F]/10 rounded-lg focus:outline-none focus:border-[#FFB800] transition-colors"
                                    placeholder="admin@learngita.com"
                                    required
                                />
                                <ShieldCheck className="absolute left-3 top-3.5 text-[#3D2B1F]/30" size={18} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/60">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-[#FFFDF0] border border-[#3D2B1F]/10 rounded-lg focus:outline-none focus:border-[#FFB800] transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                                <Lock className="absolute left-3 top-3.5 text-[#3D2B1F]/30" size={18} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FFB800] text-[#3D2B1F] font-bold py-3 rounded-lg hover:bg-[#E5A500] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Authenticating...' : 'Enter Secure Area'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
