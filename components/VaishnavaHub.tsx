import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, ChevronRight } from 'lucide-react';
import { Festival, User } from '../types';
import { festivalService } from '../services/festivalService';
import FestivalCard from './FestivalCard';
import { format } from 'date-fns';

interface VaishnavaHubProps {
    user: User;
}

const VaishnavaHub: React.FC<VaishnavaHubProps> = ({ user }) => {
    const [festivals, setFestivals] = useState<Festival[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFestivals = async () => {
            try {
                const data = await festivalService.getUpcomingFestivals(20);
                setFestivals(data);
            } catch (error) {
                console.error("Failed to load festivals", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFestivals();
    }, []);

    const handlePointsEarned = (points: number) => {
        // You could show a toast or confetti here
        console.log(`Earned ${points} points!`);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-saffron/10 text-saffron rounded-full text-[10px] font-bold uppercase tracking-widest">
                    <Calendar size={12} />
                    <span>Vaishnava Calendar</span>
                </div>
                <h1 className="font-serif text-4xl font-bold text-deepBrown">
                    Upcoming <span className="text-saffron italic">Festivals</span>
                </h1>
                <p className="text-charcoal/60 max-w-lg mx-auto">
                    Stay connected with the divine schedule. Observe festivals, perform seva, and advance in your spiritual journey.
                </p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-xl h-24 shadow-sm animate-pulse"></div>
                    ))}
                </div>
            ) : festivals.length > 0 ? (
                <div className="space-y-4">
                    {festivals.map(festival => (
                        <FestivalCard
                            key={festival.id}
                            festival={festival}
                            userId={user.id}
                            onPointsEarned={handlePointsEarned}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-200">
                    <Calendar size={48} className="mx-auto text-stone-200 mb-4" />
                    <p className="text-stone-400 font-medium">No upcoming festivals found at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default VaishnavaHub;
