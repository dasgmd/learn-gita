import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Sopana, QuizQuestion } from '../../types';
import { generateCourseFromPDF, verifyCourseCoverage } from '../../services/geminiService';
import { FileUp, Sparkles, Save, Edit2, Check, X, Loader2, Trash2, SearchCheck, Info } from 'lucide-react';

const CourseFactory: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progressStatus, setProgressStatus] = useState('');
    const [sopanas, setSopanas] = useState<Sopana[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editSopana, setEditSopana] = useState<Sopana | null>(null);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [bookName, setBookName] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [coverageReport, setCoverageReport] = useState<string | null>(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // --- Draft Management ---
    useEffect(() => {
        checkAndLoadDraft();
    }, []);

    const checkAndLoadDraft = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('sopana_drafts')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                const confirmed = window.confirm(`Found a saved draft for "${data.book_name || 'Untitled'}". Would you like to restore it?`);
                if (confirmed) {
                    setSopanas(data.sopanas);
                    setBookName(data.book_name || '');
                    setUploadedFileUrl(data.file_url);
                    // Use a placeholder file object or just text to indicate source
                    // setFile(new File([], data.book_name || 'Draft Restored')); 
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 3000);
                } else {
                    // Optional: delete draft if user rejects? keeping it safe for now.
                }
            }
        } catch (err) {
            // ignore error if no draft found (PGRST116 is expected for .single())
        }
    };

    const saveDraft = async (generatedComponents: Sopana[], sourceUrl: string, bName: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.error("No authenticated user found while saving draft!");
                alert("Please log in to save drafts.");
                return;
            }
            console.log("Saving draft for user:", user.id);

            // First delete any existing drafts for this user to keep it clean (single draft mode)
            await supabase.from('sopana_drafts').delete().eq('user_id', user.id);

            const { error } = await supabase.from('sopana_drafts').insert({
                user_id: user.id,
                book_name: bName,
                file_url: sourceUrl,
                sopanas: generatedComponents
            });

            if (error) {
                console.error('Supabase Draft Insert Error:', error);
                throw error;
            }
            console.log('Draft saved successfully', { bName, count: generatedComponents.length });
        } catch (err) {
            console.error('Failed to save draft:', err);
            alert('Warning: Failed to save draft. Your progress may be lost if you refresh.');
        }
    };

    const deleteDraft = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            await supabase.from('sopana_drafts').delete().eq('user_id', user.id);
        } catch (err) {
            console.error('Failed to delete draft:', err);
        }
    };

    const handleGenerate = async () => {
        if (!file) return;

        setIsUploading(true);
        setIsGenerating(true);
        setProgressStatus('Uploading PDF to storage...');

        try {
            const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
            setProgressStatus('Uploading PDF to storage...');

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('course-assets')
                .upload(fileName, file);

            if (uploadError) {
                if (uploadError.message.includes('not found')) {
                    throw new Error("Storage bucket 'course-assets' not found. Please run the SQL script I provided in your Supabase SQL Editor to create it.");
                }
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('course-assets')
                .getPublicUrl(fileName);

            setUploadedFileUrl(publicUrl);

            // 2. Trigger AI Generation
            const generatedSopanas = await generateCourseFromPDF(publicUrl, (status) => {
                setProgressStatus(status);
            });

            setSopanas(generatedSopanas);

            // 3. Save Draft Immediately
            const bName = bookName || file.name.replace('.pdf', '');
            await saveDraft(generatedSopanas, publicUrl, bName);

            setProgressStatus('Generation complete! Draft saved.');
        } catch (error: any) {
            console.error('Generation failed:', error);
            alert(`Error: ${error.message || 'Failed to generate course'}`);
        } finally {
            setIsUploading(false);
            setIsGenerating(false);
        }
    };

    const handleSaveToDatabase = async () => {
        if (sopanas.length === 0) return;
        setShowSaveConfirm(false);
        setSaveError(null);
        setSaveSuccess(false);

        setProgressStatus('Connecting to database...');
        console.log('Starting save of', sopanas.length, 'sopanas');

        try {
            const { data, error } = await supabase.from('sopanas').insert(
                sopanas.map((s, idx) => ({
                    book_name: bookName || file?.name?.replace('.pdf', '') || 'Manual Upload',
                    book_order: idx,
                    title: s.title,
                    reading_text: s.reading_text,
                    revision_notes: s.revision_notes,
                    quiz: s.quiz
                }))
            ).select();

            if (error) {
                console.error('Supabase Inset Error:', error);
                throw error;
            }

            console.log('Save successful:', data);
            setSaveSuccess(true);

            // Cleanup Draft
            await deleteDraft();

            setSopanas([]);
            setFile(null);

            // Auto-hide success message after 5 seconds
            setTimeout(() => setSaveSuccess(false), 5000);
        } catch (error: any) {
            console.error('Save failed process:', error);
            setSaveError(error.message || 'Failed to save to database');
        } finally {
            setProgressStatus('');
        }
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setEditSopana({ ...sopanas[index] });
    };

    const handleSaveEdit = () => {
        if (editingIndex !== null && editSopana) {
            const newSopanas = [...sopanas];
            newSopanas[editingIndex] = editSopana;
            setSopanas(newSopanas);
            setEditingIndex(null);
            setEditSopana(null);

            // Update draft with edits
            saveDraft(newSopanas, uploadedFileUrl || '', bookName);
        }
    };

    const handleRemove = (index: number) => {
        const newSopanas = sopanas.filter((_, i) => i !== index);
        setSopanas(newSopanas);
        setDeletingIndex(null);
        // Update draft with removal
        saveDraft(newSopanas, uploadedFileUrl || '', bookName);
    };

    const handleVerifyCoverage = async () => {
        if (!uploadedFileUrl || sopanas.length === 0) return;

        setIsVerifying(true);
        setCoverageReport(null);
        try {
            const report = await verifyCourseCoverage(uploadedFileUrl, sopanas, (status) => {
                setProgressStatus(status);
            });
            setCoverageReport(report);
        } catch (error: any) {
            console.error('Verification failed:', error);
            alert(`Verification failed: ${error.message}`);
        } finally {
            setIsVerifying(false);
            setProgressStatus('');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-serif text-3xl font-bold text-[#4A3728]">Course Factory</h1>
                    <p className="text-[#4A3728]/60 mt-1">Automate course generation from digital books.</p>
                </div>

                {saveSuccess && (
                    <div className="bg-green-100 border border-green-500 text-green-700 px-6 py-3 rounded-full font-bold animate-in slide-in-from-top duration-500">
                        ✨ Success! All Sopanas have been saved to the archive.
                    </div>
                )}

                {saveError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-3 rounded-full font-bold flex items-center gap-2 animate-in shake duration-500">
                        <X size={16} onClick={() => setSaveError(null)} className="cursor-pointer" />
                        Error: {saveError}
                    </div>
                )}

                {sopanas.length > 0 && (
                    <div className="flex items-center gap-3">
                        {!showSaveConfirm ? (
                            <button
                                type="button"
                                onClick={() => setShowSaveConfirm(true)}
                                className="flex items-center gap-2 bg-[#FFB800] text-[#4A3728] px-6 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-lg"
                            >
                                <Save size={20} />
                                Save to Database
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 bg-saffron/10 border border-saffron/50 p-1 px-2 rounded-full animate-in zoom-in duration-300">
                                <span className="text-xs font-bold text-[#4A3728] ml-2">Confirm Save?</span>
                                <button
                                    type="button"
                                    onClick={handleSaveToDatabase}
                                    className="bg-green-500 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-green-600 transition-colors"
                                >
                                    YES
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowSaveConfirm(false)}
                                    className="bg-gray-400 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-gray-500 transition-colors"
                                >
                                    NO
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {!sopanas.length ? (
                <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-clay/30 flex flex-col items-center justify-center space-y-6">
                    <div className="w-20 h-20 bg-saffron/10 text-saffron rounded-full flex items-center justify-center">
                        <FileUp size={40} />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-[#4A3728]">Upload Source Material</h3>
                        <p className="text-[#4A3728]/60 max-w-sm mx-auto mt-2">
                            Select a PDF book or transcript. Our AI will analyze it and structure it into bite-sized Sopanas.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="pdf-upload"
                        />
                        <label
                            htmlFor="pdf-upload"
                            className="bg-white border-2 border-clay/50 text-[#4A3728] px-8 py-3 rounded-xl font-bold cursor-pointer hover:border-saffron transition-all"
                        >
                            {file ? file.name : 'Choose PDF File'}
                        </label>

                        {file && (
                            <div className="w-full max-w-sm space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-[#4A3728]/40 ml-1">Book Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter book name (e.g. Bhagavad Gita Ch 1)"
                                    className="w-full p-3 border-2 border-clay/20 rounded-xl focus:border-saffron outline-none text-center font-bold"
                                    value={bookName}
                                    onChange={(e) => setBookName(e.target.value)}
                                />
                            </div>
                        )}

                        <button
                            disabled={!file || isGenerating}
                            onClick={handleGenerate}
                            className={`flex items-center gap-2 px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all ${!file || isGenerating
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-saffron to-orange-500 text-white hover:scale-105'
                                }`}
                        >
                            {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles size={22} />}
                            {isGenerating ? 'Processing...' : '✨ Auto-Generate Sopanas'}
                        </button>
                    </div>

                    {isGenerating && (
                        <div className="w-full max-w-md space-y-2">
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-saffron animate-pulse" style={{ width: '100%' }}></div>
                            </div>
                            <p className="text-center text-sm font-bold text-saffron tracking-widest uppercase">{progressStatus}</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-saffron/10 border border-saffron/20 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-[#4A3728] font-bold text-lg">
                                Generated {sopanas.length} Sopanas for "{bookName || file?.name}"
                            </p>
                            <p className="text-[#4A3728]/60 text-sm">Review the content below before saving to the database.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleVerifyCoverage}
                                disabled={isVerifying}
                                className="flex items-center gap-2 bg-white border-2 border-saffron/30 text-saffron px-5 py-2 rounded-xl font-bold hover:bg-saffron/5 transition-all text-sm disabled:opacity-50"
                            >
                                {isVerifying ? <Loader2 size={16} className="animate-spin" /> : <SearchCheck size={18} />}
                                Verify Coverage
                            </button>
                            <button
                                onClick={() => { setSopanas([]); setFile(null); setCoverageReport(null); }}
                                className="text-[#4A3728]/60 hover:text-red-500 text-sm font-bold flex items-center gap-1 px-4"
                            >
                                <Trash2 size={16} /> Reset
                            </button>
                        </div>
                    </div>

                    {coverageReport && (
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-3 animate-in fade-in slide-in-from-top duration-300">
                            <div className="flex items-center gap-2 text-blue-700 font-bold">
                                <Info size={20} />
                                <h3>AI Coverage Analysis</h3>
                            </div>
                            <div className="text-blue-900/80 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                {coverageReport}
                            </div>
                        </div>
                    )}

                    {sopanas.map((sopana, idx) => (
                        <div key={idx} className="bg-white border border-[#4A3728]/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                            {editingIndex === idx ? (
                                <div className="space-y-4">
                                    <input
                                        className="w-full p-3 border rounded-lg font-bold text-xl"
                                        value={editSopana?.title}
                                        onChange={(e) => setEditSopana({ ...editSopana!, title: e.target.value })}
                                    />
                                    <textarea
                                        className="w-full p-3 border rounded-lg h-32 text-sm"
                                        value={editSopana?.reading_text}
                                        onChange={(e) => setEditSopana({ ...editSopana!, reading_text: e.target.value })}
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => setEditingIndex(null)} className="p-2 text-gray-400 hover:text-gray-600"><X /></button>
                                        <button onClick={handleSaveEdit} className="p-2 text-green-500 hover:text-green-600"><Check /></button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-start">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 bg-clay/20 text-clay rounded-full flex items-center justify-center font-bold text-sm">
                                                {idx + 1}
                                            </span>
                                            <h3 className="font-bold text-xl text-[#4A3728]">{sopana.title}</h3>
                                        </div>
                                        <p className="text-[#4A3728]/70 text-sm line-clamp-3 leading-relaxed">
                                            {sopana.reading_text}
                                        </p>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                {sopana.revision_notes.length} Revision Points
                                            </span>
                                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                {sopana.quiz.length} Quiz Questions
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => handleEdit(idx)} className="p-2 text-clay hover:text-saffron transition-colors"><Edit2 size={20} /></button>

                                        {deletingIndex === idx ? (
                                            <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg animate-in fade-in slide-in-from-right duration-300">
                                                <span className="text-[10px] font-bold text-red-600 px-1">Delete?</span>
                                                <button type="button" onClick={() => handleRemove(idx)} className="text-red-600 font-bold p-1 hover:bg-red-100 rounded">✔</button>
                                                <button type="button" onClick={() => setDeletingIndex(null)} className="text-gray-400 p-1 hover:bg-gray-100 rounded">✖</button>
                                            </div>
                                        ) : (
                                            <button type="button" onClick={() => setDeletingIndex(idx)} className="p-2 text-clay hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourseFactory;
