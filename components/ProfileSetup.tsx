
import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Calendar, Flower2, Send, CheckCircle2 } from 'lucide-react';
import { userService } from '../services/userService';

const ProfileSetup: React.FC<{ userId?: string, userEmail?: string, userName?: string, onComplete?: () => void }> = ({ userId, userEmail, userName, onComplete }) => {
    const [formData, setFormData] = useState({
        name: userName || '',
        phone: '',
        otp: '',
        dob: '',
        city: '',
        gender: '' // 'boy' or 'girl'
    });

    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isDetectingCity, setIsDetectingCity] = useState(false);
    const [activeSection, setActiveSection] = useState<'personal' | 'spiritual'>('personal');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Fetch existing profile data
    useEffect(() => {
        if (userId) {
            const loadProfile = async () => {
                setIsLoadingData(true);
                try {
                    const profile = await userService.fetchProfile(userId);
                    if (profile) {
                        setFormData({
                            name: profile.name || '',
                            phone: profile.phone_number || '',
                            otp: '',
                            dob: profile.date_of_birth || '',
                            city: profile.city || '',
                            gender: profile.gender || ''
                        });
                        // If profile exists, maybe skip to spiritual section? 
                        // For now, let's keep them on personal to review/edit
                        if (profile.gender) {
                            // Optional: could auto-advance
                        }
                    }
                } catch (error) {
                    console.error("Failed to load profile", error);
                } finally {
                    setIsLoadingData(false);
                }
            };
            loadProfile();
        }
    }, [userId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSendOtp = () => {
        if (formData.phone.length >= 10) {
            setIsOtpSent(true);
        }
    };

    const detectCity = () => {
        setIsDetectingCity(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    // Using a simple open reverse geocoding API or placeholder
                    // For now, let's pretend we got it or use a placeholder logic
                    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
                    const data = await response.json();
                    setFormData(prev => ({ ...prev, city: data.city || data.locality || 'Unknown City' }));
                } catch (error) {
                    console.error("Error detecting city:", error);
                } finally {
                    setIsDetectingCity(false);
                }
            }, (error) => {
                console.error("Geolocation error:", error);
                setIsDetectingCity(false);
            });
        } else {
            setIsDetectingCity(false);
        }
    };

    const handleComplete = async () => {
        if (!userId) {
            onComplete?.();
            return;
        }

        setIsSaving(true);
        setSaveError(null);
        try {
            await userService.updateProfile(userId, userEmail, {
                name: formData.name,
                phone: formData.phone,
                dob: formData.dob,
                city: formData.city,
                gender: formData.gender
            });
            onComplete?.();
        } catch (err: any) {
            setSaveError(err.message || "Failed to save your profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFDF0] py-12 px-4 sm:px-6 lg:px-8 font-serif">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFB800]/10 rounded-full mb-4">
                        <Flower2 className="w-8 h-8 text-[#FFB800]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#3D2B1F]">
                        Welcome to the <span className="text-[#FFB800]">Gurukul</span>
                    </h1>
                    <p className="text-[#3D2B1F]/60 text-lg max-w-md mx-auto">
                        Let us personalize your journey of wisdom. Complete your enrollment profile.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-12 space-x-8">
                    <button
                        onClick={() => setActiveSection('personal')}
                        className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${activeSection === 'personal' ? 'bg-[#FFB800] text-white shadow-lg' : 'bg-white text-[#3D2B1F]/40 hover:bg-[#FFB800]/10'}`}
                    >
                        Personal Identity
                    </button>
                    <button
                        onClick={() => setActiveSection('spiritual')}
                        className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${activeSection === 'spiritual' ? 'bg-[#FFB800] text-white shadow-lg' : 'bg-white text-[#3D2B1F]/40 hover:bg-[#FFB800]/10'}`}
                    >
                        Spiritual Journey
                    </button>
                </div>

                {/* Section 1: Personal Identity */}
                <div className={`transition-all duration-500 ease-in-out ${activeSection === 'personal' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none hidden'}`}>
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#FFB800]/10 space-y-8">
                        <h2 className="text-2xl font-bold text-[#3D2B1F]">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Legal Name */}
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="peer w-full bg-transparent border-b-2 border-[#3D2B1F]/10 focus:border-[#FFB800] py-3 text-lg outline-none transition-all placeholder-transparent"
                                    placeholder="Legal Name"
                                />
                                <label
                                    htmlFor="name"
                                    className="absolute left-0 -top-5 text-[#3D2B1F]/40 text-sm transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:top-3 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-[#FFB800]"
                                >
                                    Legal Name
                                </label>
                                <User className="absolute right-0 top-3 w-5 h-5 text-[#3D2B1F]/20" />
                            </div>

                            {/* DOB */}
                            <div className="relative">
                                <input
                                    type="date"
                                    name="dob"
                                    id="dob"
                                    value={formData.dob}
                                    onChange={handleInputChange}
                                    className="peer w-full bg-transparent border-b-2 border-[#3D2B1F]/10 focus:border-[#FFB800] py-3 text-lg outline-none transition-all"
                                />
                                <label className="absolute left-0 -top-5 text-[#3D2B1F]/40 text-sm">
                                    Date of Birth
                                </label>
                                <Calendar className="absolute right-0 top-3 w-5 h-5 text-[#3D2B1F]/20" />
                            </div>

                            {/* Phone Verification */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="peer w-full bg-transparent border-b-2 border-[#3D2B1F]/10 focus:border-[#FFB800] py-3 text-lg outline-none transition-all placeholder-transparent"
                                        placeholder="Mobile Number"
                                    />
                                    <label
                                        htmlFor="phone"
                                        className="absolute left-0 -top-5 text-[#3D2B1F]/40 text-sm transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:top-3 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-[#FFB800]"
                                    >
                                        Mobile Number
                                    </label>
                                    <Phone className="absolute right-0 top-3 w-5 h-5 text-[#3D2B1F]/20" />
                                </div>
                                {!isOtpSent ? (
                                    <button
                                        onClick={handleSendOtp}
                                        className="text-[#FFB800] font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                                    >
                                        Send OTP <Send className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="otp"
                                                id="otp"
                                                maxLength={4}
                                                value={formData.otp}
                                                onChange={handleInputChange}
                                                className="peer w-full bg-[#FFB800]/5 border-2 border-[#FFB800]/20 focus:border-[#FFB800] rounded-xl px-4 py-3 text-2xl font-mono tracking-[1em] outline-none transition-all text-center"
                                                placeholder="0000"
                                            />
                                            <label
                                                className="absolute left-4 -top-3 px-1 bg-white text-[#FFB800] text-xs font-bold"
                                            >
                                                Enter 4-digit OTP
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Location */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="city"
                                        id="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="peer w-full bg-transparent border-b-2 border-[#3D2B1F]/10 focus:border-[#FFB800] py-3 text-lg outline-none transition-all placeholder-transparent"
                                        placeholder="Current City"
                                    />
                                    <label
                                        htmlFor="city"
                                        className="absolute left-0 -top-5 text-[#3D2B1F]/40 text-sm transition-all peer-placeholder-shown:text-lg peer-placeholder-shown:top-3 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-[#FFB800]"
                                    >
                                        Current City
                                    </label>
                                    <MapPin className="absolute right-0 top-3 w-5 h-5 text-[#3D2B1F]/20" />
                                </div>
                                <button
                                    onClick={detectCity}
                                    disabled={isDetectingCity}
                                    className="text-[#3D2B1F]/60 text-xs font-bold uppercase tracking-widest hover:text-[#FFB800] transition-colors"
                                >
                                    {isDetectingCity ? 'Finding you...' : 'Detect My City'}
                                </button>
                            </div>
                        </div>

                        {/* Gender Selection */}
                        <div className="space-y-6 pt-4">
                            <h3 className="text-xl font-bold text-[#3D2B1F]">Self Identity</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, gender: 'boy' }))}
                                    className={`group relative overflow-hidden rounded-3xl border-4 transition-all duration-300 ${formData.gender === 'boy' ? 'border-[#FFB800] shadow-[0_0_25px_rgba(255,184,0,0.3)] scale-105' : 'border-transparent bg-white shadow-sm hover:border-[#FFB800]/20'}`}
                                >
                                    <div className="aspect-[4/5] bg-gradient-to-b from-blue-50 to-white p-6 flex flex-col items-center justify-between">
                                        <img
                                            src="/assets/avatars/boy.png"
                                            alt="Boy"
                                            className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="text-center">
                                            <span className={`text-xl font-bold transition-colors ${formData.gender === 'boy' ? 'text-[#FFB800]' : 'text-[#3D2B1F]/40'}`}>Seeker (Boy)</span>
                                        </div>
                                    </div>
                                    {formData.gender === 'boy' && (
                                        <div className="absolute top-4 right-4 bg-[#FFB800] text-white p-1 rounded-full shadow-lg">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    )}
                                </button>

                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, gender: 'girl' }))}
                                    className={`group relative overflow-hidden rounded-3xl border-4 transition-all duration-300 ${formData.gender === 'girl' ? 'border-[#FFB800] shadow-[0_0_25px_rgba(255,184,0,0.3)] scale-105' : 'border-transparent bg-white shadow-sm hover:border-[#FFB800]/20'}`}
                                >
                                    <div className="aspect-[4/5] bg-gradient-to-b from-orange-50 to-white p-6 flex flex-col items-center justify-between">
                                        <img
                                            src="/assets/avatars/girl.png"
                                            alt="Girl"
                                            className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="text-center">
                                            <span className={`text-xl font-bold transition-colors ${formData.gender === 'girl' ? 'text-[#FFB800]' : 'text-[#3D2B1F]/40'}`}>Seeker (Girl)</span>
                                        </div>
                                    </div>
                                    {formData.gender === 'girl' && (
                                        <div className="absolute top-4 right-4 bg-[#FFB800] text-white p-1 rounded-full shadow-lg">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="pt-8">
                            <button
                                onClick={() => setActiveSection('spiritual')}
                                className="w-full bg-[#3D2B1F] text-[#FFFDF0] py-4 rounded-2xl font-bold text-xl hover:bg-[#FFB800] hover:text-white transition-all transform hover:-translate-y-1 shadow-xl"
                            >
                                Proceed to Spiritual Identity
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section 2: Spiritual Identity */}
                <div className={`transition-all duration-500 ease-in-out ${activeSection === 'spiritual' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none hidden'}`}>
                    <div className="bg-white rounded-3xl p-12 shadow-sm border border-[#FFB800]/10 text-center space-y-8">
                        <h2 className="text-3xl font-bold text-[#3D2B1F]">Your Spiritual Identity</h2>

                        <div className="py-12 px-8 bg-gradient-to-br from-[#FFFDF0] to-white rounded-3xl border border-dashed border-[#FFB800]/30 flex flex-col items-center space-y-6">
                            <div className="w-24 h-24 bg-white rounded-full shadow-inner flex items-center justify-center p-4">
                                <div className="animate-pulse">
                                    <Flower2 className="w-12 h-12 text-[#FFB800]/40" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-serif italic text-[#FFB800]">Sadhana Path Coming Soon</h3>
                                <p className="text-[#3D2B1F]/60 max-w-sm mx-auto">
                                    Personalizing your path to wisdom... we are analyzing ancient patterns to guide your specific journey. More details coming soon.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-2 h-2 rounded-full bg-[#FFB800]/20 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                                ))}
                            </div>
                        </div>

                        {saveError && (
                            <div className="text-red-500 text-sm font-bold bg-red-50 p-4 rounded-xl border border-red-100">
                                {saveError}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => setActiveSection('personal')}
                                disabled={isSaving}
                                className="flex-1 py-4 border-2 border-[#3D2B1F]/10 rounded-2xl font-bold text-[#3D2B1F]/40 hover:border-[#FFB800] hover:text-[#FFB800] transition-all disabled:opacity-50"
                            >
                                Back to Personal
                            </button>
                            <button
                                onClick={handleComplete}
                                disabled={isSaving}
                                className="flex-[2] bg-[#FFB800] text-white py-4 rounded-2xl font-bold text-xl hover:shadow-[0_10px_30px_rgba(255,184,0,0.4)] transition-all transform hover:-translate-y-1 shadow-lg disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    "Complete Enrollment"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetup;
