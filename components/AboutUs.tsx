import React, { useState } from 'react';
import { Mail, Youtube, Phone, ExternalLink } from 'lucide-react';

const AboutUs: React.FC<{ t: (key: string) => string }> = ({ t }) => {
    const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'contact'>('about');

    const tabs = [
        { id: 'about', label: 'About Me' },
        { id: 'experience', label: 'Experience' },
        { id: 'contact', label: 'Contact' }
    ];

    const missionText = "Bringing the timeless wisdom of the Bhagavad Gita to the modern world through structured, accessible, and digital learning.";

    const aboutPoints = [
        "B. Tech Bio Chemical Engineering HBTI Kanpur",
        "Senior Physics Lecturer",
        "HOD Physics Sri Chaitanya & Knowledge Planet Dubai",
        "Bhakti-yogi since 2013",
        "Bhakti-sastri at Simple Vedas",
        "ISKCON Preacher",
        "VP at ISKCON Kushinagar",
        "Director at Learn Gita"
    ];

    const experiencePoints = [
        "Teaching since age 18",
        "Seminars in schools/colleges globally",
        "Teacher training programs"
    ];

    return (
        <div className="bg-cream min-h-screen">
            {/* Section 1: Learn Gita (The Mission) */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h1 className="font-serif text-4xl md:text-5xl text-deepBrown font-bold">
                        Learn Gita: The Mission
                    </h1>
                    <div className="h-1 w-24 bg-saffron mx-auto rounded-full"></div>
                    <p className="text-xl md:text-2xl text-charcoal/80 leading-relaxed font-light italic">
                        "{missionText}"
                    </p>
                </div>
            </section>

            {/* Section 2: Our Inspiration */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-saffron/10 rounded-2xl blur-xl group-hover:bg-saffron/20 transition-all"></div>
                        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&q=80&w=800"
                                alt="Srila Prabhupada"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-deepBrown to-transparent">
                                <p className="text-white font-serif text-xl">His Divine Grace A.C. Bhaktivedanta Swami Prabhupada</p>
                                <p className="text-saffron/80 text-sm italic">Founder-Acharya of ISKCON</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative p-1">
                        {/* Mandir Arch Border Style */}
                        <div className="absolute inset-0 border-2 border-saffron/30 rounded-[2rem] pointer-events-none"></div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cream px-4">
                            <div className="w-12 h-6 border-t-2 border-x-2 border-saffron/50 rounded-t-full"></div>
                        </div>

                        <div className="bg-white/50 backdrop-blur-sm p-10 rounded-[2rem] space-y-6 relative">
                            <h2 className="font-serif text-3xl text-deepBrown font-bold">Our Inspiration</h2>
                            <p className="text-charcoal/80 leading-relaxed">
                                The spiritual foundation of LearnGita.com is built upon the teachings of the Brahma-Madhva-Gaudiya Sampradaya,
                                as presented by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada. Our goal is to present this
                                sublime knowledge exactly as it is, without adulteration, while making it relevant for the modern context.
                            </p>
                            <div className="pt-4 border-t border-saffron/20">
                                <p className="text-deepBrown italic font-serif">
                                    "Knowledge means to know that you are not the body, but the soul."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Garga Muni Das (Director Profile) */}
            <section className="py-24 px-6 bg-white/50 backdrop-blur-md">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden divine-shadow flex flex-col md:flex-row border border-clay/10">
                        {/* Left Column: Image & Basic Info */}
                        <div className="md:w-1/3 bg-cream/50 p-8 flex flex-col items-center text-center space-y-6">
                            <div className="w-48 h-48 rounded-full border-4 border-saffron p-1 shadow-lg">
                                <img
                                    src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=400"
                                    alt="Garga Muni Das"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-serif text-2xl text-deepBrown font-bold">Garga Muni Das</h3>
                                <p className="text-saffron font-bold text-sm uppercase tracking-widest">Director, Learn Gita</p>
                            </div>
                            <div className="flex gap-4">
                                <a href="mailto:dasgargamuni@gmail.com" className="text-charcoal/40 hover:text-saffron transition-colors"><Mail size={20} /></a>
                                <a href="https://www.youtube.com/@GargaMuniDas" target="_blank" rel="noopener noreferrer" className="text-charcoal/40 hover:text-saffron transition-colors"><Youtube size={20} /></a>
                                <a href="tel:+919760036783" className="text-charcoal/40 hover:text-saffron transition-colors"><Phone size={20} /></a>
                            </div>
                        </div>

                        {/* Right Column: Tabs & Content */}
                        <div className="md:w-2/3 p-8 md:p-12 flex flex-col">
                            <div className="flex flex-wrap gap-3 mb-8">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 border ${activeTab === tab.id
                                            ? 'bg-saffron text-white border-saffron shadow-lg'
                                            : 'bg-cream text-deepBrown border-saffron/20 hover:border-saffron'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex-grow animate-in fade-in duration-500">
                                {activeTab === 'about' && (
                                    <div className="space-y-4">
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {aboutPoints.map((point, i) => (
                                                <li key={i} className="flex items-start gap-3 text-charcoal/80">
                                                    <span className="text-saffron mt-1.5">•</span>
                                                    <span className="text-sm">{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {activeTab === 'experience' && (
                                    <div className="space-y-8">
                                        <ul className="space-y-4">
                                            {experiencePoints.map((point, i) => (
                                                <li key={i} className="flex items-start gap-3 text-charcoal/80">
                                                    <div className="w-2 h-2 rounded-full bg-saffron mt-2 shadow-[0_0_10px_#FFB800]"></div>
                                                    <span className="font-medium text-lg italic">{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="relative p-8 bg-cream/30 rounded-2xl border-l-4 border-saffron">
                                            <p className="font-serif text-xl md:text-2xl text-deepBrown leading-relaxed italic">
                                                "Keeping things simple, meaningful and inspiring — while staying honest to the original teachings."
                                            </p>
                                            <p className="mt-4 text-saffron font-bold text-xs uppercase tracking-widest">— Garga Muni's Sutra</p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'contact' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 gap-4">
                                            <a href="tel:+919760036783" className="flex items-center justify-between p-4 rounded-xl border border-clay/10 bg-cream/20 hover:bg-cream/40 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-white rounded-lg group-hover:bg-saffron group-hover:text-white transition-colors shadow-sm">
                                                        <Phone size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-charcoal/40 font-bold uppercase tracking-widest">Mobile</p>
                                                        <p className="font-bold text-deepBrown">+91 9760036783</p>
                                                    </div>
                                                </div>
                                                <ExternalLink size={16} className="text-charcoal/20" />
                                            </a>

                                            <a href="mailto:dasgargamuni@gmail.com" className="flex items-center justify-between p-4 rounded-xl border border-clay/10 bg-cream/20 hover:bg-cream/40 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-white rounded-lg group-hover:bg-saffron group-hover:text-white transition-colors shadow-sm">
                                                        <Mail size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-charcoal/40 font-bold uppercase tracking-widest">Email</p>
                                                        <p className="font-bold text-deepBrown">dasgargamuni@gmail.com</p>
                                                    </div>
                                                </div>
                                                <ExternalLink size={16} className="text-charcoal/20" />
                                            </a>

                                            <a href="https://www.youtube.com/@GargaMuniDas" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-xl border border-clay/10 bg-cream/30 hover:bg-cream/50 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-white rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors shadow-sm">
                                                        <Youtube size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-charcoal/40 font-bold uppercase tracking-widest">YouTube</p>
                                                        <p className="font-bold text-deepBrown">@GargaMuniDas</p>
                                                    </div>
                                                </div>
                                                <ExternalLink size={16} className="text-charcoal/20" />
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
