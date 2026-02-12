import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Zap, CheckCircle, Loader2 } from 'lucide-react';
import { Course, Enrollment } from '../types';
import { courseService } from '../services/courseService';

interface CourseOverviewProps {
    slug: string;
    onStartJourney: () => void;
}

const CourseOverview: React.FC<CourseOverviewProps> = ({ slug, onStartJourney }) => {
    const [course, setCourse] = useState<Course | null>(null);
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        loadCourseData();
    }, [slug]);

    const loadCourseData = async () => {
        try {
            const courseData = await courseService.getCourseBySlug(slug);
            setCourse(courseData);

            if (courseData) {
                const enrollData = await courseService.getEnrollment(courseData.id);
                setEnrollment(enrollData);
            }
        } catch (error) {
            console.error("Failed to load course:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        if (!course) return;
        setEnrolling(true);
        try {
            await courseService.enrollUser(course.id);
            // Refresh to confirm enrollment state
            const enrollData = await courseService.getEnrollment(course.id);
            setEnrollment(enrollData);
        } catch (error) {
            console.error("Enrollment failed:", error);
            alert("Failed to enroll. Please try again.");
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 min-h-[50vh]">
                <Loader2 className="animate-spin text-saffron" size={48} />
                <p className="mt-4 text-clay font-serif font-bold animate-pulse">Summoning Ancient Wisdom...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-serif text-clay">Course Not Found</h2>
                <p className="text-clay/60">The requested scripture could not be retrieved from the archives.</p>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden bg-[#FFFDF0] min-h-screen">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

            <div className="relative max-w-4xl mx-auto px-4 py-12 md:py-20 space-y-12">

                {/* Header Section */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-saffron/10 text-saffron px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-saffron/20"
                    >
                        <Zap size={14} className="fill-saffron" />
                        <span>Interactive Journey</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="font-serif text-4xl md:text-6xl font-bold text-[#4A3728] leading-tight"
                    >
                        {course.title}
                    </motion.h1>
                </div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[3rem] p-6 md:p-10 shadow-2xl border border-clay/5 relative overflow-hidden group"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                        {/* Left: Image */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-saffron/20 rounded-[2rem] rotate-3 scale-95 group-hover:rotate-6 transition-transform duration-500" />
                            <img
                                src={course.cover_image || "https://placehold.co/600x800/FFB800/white?text=Book+Cover"}
                                alt={course.title}
                                className="relative rounded-[2rem] shadow-lg w-full object-cover aspect-[3/4] z-10"
                            />
                        </div>

                        {/* Right: Info & Action */}
                        <div className="space-y-8">
                            <p className="text-[#4A3728]/80 text-lg leading-relaxed font-medium">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 bg-cream px-4 py-2 rounded-xl text-[#4A3728] font-bold text-sm">
                                    <Clock size={18} className="text-saffron" />
                                    <span>{course.duration || 'Self-paced'}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-cream px-4 py-2 rounded-xl text-[#4A3728] font-bold text-sm">
                                    <BookOpen size={18} className="text-saffron" />
                                    <span>{course.level || 'All Levels'}</span>
                                </div>
                            </div>

                            <div className="pt-4">
                                {enrollment ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onStartJourney}
                                        className="w-full bg-green-600 text-white text-xl font-bold py-5 rounded-2xl shadow-xl shadow-green-200 hover:shadow-green-300 transition-all flex items-center justify-center gap-3"
                                    >
                                        <span>Continue Journey</span>
                                        <CheckCircle size={24} />
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={enrolling}
                                        onClick={handleEnroll}
                                        className="w-full bg-gradient-to-r from-saffron to-orange-500 text-white text-xl font-bold py-5 rounded-2xl shadow-xl shadow-orange-200 hover:shadow-orange-300 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {enrolling ? (
                                            <Loader2 className="animate-spin" size={24} />
                                        ) : (
                                            <>
                                                <span>Enroll Now</span>
                                                <Zap size={24} className="fill-white" />
                                            </>
                                        )}
                                    </motion.button>
                                )}
                                <p className="text-center text-xs text-[#4A3728]/40 mt-3 font-bold tracking-widest uppercase">
                                    {enrollment ? "You are already enrolled" : "Join 108+ other students today"}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CourseOverview;
