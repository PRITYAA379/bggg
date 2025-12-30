
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Book, Chapter, AIActionType } from '../types';
import { 
    SparklesIcon, PlusIcon, TrashIcon, DownloadIcon, UploadIcon, XIcon, 
    ImageIcon, AlertTriangleIcon, HeadphonesIcon, CopyIcon, KeyIcon, 
    ShoppingCartIcon, ShieldCheckIcon, CheckCircleIcon, ArrowLeftIcon, 
    WandIcon, BrainIcon, RupeeIcon, ActivityIcon, HeartIcon, TargetIcon,
    BarChartIcon, GlobeIcon
} from './Icons';
import { GeminiService } from '../services/gemini';

const SUPPORTED_LANGUAGES = [
    { code: 'English', label: 'English' },
    { code: 'Hindi', label: 'Hindi (हिंदी)' },
    { code: 'Marathi', label: 'Marathi (मराठी)' },
    { code: 'Bengali', label: 'Bengali (বাংলা)' },
    { code: 'Telugu', label: 'Telugu (తెలుగు)' },
    { code: 'Tamil', label: 'Tamil (தமிழ்)' },
    { code: 'Gujarati', label: 'Gujarati (ગુજરાતી)' },
    { code: 'Kannada', label: 'Kannada (ಕನ್ನಡ)' },
    { code: 'Malayalam', label: 'Malayalam (മലയാളం)' },
    { code: 'Punjabi', label: 'Punjabi (ਪంజాబీ)' },
    { code: 'Spanish', label: 'Spanish (Español)' },
    { code: 'French', label: 'French (Français)' },
    { code: 'German', label: 'German (Deutsch)' },
    { code: 'Japanese', label: 'Japanese (日本語)' },
];

// --- STEP 1: CONCEPT ---
interface ConceptStepProps {
  book: Book;
  onUpdate: (book: Book) => void;
  onNext: () => void;
}

