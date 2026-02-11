import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FestivalTask, UserFestivalCompletion } from '../types';
import { festivalService } from '../services/festivalService';

interface SevaListProps {
    festivalId: string;
    userId: string;
    onTaskCompleted?: (points: number) => void;
}

const SevaList: React.FC<SevaListProps> = ({ festivalId, userId, onTaskCompleted }) => {
    const [tasks, setTasks] = useState<FestivalTask[]>([]);
    const [completions, setCompletions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [festivalTasks, userCompletions] = await Promise.all([
                    festivalService.getFestivalTasks(festivalId),
                    festivalService.getUserCompletions(userId, festivalId)
                ]);
                setTasks(festivalTasks);
                setCompletions(userCompletions.map(c => c.task_id));
            } catch (error) {
                console.error("Failed to load seva tasks", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [festivalId, userId]);

    const handleToggleTask = async (taskId: string, pointValue: number) => {
        if (completions.includes(taskId)) return; // Already completed

        // Optimistic update
        setCompletions(prev => [...prev, taskId]);

        try {
            await festivalService.completeTask(userId, taskId, pointValue);
            if (onTaskCompleted) onTaskCompleted(pointValue);
        } catch (error) {
            console.error("Failed to complete task", error);
            // Revert optimistic update
            setCompletions(prev => prev.filter(id => id !== taskId));
        }
    };

    if (loading) {
        return <div className="text-xs text-charcoal/50 flex justify-center py-2">Loading Seva...</div>;
    }

    if (tasks.length === 0) {
        return <div className="text-xs text-charcoal/50 italic text-center py-2">No specific Seva assigned for this event yet.</div>;
    }

    return (
        <div className="space-y-2 mt-2">
            <h4 className="text-xs font-bold text-deepBrown uppercase tracking-wider mb-2 flex items-center gap-1">
                <span>Suggested Seva</span>
                <span className="bg-saffron/20 text-saffron px-1.5 py-0.5 rounded-full text-[10px]">{tasks.length}</span>
            </h4>
            <div className="space-y-2">
                {tasks.map((task) => {
                    const isCompleted = completions.includes(task.id);
                    return (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`
                flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer group
                ${isCompleted
                                    ? 'bg-green-50/50 border-green-100'
                                    : 'bg-white border-cream/50 hover:border-saffron/30 hover:shadow-sm'
                                }
              `}
                            onClick={() => handleToggleTask(task.id, task.point_value)}
                        >
                            <div className={`
                flex-shrink-0 transition-colors duration-300
                ${isCompleted ? 'text-green-500' : 'text-charcoal/20 group-hover:text-saffron/60'}
              `}>
                                {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                            </div>
                            <div className="flex-1">
                                <p className={`
                  text-sm font-medium transition-colors
                  ${isCompleted ? 'text-charcoal/40 line-through' : 'text-deepBrown'}
                `}>
                                    {task.task_description}
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <span className={`
                  text-[10px] font-bold px-2 py-1 rounded-full border
                  ${isCompleted
                                        ? 'bg-green-100 text-green-700 border-green-200'
                                        : 'bg-saffron/5 text-saffron border-saffron/10 group-hover:bg-saffron/10'
                                    }
                `}>
                                    +{task.point_value}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default SevaList;
