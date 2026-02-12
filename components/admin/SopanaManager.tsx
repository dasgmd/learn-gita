import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Sopana, QuizQuestion } from '../../types';
import { Edit2, Trash2, Check, X, BookOpen, AlertCircle, Loader2, ChevronDown, ChevronUp, Eye, Plus, Minus } from 'lucide-react';

const SopanaManager: React.FC = () => {
    const [sopanas, setSopanas] = useState<Sopana[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Sopana>>({});
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [previewSopana, setPreviewSopana] = useState<Sopana | null>(null);
    const [confirmDeleteBook, setConfirmDeleteBook] = useState<string | null>(null);
    const [confirmClearAll, setConfirmClearAll] = useState(false);

    useEffect(() => {
        fetchSopanas();
    }, []);

    const fetchSopanas = async () => {
        setLoading(true);
        try {
            const data = await adminService.getSopanas();
            setSopanas(data || []);
        } catch (err: any) {
            console.error('Failed to fetch sopanas:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (sopana: Sopana) => {
        setEditingId(sopana.id!);
        setEditForm(JSON.parse(JSON.stringify(sopana)));
    };

    const handleSave = async (id: string) => {
        setSaving(true);
        try {
            await adminService.updateSopana(id, {
                title: editForm.title,
                book_name: editForm.book_name,
                book_order: parseInt(String(editForm.book_order || 0)),
                reading_text: editForm.reading_text,
                revision_notes: editForm.revision_notes,
                quiz: editForm.quiz
            });
            setEditingId(null);
            fetchSopanas();
        } catch (err: any) {
            alert('Failed to save: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await adminService.deleteSopana(id);
            setDeletingId(null);
            fetchSopanas();
        } catch (err: any) {
            alert('Failed to delete: ' + err.message);
        }
    };

    const handleDeleteBook = async (bookName: string) => {
        setLoading(true);
        try {
            await adminService.deleteBook(bookName);
            setConfirmDeleteBook(null);
            fetchSopanas();
        } catch (err: any) {
            alert('Failed to delete book: ' + err.message);
            setLoading(false);
        }
    };

    const handleClearAllData = async () => {
        setLoading(true);
        try {
            await adminService.deleteAllSopanas();
            setConfirmClearAll(false);
            fetchSopanas();
        } catch (err: any) {
            alert('Failed to clear data: ' + err.message);
            setLoading(false);
        }
    };

    // --- Editing Helpers ---
    const updateNote = (idx: number, val: string) => {
        const notes = [...(editForm.revision_notes || [])];
        notes[idx] = val;
        setEditForm({ ...editForm, revision_notes: notes });
    };

    const removeNote = (idx: number) => {
        const notes = (editForm.revision_notes || []).filter((_, i) => i !== idx);
        setEditForm({ ...editForm, revision_notes: notes });
    };

    const addNote = () => {
        setEditForm({ ...editForm, revision_notes: [...(editForm.revision_notes || []), ''] });
    };

    const updateQuiz = (qIdx: number, field: keyof QuizQuestion, val: any) => {
        const quiz = [...(editForm.quiz || [])];
        quiz[qIdx] = { ...quiz[qIdx], [field]: val };
        setEditForm({ ...editForm, quiz });
    };

    const updateOption = (qIdx: number, oIdx: number, val: string) => {
        const quiz = [...(editForm.quiz || [])];
        const options = [...quiz[qIdx].options];
        options[oIdx] = val;
        quiz[qIdx] = { ...quiz[qIdx], options };
        setEditForm({ ...editForm, quiz });
    };

    const removeQuizItem = (idx: number) => {
        const quiz = (editForm.quiz || []).filter((_, i) => i !== idx);
        setEditForm({ ...editForm, quiz });
    };

    const addQuizItem = () => {
        setEditForm({
            ...editForm,
            quiz: [...(editForm.quiz || []), { question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]
        });
    };

    // --- Grouping Logic ---
    const groupedSopanas = sopanas.reduce((acc: Record<string, Sopana[]>, curr) => {
        const book = curr.book_name || 'Uncategorized';
        if (!acc[book]) acc[book] = [];
        acc[book].push(curr);
        return acc;
    }, {} as Record<string, Sopana[]>);

    const PreviewModal = ({ sopana, onClose }: { sopana: Sopana, onClose: () => void }) => (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <div className="absolute inset-0 bg-[#4A3728]/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-[#FFFDF0] w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl divine-shadow animate-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="fixed md:absolute top-4 right-4 md:top-6 md:right-6 p-3 bg-white/80 hover:bg-white rounded-full transition-colors z-[110] shadow-md"
                >
                    <X size={24} className="text-[#4A3728]" />
                </button>

                <div className="p-6 md:p-16 space-y-12">
                    <div className="space-y-4 text-center">
                        <div className="text-[#FFB800] text-3xl font-serif">✦</div>
                        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#4A3728] leading-tight">{sopana.title}</h1>
                        <div className="h-1 w-24 bg-[#FFB800]/30 mx-auto rounded-full"></div>
                    </div>

                    <article className="bg-white p-6 md:p-12 rounded-[2.5rem] shadow-xl border border-[#4A3728]/5">
                        <div className="text-[#4A3728]/80 text-lg md:text-xl leading-relaxed space-y-8 font-medium">
                            {sopana.reading_text.split('\n').map((para, i) => para.trim() && (
                                <p key={i} className="first-letter:text-4xl first-letter:font-serif first-letter:text-[#FFB800] first-letter:mr-1">
                                    {para}
                                </p>
                            ))}
                        </div>
                    </article>

                    {sopana.revision_notes && sopana.revision_notes.length > 0 && (
                        <div className="space-y-8">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#4A3728] flex items-center gap-4">
                                <span className="bg-[#FFB800]/20 p-3 rounded-2xl text-[#FFB800]"><BookOpen size={24} /></span>
                                Spiritual Highlights
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {sopana.revision_notes.map((note, i) => (
                                    <div key={i} className="bg-white p-8 rounded-3xl border border-[#FFB800]/10 shadow-sm flex gap-5 hover:border-[#FFB800]/30 transition-all group">
                                        <div className="w-12 h-12 rounded-2xl bg-[#FFFDF0] border border-[#FFB800]/20 flex items-center justify-center text-[#FFB800] font-black text-xl shrink-0 group-hover:bg-[#FFB800] group-hover:text-white transition-colors">
                                            {i + 1}
                                        </div>
                                        <p className="text-[#4A3728]/80 text-base leading-relaxed font-medium">{note}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {sopana.quiz && sopana.quiz.length > 0 && (
                        <div className="space-y-8">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#4A3728] flex items-center gap-4">
                                <span className="bg-[#FFB800]/20 p-3 rounded-2xl text-[#FFB800]">✨</span>
                                Enlightened Quiz
                            </h2>
                            <div className="space-y-8">
                                {sopana.quiz.map((q, i) => (
                                    <div key={i} className="bg-white p-8 md:p-12 rounded-[3rem] border border-[#4A3728]/5 shadow-sm space-y-8">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-black text-[#FFB800] uppercase tracking-[0.3em]">Question {i + 1}</span>
                                            <h4 className="font-serif text-xl md:text-2xl font-bold text-[#4A3728] leading-snug">{q.question}</h4>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {q.options.map((opt, oi) => (
                                                <div key={oi} className={`p-6 rounded-[1.5rem] border-2 transition-all flex items-center gap-4 ${oi === q.correctAnswer ? 'border-[#FFB800]/40 bg-[#FFFDF0]' : 'border-[#4A3728]/5 hover:border-[#FFB800]/20'}`}>
                                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black ${oi === q.correctAnswer ? 'bg-[#FFB800] border-[#FFB800] text-white' : 'border-[#4A3728]/10 text-clay'}`}>
                                                        {String.fromCharCode(65 + oi)}
                                                    </div>
                                                    <p className="text-sm md:text-base font-bold text-[#4A3728]/80">{opt}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-6 bg-[#FFB800]/5 rounded-2xl border-l-4 border-[#FFB800]">
                                            <p className="text-[10px] font-black text-[#FFB800] uppercase tracking-widest mb-2">Wisdom Drop</p>
                                            <p className="text-sm md:text-base text-[#4A3728]/70 italic leading-relaxed">{q.explanation}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="animate-spin text-saffron" size={40} />
                <p className="text-clay font-bold tracking-widest uppercase text-sm font-serif">Accessing Holy Archive...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            {previewSopana && <PreviewModal sopana={previewSopana} onClose={() => setPreviewSopana(null)} />}

            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-[#4A3728]">Sopana Archive</h1>
                        <p className="text-[#4A3728]/60 mt-1 uppercase text-[10px] font-black tracking-widest">Library of Wisdom</p>
                    </div>

                    {!confirmClearAll ? (
                        <button
                            onClick={() => setConfirmClearAll(true)}
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
                        >
                            <Trash2 size={16} /> Clear All Data
                        </button>
                    ) : (
                        <div className="bg-red-50 p-2 rounded-xl flex items-center gap-2 animate-in slide-in-from-right duration-300">
                            <span className="text-xs font-bold text-red-700">Irreversible! Are you sure?</span>
                            <button onClick={handleClearAllData} className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-700">YES</button>
                            <button onClick={() => setConfirmClearAll(false)} className="text-gray-500 px-2 text-xs font-bold hover:text-gray-700">NO</button>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} />
                    <p className="text-sm font-medium">{error}</p>
                    <button onClick={fetchSopanas} className="ml-auto text-xs font-bold underline">Retry</button>
                </div>
            )}

            {!Object.keys(groupedSopanas).length ? (
                <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-clay/30 text-center space-y-4">
                    <div className="w-20 h-20 bg-clay/10 text-clay rounded-full flex items-center justify-center mx-auto">
                        <BookOpen size={40} />
                    </div>
                    <p className="text-clay font-serif text-xl italic font-medium">The archives are currently empty.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {Object.entries(groupedSopanas).map(([bookName, items]: [string, Sopana[]]) => (
                        <div key={bookName} className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <h2 className="font-serif text-2xl font-bold text-[#4A3728] pl-2 border-l-8 border-saffron rounded-sm">
                                        {bookName}
                                    </h2>
                                    <span className="bg-[#4A3728]/10 text-[#4A3728] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {items.length} Lessons
                                    </span>
                                </div>

                                {confirmDeleteBook === bookName ? (
                                    <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-lg animate-in fade-in duration-300">
                                        <span className="text-[10px] font-bold text-red-600">Delete entire book?</span>
                                        <button onClick={() => handleDeleteBook(bookName)} className="text-red-600 font-bold hover:underline text-xs">YES</button>
                                        <button onClick={() => setConfirmDeleteBook(null)} className="text-gray-400 font-bold hover:text-gray-600 text-xs">NO</button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setConfirmDeleteBook(bookName)}
                                        className="text-red-300 hover:text-red-500 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                                    >
                                        <Trash2 size={14} /> Delete Book
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {items.map((sopana) => (
                                    <div key={sopana.id} className="bg-white border-2 border-[#4A3728]/5 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-saffron/20 transition-all">
                                        {editingId === sopana.id ? (
                                            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                                                {/* Header Edit */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#4A3728]/40 ml-2">Lesson Title</label>
                                                        <input
                                                            className="w-full p-4 bg-cream/30 border-2 border-clay/10 rounded-2xl font-bold text-xl focus:outline-none focus:border-saffron transition-colors"
                                                            value={editForm.title || ''}
                                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#4A3728]/40 ml-2">Book Name</label>
                                                            <input
                                                                className="w-full p-4 bg-cream/30 border-2 border-clay/10 rounded-2xl font-bold text-sm focus:outline-none focus:border-saffron transition-colors"
                                                                value={editForm.book_name || ''}
                                                                onChange={(e) => setEditForm({ ...editForm, book_name: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-[#4A3728]/40 ml-2">Order</label>
                                                            <input
                                                                type="number"
                                                                className="w-full p-4 bg-cream/30 border-2 border-clay/10 rounded-2xl font-bold text-sm focus:outline-none focus:border-saffron transition-colors"
                                                                value={editForm.book_order || 0}
                                                                onChange={(e) => setEditForm({ ...editForm, book_order: parseInt(e.target.value) })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Content Edit */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#4A3728]/40 ml-2">Reading Content</label>
                                                    <textarea
                                                        className="w-full p-6 bg-cream/30 border-2 border-clay/10 rounded-[2.5rem] h-64 text-base focus:outline-none focus:border-saffron leading-relaxed font-medium"
                                                        value={editForm.reading_text || ''}
                                                        onChange={(e) => setEditForm({ ...editForm, reading_text: e.target.value })}
                                                    />
                                                </div>

                                                {/* Key Points Edit */}
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center px-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#4A3728]/40">Key Takeaways</label>
                                                        <button onClick={addNote} className="text-saffron flex items-center gap-1 text-[10px] font-black hover:scale-110 transition-transform"><Plus size={14} /> ADD POINT</button>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {editForm.revision_notes?.map((note, nidx) => (
                                                            <div key={nidx} className="relative group">
                                                                <textarea
                                                                    value={note}
                                                                    onChange={(e) => updateNote(nidx, e.target.value)}
                                                                    className="w-full p-4 pr-10 bg-white border-2 border-clay/5 rounded-2xl text-sm italic min-h-[80px] focus:border-saffron/30 outline-none"
                                                                />
                                                                <button onClick={() => removeNote(nidx)} className="absolute top-2 right-2 p-1 text-red-300 hover:text-red-500 transition-colors"><Minus size={14} /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Quiz Edit */}
                                                <div className="space-y-6">
                                                    <div className="flex justify-between items-center px-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#4A3728]/40">Assessment Quiz</label>
                                                        <button onClick={addQuizItem} className="text-saffron flex items-center gap-1 text-[10px] font-black hover:scale-110 transition-transform"><Plus size={14} /> ADD QUESTION</button>
                                                    </div>
                                                    <div className="space-y-6">
                                                        {editForm.quiz?.map((q, qidx) => (
                                                            <div key={qidx} className="bg-cream/20 p-6 rounded-[2rem] border-2 border-clay/5 space-y-6 relative group">
                                                                <button onClick={() => removeQuizItem(qidx)} className="absolute top-4 right-4 p-2 text-red-300 hover:text-red-500"><Trash2 size={16} /></button>

                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-bold text-clay/50 ml-1">Question {qidx + 1}</label>
                                                                    <input
                                                                        className="w-full p-3 bg-white border border-clay/10 rounded-xl font-bold"
                                                                        value={q.question}
                                                                        onChange={(e) => updateQuiz(qidx, 'question', e.target.value)}
                                                                    />
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    {q.options.map((opt, oidx) => (
                                                                        <div key={oidx} className="space-y-1">
                                                                            <div className="flex justify-between items-center px-1">
                                                                                <label className="text-[10px] font-bold text-clay/40">Option {String.fromCharCode(65 + oidx)}</label>
                                                                                <button
                                                                                    onClick={() => updateQuiz(qidx, 'correctAnswer', oidx)}
                                                                                    className={`text-[8px] font-black px-2 py-0.5 rounded ${q.correctAnswer === oidx ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}
                                                                                >
                                                                                    CORRECT
                                                                                </button>
                                                                            </div>
                                                                            <input
                                                                                className="w-full p-3 bg-white border border-clay/10 rounded-xl text-sm"
                                                                                value={opt}
                                                                                onChange={(e) => updateOption(qidx, oidx, e.target.value)}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-bold text-clay/50 ml-1">Wisdom/Explanation</label>
                                                                    <textarea
                                                                        className="w-full p-3 bg-white border border-clay/10 rounded-xl text-sm italic"
                                                                        value={q.explanation}
                                                                        onChange={(e) => updateQuiz(qidx, 'explanation', e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex justify-end gap-3 pt-6 border-t border-clay/10">
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="px-8 py-3 rounded-2xl text-[#4A3728]/60 font-bold hover:bg-gray-100 transition-colors uppercase text-xs tracking-widest"
                                                    >
                                                        Discard
                                                    </button>
                                                    <button
                                                        disabled={saving}
                                                        onClick={() => handleSave(sopana.id!)}
                                                        className="flex items-center gap-3 bg-saffron text-white px-10 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-all disabled:opacity-50 uppercase text-xs tracking-widest"
                                                    >
                                                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                                                        {saving ? 'Saving...' : 'Confirm Update'}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="flex gap-6">
                                                    <div className="flex-1 space-y-2">
                                                        <h3 className="font-bold text-xl text-[#4A3728]">{sopana.title}</h3>
                                                        <p className="text-[#4A3728]/70 text-sm italic line-clamp-1">
                                                            {sopana.reading_text}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setPreviewSopana(sopana)}
                                                            className="flex items-center gap-2 px-4 py-2 bg-cream text-saffron font-bold text-xs rounded-xl hover:bg-saffron hover:text-white transition-all shadow-sm group"
                                                        >
                                                            <Eye size={14} className="group-hover:scale-110 transition-transform" />
                                                            PREVIEW
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(sopana)}
                                                            className="p-2 bg-cream hover:bg-saffron/10 text-saffron rounded-xl transition-colors"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>

                                                        {deletingId === sopana.id ? (
                                                            <div className="bg-red-50 p-1 rounded-xl flex items-center gap-1 animate-in slide-in-from-right duration-200">
                                                                <button onClick={() => handleDelete(sopana.id!)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                                                    <Check size={14} />
                                                                </button>
                                                                <button onClick={() => setDeletingId(null)} className="p-2 text-gray-400 hover:text-gray-600">
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setDeletingId(sopana.id!)}
                                                                className="p-2 bg-cream hover:bg-red-50 text-red-500 rounded-xl transition-colors"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-clay/5 flex items-center gap-4">
                                                    <button
                                                        onClick={() => setExpandedId(expandedId === sopana.id ? null : sopana.id!)}
                                                        className="text-[10px] font-black uppercase tracking-widest text-clay hover:text-saffron transition-colors underline flex items-center gap-1"
                                                    >
                                                        {expandedId === sopana.id ? (
                                                            <>Hide Content <ChevronUp size={12} /></>
                                                        ) : (
                                                            <>View Detailed Logic <ChevronDown size={12} /></>
                                                        )}
                                                    </button>
                                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-clay ml-auto">
                                                        <span className="bg-[#4A3728]/5 px-2 py-1 rounded">Order #{sopana.book_order}</span>
                                                        <span className="bg-[#FFB800]/10 text-saffron px-2 py-1 rounded">{sopana.revision_notes?.length || 0} Points</span>
                                                        <span className="bg-[#FFB800]/10 text-saffron px-2 py-1 rounded">{sopana.quiz?.length || 0} Questions</span>
                                                    </div>
                                                </div>

                                                {expandedId === sopana.id && (
                                                    <div className="mt-4 p-6 bg-cream/10 rounded-[2rem] border border-clay/5 animate-in slide-in-from-top duration-300 space-y-8">
                                                        {sopana.revision_notes && sopana.revision_notes.length > 0 && (
                                                            <div>
                                                                <h4 className="text-[10px] font-black text-clay uppercase tracking-widest mb-3 flex items-center gap-2">
                                                                    <BookOpen size={12} /> Spiritual Summary
                                                                </h4>
                                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                                                    {sopana.revision_notes.map((note, idx) => (
                                                                        <li key={idx} className="text-sm text-[#4A3728]/80 flex gap-2">
                                                                            <span className="text-saffron font-bold">{idx + 1}.</span> {note}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {sopana.quiz && sopana.quiz.length > 0 && (
                                                            <div>
                                                                <h4 className="text-[10px] font-black text-clay uppercase tracking-widest mb-3 flex items-center gap-2">
                                                                    ✨ Assessed Knowledge
                                                                </h4>
                                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                                    {sopana.quiz.map((q, qidx) => (
                                                                        <div key={qidx} className="bg-white p-5 rounded-2xl text-sm border border-clay/5 shadow-sm">
                                                                            <p className="font-bold text-[#4A3728] mb-3">{qidx + 1}. {q.question}</p>
                                                                            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                                                                                {q.options.map((opt, oidx) => (
                                                                                    <div key={oidx} className={`p-2 rounded-lg border ${oidx === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-transparent text-clay/50'}`}>
                                                                                        {String.fromCharCode(65 + oidx)}. {opt}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SopanaManager;
