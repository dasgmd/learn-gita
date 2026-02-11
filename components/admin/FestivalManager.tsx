import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { festivalService } from '../../services/festivalService';
import { Festival, FestivalTask } from '../../types';
import { Plus, Trash, Save, Calendar, ListChecks, X } from 'lucide-react';
import { format } from 'date-fns';

const FestivalManager: React.FC = () => {
    const [festivals, setFestivals] = useState<Festival[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [significance, setSignificance] = useState('');
    const [fastType, setFastType] = useState<Festival['fast_type']>('none');
    const [tasks, setTasks] = useState<{ desc: string; points: number }[]>([]);
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [newTaskPoints, setNewTaskPoints] = useState(10);

    useEffect(() => {
        fetchFestivals();
    }, []);

    const fetchFestivals = async () => {
        try {
            setLoading(true);
            const data = await festivalService.getUpcomingFestivals(50); // Fetch more for admin
            setFestivals(data);
        } catch (err) {
            console.error("Failed to fetch festivals", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTaskToForm = () => {
        if (!newTaskDesc.trim()) return;
        setTasks([...tasks, { desc: newTaskDesc, points: newTaskPoints }]);
        setNewTaskDesc('');
        setNewTaskPoints(10);
    };

    const handleRemoveTaskFromForm = (index: number) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // 1. Create Festival
            const festivalData = {
                name,
                date,
                description,
                significance,
                fast_type: fastType
            };

            const newFestival = await adminService.createFestival(festivalData as any);

            // 2. Add Tasks
            if (newFestival && tasks.length > 0) {
                await Promise.all(tasks.map(t => adminService.addTaskToFestival({
                    festival_id: newFestival.id,
                    task_description: t.desc,
                    point_value: t.points
                })));
            }

            // Reset
            setShowForm(false);
            setName('');
            setDate('');
            setDescription('');
            setSignificance('');
            setFastType('none');
            setTasks([]);
            fetchFestivals();
            alert('Festival pushed successfully!');
        } catch (err) {
            console.error("Failed to save festival", err);
            alert('Failed to save festival. Check console.');
        }
    };

    if (loading) return <div className="text-center p-12">Loading festivals...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="font-serif text-3xl font-bold text-[#3D2B1F]">Festival Manager</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-[#FFB800] text-[#3D2B1F] px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                    <Plus size={20} /> Push New Festival
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-[2rem] p-8 border border-[#3D2B1F]/10 shadow-lg animate-in slide-in-from-top-4 duration-500">
                    <div className="flex justify-between items-center mb-6 border-b border-[#3D2B1F]/5 pb-4">
                        <h3 className="font-bold text-xl text-[#3D2B1F]">Create New Event</h3>
                        <button onClick={() => setShowForm(false)} className="text-[#3D2B1F]/40 hover:text-red-500"><X size={24} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/60">Event Name</label>
                                <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-[#FFFDF0] rounded-lg border border-[#3D2B1F]/10 focus:border-[#FFB800] outline-none" placeholder="e.g. Janmastami" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/60">Date (Tithi)</label>
                                <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-[#FFFDF0] rounded-lg border border-[#3D2B1F]/10 focus:border-[#FFB800] outline-none" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/60">Description (Short)</label>
                            <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-[#FFFDF0] rounded-lg border border-[#3D2B1F]/10 focus:border-[#FFB800] outline-none" rows={2} placeholder="Brief summary for the card..." />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/60">Significance (Full Details)</label>
                            <textarea value={significance} onChange={e => setSignificance(e.target.value)} className="w-full p-3 bg-[#FFFDF0] rounded-lg border border-[#3D2B1F]/10 focus:border-[#FFB800] outline-none" rows={3} placeholder="Why is this day important?" />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-widest text-[#3D2B1F]/60">Fasting Type</label>
                            <select value={fastType} onChange={e => setFastType(e.target.value as any)} className="w-full p-3 bg-[#FFFDF0] rounded-lg border border-[#3D2B1F]/10 focus:border-[#FFB800] outline-none">
                                <option value="none">No Fasting</option>
                                <option value="partial">Partial (Prasad only)</option>
                                <option value="grains">No Grains (Ekadashi)</option>
                                <option value="waterless">Nirjala (Waterless)</option>
                            </select>
                        </div>

                        {/* Dynamic Tasks */}
                        <div className="bg-[#FFFDF0] p-6 rounded-xl border border-[#3D2B1F]/5 space-y-4">
                            <h4 className="flex items-center gap-2 font-bold text-[#3D2B1F]"><ListChecks size={18} /> Seva Tasks</h4>

                            <div className="flex gap-2">
                                <input
                                    value={newTaskDesc}
                                    onChange={e => setNewTaskDesc(e.target.value)}
                                    placeholder="Task description (e.g. Chant 16 rounds)"
                                    className="flex-1 p-2 rounded-lg border border-[#3D2B1F]/10 text-sm focus:border-[#FFB800] outline-none"
                                />
                                <input
                                    type="number"
                                    value={newTaskPoints}
                                    onChange={e => setNewTaskPoints(Number(e.target.value))}
                                    placeholder="Pts"
                                    className="w-20 p-2 rounded-lg border border-[#3D2B1F]/10 text-sm focus:border-[#FFB800] outline-none"
                                />
                                <button type="button" onClick={handleAddTaskToForm} className="bg-[#3D2B1F] text-[#FFFDF0] p-2 rounded-lg">
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div className="space-y-2">
                                {tasks.map((task, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-[#3D2B1F]/5 text-sm">
                                        <span>{task.desc} <span className="text-[#FFB800] font-bold">({task.points} pts)</span></span>
                                        <button type="button" onClick={() => handleRemoveTaskFromForm(i)} className="text-red-400 hover:text-red-600">
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                ))}
                                {tasks.length === 0 && <p className="text-xs text-[#3D2B1F]/40 italic">No tasks added yet.</p>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t border-[#3D2B1F]/5">
                            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-[#3D2B1F]/60 font-bold hover:text-[#3D2B1F]">Cancel</button>
                            <button type="submit" className="px-8 py-3 bg-[#FFB800] text-[#3D2B1F] font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                                <Save size={18} /> Publish Festival
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Existing Festivals List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {festivals.map(festival => (
                    <div key={festival.id} className="bg-white p-6 rounded-2xl border border-[#3D2B1F]/5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-serif font-bold text-xl text-[#3D2B1F]">{festival.name}</h3>
                                <div className="flex items-center gap-1 text-xs font-bold text-[#FFB800] uppercase tracking-widest mt-1">
                                    <Calendar size={12} /> {format(new Date(festival.date), 'dd MMM yyyy')}
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${festival.fast_type === 'waterless' ? 'bg-red-100 text-red-600' :
                                festival.fast_type === 'grains' ? 'bg-orange-100 text-orange-600' :
                                    'bg-green-100 text-green-600'
                                }`}>
                                {festival.fast_type}
                            </span>
                        </div>
                        <p className="text-[#3D2B1F]/60 text-sm mb-4 line-clamp-2">{festival.description}</p>
                        {/* Future edit/delete actions could go here */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FestivalManager;