export const ConceptStep: React.FC<ConceptStepProps> = ({ book, onUpdate, onNext }) => {
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  
  const niches = [
    { id: 'Self-Help', label: 'Self-Help', desc: 'Personal Growth & Transformation', icon: SparklesIcon, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'Psychology', label: 'Psychology', desc: 'Behavioral Science & Mental Models', icon: BrainIcon, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'Personal Finance', label: 'Personal Finance', desc: 'Wealth, Assets & Crore Strategy', icon: RupeeIcon, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'Productivity', label: 'Productivity', desc: 'High-Performance Systems', icon: ActivityIcon, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'Wellness', label: 'Wellness', desc: 'Health, Vitality & Longevity', icon: HeartIcon, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  const trendingInspirations = [
    {
        title: "The Creative Act: A Way of Being",
        author: "Rick Rubin",
        growth: "+145.5%",
        genre: "Self-Help",
        desc: "A deep dive into the creative process and how to cultivate a mindset that fosters artistic expression and innovation.",
        color: "bg-amber-500"
    },
    {
        title: "Build the Life You Want",
        author: "Arthur C. Brooks & Oprah Winfrey",
        growth: "+210.2%",
        genre: "Psychology",
        desc: "A research-based guide to finding happiness regardless of external circumstances using the tools of emotional self-management.",
        color: "bg-purple-500"
    },
    {
        title: "Atomic Habits",
        author: "James Clear",
        growth: "+85%",
        genre: "Productivity",
        desc: "A perennial bestseller focused on the science of small habits and how they lead to remarkable long-term results.",
        color: "bg-blue-500"
    },
    {
        title: "101 Essays That Will Change The Way You Think",
        author: "Brianna Wiest",
        growth: "+120%",
        genre: "Self-Help",
        desc: "A compilation of short pieces exploring self-sabotage, emotional intelligence, and finding clarity in chaos.",
        color: "bg-rose-500"
    },
    {
        title: "The Psychology of Money",
        author: "Morgan Housel",
        growth: "+190%",
        genre: "Personal Finance",
        desc: "Timeless lessons on wealth, greed, and happiness, focusing on the human behavior behind financial success.",
        color: "bg-emerald-500"
    }
  ];

  const handleChange = (field: keyof Book, value: string) => {
    onUpdate({ ...book, [field]: value });
  };

  const applyInspiration = (ins: typeof trendingInspirations[0]) => {
      onUpdate({
          ...book,
          title: ins.title,
          description: ins.desc,
          genre: ins.genre,
          author: ins.author
      });
  };

  const handleGenerateCover = async () => {
    if (!book.title) { alert("Please enter a book title first."); return; }
    setIsGeneratingCover(true);
    try {
        const coverUrl = await GeminiService.generateCoverImage(book);
        if (coverUrl) onUpdate({ ...book, coverImage: coverUrl });
    } catch (e) { console.error(e); } finally { setIsGeneratingCover(false); }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-sm rounded-2xl border border-slate-200 mt-8 mb-10 electric-flow-border animate-fade-in scroll-smooth">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Manuscript Foundation</h2>
        <p className="text-slate-500">Define the core niche and premise for your high-value intellectual property.</p>
      </div>

      <div className="space-y-12">
        
        {/* TRENDING INSPIRATION SECTION */}
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-brand-600 uppercase tracking-[0.2em] ml-1 flex items-center">
                    <BarChartIcon className="w-4 h-4 mr-2" /> Bestseller Rising Stars (2024-2025 Market)
                </label>
                <span className="text-[9px] text-slate-400 font-mono">LIVE_DATA_FEED</span>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-6 ios-scroll no-scrollbar">
                {trendingInspirations.map((ins, idx) => (
                    <button
                        key={idx}
                        onClick={() => applyInspiration(ins)}
                        className="flex-shrink-0 w-72 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left hover:border-brand-400 hover:shadow-xl transition-all group relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 p-2 text-white text-[9px] font-bold ${ins.color} rounded-bl-xl shadow-lg`}>
                            {ins.growth} Growth
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase mb-2">{ins.genre}</div>
                        <h4 className="font-black text-slate-900 text-sm leading-tight mb-2 group-hover:text-brand-600 transition-colors">
                            {ins.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 line-clamp-3 mb-4 leading-relaxed italic">
                            {ins.desc}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">By {ins.author}</span>
                             <span className="text-[9px] font-bold text-brand-600 flex items-center">USE FRAMEWORK <PlusIcon className="w-3 h-3 ml-1" /></span>
                        </div>
                    </button>
                ))}
            </div>
        </div>

        {/* NICHE & LANGUAGE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Professional Domain</label>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {niches.map((n) => (
                        <button
                            key={n.id}
                            onClick={() => handleChange('genre', n.id)}
                            className={`p-4 rounded-xl border transition-all text-left flex flex-col group relative overflow-hidden ${
                                book.genre === n.id 
                                ? `border-${n.color.split('-')[1]}-400 ring-2 ring-${n.color.split('-')[1]}-400/20 ${n.bg}` 
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                        >
                            <n.icon className={`w-6 h-6 mb-3 transition-transform group-hover:scale-110 ${book.genre === n.id ? n.color : 'text-slate-400'}`} />
                            <span className={`text-xs font-bold leading-tight ${book.genre === n.id ? 'text-slate-900' : 'text-slate-500'}`}>{n.label}</span>
                            <span className="text-[9px] text-slate-400 mt-1 leading-tight opacity-0 group-hover:opacity-100 transition-opacity">{n.desc}</span>
                            {book.genre === n.id && (
                                <div className="absolute top-2 right-2">
                                    <CheckCircleIcon className={`w-3 h-3 ${n.color}`} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-1 space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Manuscript Language</label>
                <div className="relative group">
                    <div className="absolute inset-0 bg-brand-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <select 
                        value={book.language || 'English'} 
                        onChange={(e) => handleChange('language', e.target.value)}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none appearance-none pr-10 cursor-pointer"
                    >
                        {SUPPORTED_LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                    </select>
                    <GlobeIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-hover:text-brand-500 transition-colors" />
                </div>
                <p className="text-[9px] text-slate-400 font-medium px-1">AI will draft your book primarily in this language.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
            <div className="space-y-6">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Bestseller Title</label>
                    <input placeholder="The Wealth Blueprint" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none focus:bg-white transition-all font-bold" value={book.title} onChange={(e) => handleChange('title', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Author Identity</label>
                    <input placeholder="Dr. Sarah Collins" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none focus:bg-white transition-all" value={book.author} onChange={(e) => handleChange('author', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">The Core Promise</label>
                    <textarea rows={4} placeholder="What is the single biggest transformation or insight this book provides?" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none focus:bg-white transition-all text-sm leading-relaxed" value={book.description} onChange={(e) => handleChange('description', e.target.value)} />
                </div>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="w-48 h-64 bg-white border border-slate-200 shadow-2xl rounded-lg flex items-center justify-center overflow-hidden relative group">
                    {book.coverImage ? (
                        <img src={book.coverImage} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                        <div className="text-center p-6">
                            <ImageIcon className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Awaiting Visual Identity</span>
                        </div>
                    )}
                </div>
                <div className="space-y-3 relative z-10">
                    <h4 className="font-bold text-slate-800">Visual Identity Generator</h4>
                    <p className="text-xs text-slate-500 max-w-xs">Our neural network will manifest cover art that resonates with your chosen domain.</p>
                    <button onClick={handleGenerateCover} disabled={isGeneratingCover || !book.title} className="px-6 py-2.5 bg-brand-600 text-white rounded-full font-bold shadow-lg shadow-brand-600/20 disabled:opacity-30 hover:bg-brand-700 transition-all flex items-center justify-center mx-auto">
                        {isGeneratingCover ? 'Manifesting...' : <><SparklesIcon className="w-4 h-4 mr-2" /> Generate Art</>}
                    </button>
                </div>
            </div>
        </div>

        <button 
            onClick={onNext} 
            disabled={!book.title || !book.genre}
            className="w-full py-5 bg-slate-900 text-white rounded-xl font-black text-lg shadow-xl hover:bg-black transition-all transform active:scale-[0.98] disabled:opacity-30 flex items-center justify-center group"
        >
            LOCK CONCEPT & PROCEED <ArrowLeftIcon className="w-5 h-5 ml-3 rotate-180 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

// --- STEP 2: OUTLINE ---
export const OutlineStep: React.FC<{book: Book, onUpdate: (b: Book) => void, onNext: () => void}> = ({ book, onUpdate, onNext }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const outline = await GeminiService.generateOutline(book);
            if (outline) {
                const chapters = outline.map((item: any) => ({
                    id: crypto.randomUUID(), title: item.title, summary: item.summary, content: '', lastUpdated: Date.now()
                }));
                onUpdate({ ...book, chapters });
            }
        } catch (e) { 
            alert("Error generating outline. Please check your connection."); 
        } finally {
            setIsGenerating(false);
        }
    };

    const handleLanguageChange = async (newLang: string) => {
        if (newLang === book.language) return;
        
        // If chapters exist, we automatically translate them
        if (book.chapters.length > 0) {
            setIsTranslating(true);
            try {
                const translatedOutline = await GeminiService.translateOutline(
                    book.chapters.map(c => ({ title: c.title, summary: c.summary })),
                    newLang
                );
                
                const updatedChapters = book.chapters.map((c, i) => ({
                    ...c,
                    title: translatedOutline[i]?.title || c.title,
                    summary: translatedOutline[i]?.summary || c.summary
                }));
                
                onUpdate({ ...book, language: newLang, chapters: updatedChapters });
            } catch (e) {
                console.error("Auto-translation of outline failed", e);
                onUpdate({ ...book, language: newLang });
            } finally {
                setIsTranslating(false);
            }
        } else {
            onUpdate({ ...book, language: newLang });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white border border-slate-200 shadow-sm rounded-xl mt-8 mb-10 animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-slate-800">Step 2: Structural Architecture</h2>
                <p className="text-slate-500">Map out the chapters and flow of your masterpiece.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="md:col-span-1 space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 group">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Switch Language</label>
                        <div className="relative">
                            <select 
                                value={book.language || 'English'} 
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-brand-500 appearance-none pr-8 cursor-pointer"
                            >
                                {SUPPORTED_LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                            </select>
                            <GlobeIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-brand-600" />
                        </div>
                        {isTranslating && <p className="text-[10px] text-brand-600 mt-2 font-bold animate-pulse">Auto-syncing table of contents...</p>}
                    </div>

                    <button 
                        onClick={handleGenerate} 
                        disabled={isGenerating || isTranslating}
                        className="w-full py-4 bg-brand-50 text-brand-700 border border-brand-200 rounded-xl font-bold shadow-sm hover:bg-brand-100 transition-all flex flex-col items-center justify-center space-y-2 disabled:opacity-50"
                    >
                        <SparklesIcon className={`w-6 h-6 ${isGenerating ? 'animate-spin' : ''}`} />
                        <span>{isGenerating ? 'Architecting...' : 'AI Roadmap'}</span>
                    </button>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-500 leading-relaxed font-mono">
                        > SYSTEM: AI will analyze your concept and generate a logical flow of chapters optimized for engagement and conversion in {book.language || 'English'}.
                    </div>
                </div>

                <div className="md:col-span-2 bg-slate-50/50 rounded-2xl border border-slate-200 p-6 min-h-[400px] relative">
                    {isTranslating && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl">
                            <div className="text-center">
                                <SparklesIcon className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-2" />
                                <p className="text-xs font-bold text-slate-600">Translating Outline...</p>
                            </div>
                        </div>
                    )}
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Proposed Chapters</h3>
                    {book.chapters.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 opacity-50 py-20">
                            <UploadIcon className="w-10 h-10" />
                            <p className="text-sm">No chapters generated yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {book.chapters.map((c, i) => (
                                <div key={c.id} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center shadow-sm group hover:border-brand-300 transition-all">
                                    <span className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-xs mr-4">{i+1}</span>
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="font-bold text-slate-800 truncate text-sm">{c.title}</h4>
                                        <p className="text-[10px] text-slate-500 truncate">{c.summary}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <button 
                onClick={onNext} 
                disabled={book.chapters.length === 0 || isTranslating} 
                className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold shadow-lg shadow-brand-600/20 hover:bg-brand-700 transition-all disabled:opacity-30 flex items-center justify-center"
            >
                Confirm Structure & Start Writing <ArrowLeftIcon className="w-4 h-4 ml-2 rotate-180" />
            </button>
        </div>
    );
};

// --- STEP 3: SECURE ---
export const SecureStep: React.FC<{book: Book, onNext: () => void}> = ({ book, onNext }) => {
    const [licenseKey, setLicenseKey] = useState('');
    const [archiveCode, setArchiveCode] = useState('');
    const [copyState, setCopyState] = useState<'none' | 'id' | 'code'>('none');

    useEffect(() => {
        const generateLuxuryKey = () => {
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const numbers = "0123456789";
            let lPart = "";
            for(let i=0; i<5; i++){
                for(let j=0; j<4; j++) lPart += letters.charAt(Math.floor(Math.random() * letters.length));
                if(i<4) lPart += "-";
            }
            let nPart = "";
            for(let i=0; i<9; i++) nPart += numbers.charAt(Math.floor(Math.random() * numbers.length));
            return `${lPart}-${nPart}`;
        };

        setLicenseKey(generateLuxuryKey());
        
        try {
            // Encode using UTF-8 safe method
            const json = JSON.stringify(book);
            setArchiveCode(btoa(unescape(encodeURIComponent(json))));
        } catch (e) { console.error(e); }
    }, [book]);

    const handleCopy = (text: string, type: 'id' | 'code') => {
        navigator.clipboard.writeText(text);
        setCopyState(type);
        setTimeout(() => setCopyState('none'), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto p-12 bg-white shadow-2xl rounded-3xl border border-slate-200 mt-10 mb-10 text-center electric-flow-border animate-fade-in">
            <div className="mb-6 relative inline-block">
                <ShieldCheckIcon className="w-16 h-16 text-amber-500 mx-auto" />
                <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-20 -z-10 animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Project Security Protocol</h2>
            <p className="text-slate-500 mb-10 max-w-lg mx-auto">Your manuscript is stored in your browser. Save the <strong>Archive Data</strong> below to ensure you can recover your work on any device or browser.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left shadow-inner flex flex-col group relative">
                    <div className="absolute -top-3 right-4 bg-slate-200 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Label Only</div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Manuscript ID</label>
                    <div className="font-mono text-sm font-black text-slate-400 break-all bg-white p-4 rounded-lg border border-slate-200 flex-1 flex items-center justify-center text-center select-all">{licenseKey}</div>
                    <p className="text-[10px] text-slate-400 mt-3 italic">* This ID does NOT contain your book data. It's just a reference.</p>
                    <button 
                        onClick={() => handleCopy(licenseKey, 'id')} 
                        className={`mt-4 w-full py-2.5 rounded-lg text-xs font-bold uppercase transition-all ${copyState === 'id' ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}
                    >
                        {copyState === 'id' ? 'ID Copied!' : 'Copy ID'}
                    </button>
                </div>

                <div className="bg-slate-900 p-6 rounded-2xl text-left relative overflow-hidden flex flex-col ring-4 ring-brand-500/10">
                    <div className="absolute top-0 left-0 w-full h-1 bg-brand-500"></div>
                    <div className="absolute -top-3 right-4 bg-brand-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase animate-pulse">Critical Data</div>
                    <label className="text-[10px] font-bold text-brand-500 uppercase tracking-widest block mb-2">Digital Archive Code</label>
                    <div className="font-mono text-[9px] text-brand-200/60 h-28 overflow-y-auto bg-black/40 p-3 rounded-lg border border-white/5 no-scrollbar mb-2 break-all leading-tight select-all cursor-text">
                        {archiveCode}
                    </div>
                    <p className="text-[10px] text-brand-400/70 mt-1 font-medium">↑ This code contains your ENTIRE manuscript. Paste this in the "Import" section to recover your work.</p>
                    <button 
                        onClick={() => handleCopy(archiveCode, 'code')} 
                        className={`mt-4 w-full py-2.5 rounded-lg text-xs font-bold uppercase transition-all ${copyState === 'code' ? 'bg-green-500 text-white' : 'bg-brand-500 text-white hover:bg-brand-400'}`}
                    >
                        {copyState === 'code' ? 'ARCHIVE COPIED SUCCESS!' : 'Copy Full Archive Data'}
                    </button>
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-10 flex items-start text-left">
                <AlertTriangleIcon className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                    <strong>Warning:</strong> Clearing your browser cache or history may delete your manuscript. <strong>Always</strong> copy and save the "Digital Archive Code" in a safe place like a Notepad or Cloud Drive before closing this tab.
                </p>
            </div>

            <button onClick={onNext} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-xl hover:bg-black transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center">
                I have saved my data safely <ArrowLeftIcon className="w-4 h-4 ml-3 rotate-180" />
            </button>
        </div>
    );
};

// --- STEP 5: PUBLISH ---
export const PublishStep: React.FC<{book: Book, onBack: () => void}> = ({ book, onBack }) => {
    const [isGeneratingMarket, setIsGeneratingMarket] = useState(false);
    const [marketCopy, setMarketCopy] = useState<string | null>(null);

    const handleGenerateMarketCopy = async () => {
        setIsGeneratingMarket(true);
        try {
            const copy = await GeminiService.generateAmazonDescription(book);
            setMarketCopy(copy);
        } catch (e) {
            alert("Failed to generate market copy.");
        } finally {
            setIsGeneratingMarket(false);
        }
    };

    const handleDownloadPDF = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const cleanForPDF = (text: string) => {
            if (!text) return '';
            
            // Convert common markdown elements to basic HTML for printing
            let html = text
                .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/__(.*?)__/g, '<strong>$1</strong>')
                .replace(/_(.*?)_/g, '<em>$1</em>')
                // Headings
                .replace(/^###\s+(.*)$/gm, '<h4 style="font-family:\'EB Garamond\', serif; font-size: 16pt; margin-top: 20pt; color: #333;">$1</h4>')
                .replace(/^##\s+(.*)$/gm, '<h3 style="font-family:\'EB Garamond\', serif; font-size: 18pt; margin-top: 25pt; color: #222;">$1</h3>')
                .replace(/^#\s+(.*)$/gm, '<h2 style="font-family:\'EB Garamond\', serif; font-size: 22pt; margin-top: 30pt; color: #111; text-align: center;">$1</h2>')
                // Lists
                .replace(/^\s*[\*\-]\s+(.*)$/gm, '<li style="margin-left: 20pt; margin-bottom: 5pt;">$1</li>')
                // Scene separators
                .replace(/^\s*\*\*\*\s*$/gm, '<div style="text-align: center; margin: 30pt 0; font-size: 18pt; letter-spacing: 10pt;">***</div>')
                // Blockquotes
                .replace(/^\>\s+(.*)$/gm, '<blockquote style="border-left: 2pt solid #ccc; padding-left: 15pt; margin-left: 0; color: #555; font-style: italic;">$1</blockquote>');

            // Wrap paragraphs - simple splitting on double newline
            return html.split('\n\n').map(p => {
                if (p.trim().startsWith('<li')) return `<ul style="list-style-type: disc; margin-bottom: 12pt;">${p.trim()}</ul>`;
                if (p.trim().startsWith('<h') || p.trim().startsWith('<div') || p.trim().startsWith('<blockquote')) return p.trim();
                return `<p style="text-align: justify; text-indent: 1.5em; margin-bottom: 12pt; orphans: 3; widows: 3;">${p.trim()}</p>`;
            }).join('');
        };

        const styles = `
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=EB+Garamond:ital,wght@0,400;0,700;1,400&display=swap');
            
            @page {
                size: A4;
                margin: 2.5cm 2.5cm 3cm 2.5cm;
            }

            body { 
                font-family: 'EB Garamond', serif; 
                font-size: 12pt; 
                line-height: 1.6; 
                color: #111; 
                margin: 0; 
                padding: 0; 
            }

            .page { 
                page-break-after: always; 
                position: relative;
                min-height: 100vh;
            }

            .title-page { 
                text-align: center; 
                display: flex; 
                flex-direction: column; 
                justify-content: center; 
                align-items: center;
                height: 100vh; 
            }

            h1 { font-family: 'Playfair Display', serif; font-size: 42pt; margin: 0; font-weight: 700; }
            .subtitle { font-family: 'EB Garamond', serif; font-size: 18pt; color: #555; margin-top: 10pt; font-style: italic; }
            .author { font-size: 20pt; margin-top: 60pt; font-weight: 400; }
            .branding { position: absolute; bottom: 50pt; left: 0; right: 0; letter-spacing: 5px; font-size: 9pt; color: #999; text-transform: uppercase; }

            .copyright-page {
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                padding-bottom: 50pt;
                font-size: 10pt;
                color: #444;
            }

            .chapter-heading { 
                font-family: 'Playfair Display', serif; 
                font-size: 28pt; 
                margin-top: 100pt;
                margin-bottom: 50pt; 
                text-align: center;
                border-top: 1px solid #eee;
                padding-top: 30pt;
            }

            .toc-title { font-family: 'Playfair Display', serif; font-size: 24pt; margin-bottom: 40pt; text-align: center; }
            .toc { list-style: none; padding: 0; max-width: 80%; margin: 0 auto; }
            .toc li { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12pt; }
            .toc li::after { content: ""; flex: 1; border-bottom: 1px dotted #ccc; margin: 0 10pt; }
            .toc li span:last-child { order: 2; }

            p { margin-top: 0; }
            
            /* Professional first-letter handling (Drop Cap emulation) */
            .chapter-content p:first-of-type::first-letter {
                float: left;
                font-size: 3.5em;
                line-height: 0.8;
                padding-top: 4pt;
                padding-right: 8pt;
                font-family: 'Playfair Display', serif;
            }

            @media print {
                .no-print { display: none; }
                .page { height: auto; min-height: 0; }
            }
        `;

        printWindow.document.write(`
            <html>
                <head>
                    <title>${book.title} - Professional Manuscript</title>
                    <style>${styles}</style>
                </head>
                <body>
                    <!-- TITLE PAGE -->
                    <div class="page title-page">
                        <h1>${book.title}</h1>
                        <div class="subtitle">${book.genre || 'A Professional Manuscript'}</div>
                        <div class="author">By ${book.author}</div>
                        <div class="branding">DigitalConfvisions Elite Writer Suite</div>
                    </div>

                    <!-- COPYRIGHT PAGE -->
                    <div class="page copyright-page">
                        <p>Copyright © ${new Date().getFullYear()} by ${book.author}</p>
                        <p>All rights reserved. No part of this publication may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the publisher, except in the case of brief quotations embodied in critical reviews and certain other noncommercial uses permitted by copyright law.</p>
                        <p>First Edition: ${new Date().toLocaleDateString()}</p>
                        <p style="margin-top: 20pt; font-style: italic;">Created using DigitalConfvisions AI Writer Suite.</p>
                    </div>

                    <!-- TOC PAGE -->
                    <div class="page">
                        <h2 class="toc-title">Table of Contents</h2>
                        <ul class="toc">
                            ${book.chapters.map((c, i) => `<li><span>Chapter ${i+1}: ${c.title}</span><span></span></li>`).join('')}
                        </ul>
                    </div>

                    <!-- CHAPTERS -->
                    ${book.chapters.map((c, i) => `
                        <div class="page">
                            <h2 class="chapter-heading">Chapter ${i+1}<br/><span style="font-size: 18pt; font-weight: normal; font-style: italic;">${c.title}</span></h2>
                            <div class="chapter-content">${cleanForPDF(c.content)}</div>
                        </div>
                    `).join('')}
                    
                    <script>
                        window.onload = () => {
                            setTimeout(() => {
                                window.print();
                                // We don't close so the user can see it first if they want to cancel print
                            }, 500);
                        }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="max-w-5xl mx-auto p-12 space-y-12 animate-fade-in">
            <div className="text-center">
                <div className="inline-block p-3 bg-brand-50 rounded-2xl mb-4">
                    <CheckCircleIcon className="w-10 h-10 text-brand-600" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Publication Readiness</h2>
                <p className="text-slate-500 mt-2">Your intellectual asset is refined and ready for the global marketplace.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-[-20px] right-[-20px] w-48 h-48 bg-brand-500 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-4 flex items-center">
                            <DownloadIcon className="w-6 h-6 mr-3 text-brand-400" /> Export Assets
                        </h3>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed">Download your manuscript in a professionally formatted PDF layout, complete with Title Page, Copyright, and Table of Contents.</p>
                        <button onClick={handleDownloadPDF} className="w-full py-4 bg-brand-500 text-white rounded-xl font-black shadow-lg hover:bg-brand-400 transition-all flex items-center justify-center transform active:scale-95">
                            <DownloadIcon className="w-5 h-5 mr-3" /> Download Deluxe PDF
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-10 rounded-3xl shadow-sm flex flex-col relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingCartIcon className="w-20 h-20 text-brand-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                        <SparklesIcon className="w-6 h-6 mr-3 text-brand-500" /> Market Ready
                    </h3>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">Generate high-converting Amazon KDP descriptions, sales copy, and social media blurbs using the latest AI copywriting logic.</p>
                    
                    {!marketCopy ? (
                        <button 
                            onClick={handleGenerateMarketCopy} 
                            disabled={isGeneratingMarket}
                            className="w-full py-4 bg-brand-50 text-brand-700 border border-brand-200 rounded-xl font-bold hover:bg-brand-100 transition-all flex items-center justify-center"
                        >
                            {isGeneratingMarket ? 'Analyzing...' : <><WandIcon className="w-5 h-5 mr-3" /> Generate Sales Copy</>}
                        </button>
                    ) : (
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex-1 flex flex-col">
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex justify-between">
                                <span>Preview: Bestseller Description</span>
                                <button onClick={() => {navigator.clipboard.writeText(marketCopy); alert('Copied!');}} className="text-brand-600 hover:underline">Copy All</button>
                            </div>
                            <div className="text-xs text-slate-600 overflow-y-auto max-h-[150px] mb-4 prose prose-xs leading-relaxed">
                                <ReactMarkdown>{marketCopy}</ReactMarkdown>
                            </div>
                            <button onClick={() => setMarketCopy(null)} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 self-center">Regenerate</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="text-center pt-8">
                <button onClick={onBack} className="text-slate-400 font-bold hover:text-brand-600 transition-all flex items-center mx-auto">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" /> Return to Workspace
                </button>
            </div>
        </div>
    );
};
