
import React, { useState } from 'react';
import { Book, Chapter } from '../types';
import { BookIcon, PlusIcon, TrashIcon, GripVerticalIcon, DownloadIcon, SparklesIcon, XIcon, GlobeIcon } from './Icons';

const SUPPORTED_LANGUAGES = [
    { code: 'English', label: 'English' },
    { code: 'Hindi', label: 'Hindi (हिंदी)' },
    { code: 'Marathi', label: 'Marathi (मరాఠీ)' },
    { code: 'Bengali', label: 'Bengali (বাংলা)' },
    { code: 'Telugu', label: 'Telugu (తెలుగు)' },
    { code: 'Tamil', label: 'Tamil (தமிழ்)' },
    { code: 'Gujarati', label: 'Gujarati (ગુજરાતી)' },
    { code: 'Kannada', label: 'Kannada (ಕನ್ನಡ)' },
    { code: 'Malayalam', label: 'Malayalam (മലയാളం)' },
    { code: 'Punjabi', label: 'Punjabi (ਪੰਜਾਬੀ)' },
    { code: 'Spanish', label: 'Spanish (Español)' },
    { code: 'French', label: 'French (Français)' },
    { code: 'German', label: 'German (Deutsch)' },
    { code: 'Japanese', label: 'Japanese (日本語)' },
];

interface SidebarProps {
  currentBook: Book | null;
  currentChapterId: string | null;
  onSelectChapter: (id: string) => void;
  onAddChapter: () => void;
  onDeleteChapter: (id: string) => void;
  onUpdateChapter: (id: string, updates: Partial<Chapter>) => void;
  onBackToDashboard: () => void;
  onReorderChapters: (startIndex: number, endIndex: number) => void;
  onGenerateSummary: (chapterId: string) => void;
  onTranslateChapter: (chapterId: string) => void;
  onUpdateBookLanguage: (lang: string) => void;
  isGenerating: boolean;
  onClose?: () => void; // For mobile
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentBook,
  currentChapterId,
  onSelectChapter,
  onAddChapter,
  onDeleteChapter,
  onUpdateChapter,
  onReorderChapters,
  onGenerateSummary,
  onTranslateChapter,
  onUpdateBookLanguage,
  isGenerating,
  onClose
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  if (!currentBook) return null;

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (draggedIndex === null || draggedIndex === index) return;
    onReorderChapters(draggedIndex, index);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleExportChapter = (e: React.MouseEvent, chapter: Chapter) => {
    e.stopPropagation();
    const filename = `${chapter.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    const content = `# ${chapter.title}\n\n${chapter.summary ? `> ${chapter.summary}\n\n` : ''}${chapter.content || ''}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col glass-panel electric-flow-border md:rounded-r-none">
      {/* Mobile Header */}
      {onClose && (
        <div className="md:hidden flex items-center justify-between p-4 border-b border-brand-500/20 bg-white/40">
            <span className="font-bold text-slate-800">Book Chapters</span>
            <button onClick={onClose} className="p-1 rounded-full bg-slate-200/50">
                <XIcon className="w-5 h-5 text-slate-600" />
            </button>
        </div>
      )}

      {/* Chapters List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 ios-scroll">
        <h3 className="hidden md:block text-xs font-extrabold text-brand-700/60 uppercase tracking-widest px-2 mb-4 mt-4">
          Chapters
        </h3>
        
        {currentBook.chapters.length === 0 && (
            <div className="text-sm text-slate-400 px-2 italic text-center py-4">No chapters defined.</div>
        )}

        {currentBook.chapters.map((chapter, index) => {
          const isSelected = currentChapterId === chapter.id;
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index && !isDragging;
          
          return (
            <div
                key={chapter.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => {
                    onSelectChapter(chapter.id);
                    if (onClose) onClose();
                }}
                className={`group flex flex-col p-3 rounded-xl text-sm cursor-pointer transition-all border relative ${
                isSelected
                    ? 'bg-white/90 shadow-lg ring-1 ring-brand-300 border-brand-200'
                    : 'text-slate-600 hover:bg-white/40 border-transparent bg-white/20 md:bg-transparent'
                } ${isDragging ? 'opacity-40 border-dashed border-brand-300 scale-95' : ''}
                  ${isDragOver ? 'border-t-2 border-t-brand-500/50 bg-brand-50/50' : ''}
                `}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center overflow-hidden flex-1">
                        {/* Drag Handle */}
                        <div className="mr-2 cursor-grab active:cursor-grabbing text-brand-300 hover:text-brand-500 flex-shrink-0 p-1" title="Drag to reorder">
                            <GripVerticalIcon className="w-4 h-4" />
                        </div>
                        <span className={`truncate select-none ${isSelected ? 'font-bold text-brand-700' : 'font-medium'}`}>
                            {chapter.title}
                        </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={(e) => handleExportChapter(e, chapter)}
                            className={`p-2 md:p-1 rounded-full hover:bg-brand-50 hover:text-brand-600 text-slate-400 transition-all ${isSelected ? 'opacity-100' : 'opacity-100 md:opacity-0 group-hover:opacity-100'}`}
                            title="Export Chapter"
                        >
                            <DownloadIcon className="w-4 h-4 md:w-3 md:h-3" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if(confirm('Are you sure you want to delete this chapter?')) onDeleteChapter(chapter.id);
                            }}
                            className={`p-2 md:p-1 rounded-full hover:bg-red-100 hover:text-red-600 transition-all ${isSelected ? 'opacity-100' : 'opacity-100 md:opacity-0 group-hover:opacity-100'}`}
                            title="Delete Chapter"
                        >
                            <TrashIcon className="w-4 h-4 md:w-3 md:h-3" />
                        </button>
                    </div>
                </div>

                {isSelected ? (
                    <div className="mt-3 animate-fadeIn pl-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2 mb-3">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onTranslateChapter(chapter.id);
                                }}
                                disabled={isGenerating || !chapter.content}
                                title={!chapter.content ? "Write content first to translate" : "Translate Chapter Content"}
                                className="flex-1 flex items-center justify-center text-[10px] bg-brand-50 border border-brand-200 text-brand-700 py-1.5 px-2 rounded-lg hover:bg-brand-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-semibold"
                            >
                                <GlobeIcon className="w-3 h-3 mr-1.5" />
                                {isGenerating ? 'Translating...' : 'Translate Content'}
                            </button>
                        </div>

                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] font-bold text-brand-400 uppercase tracking-wider block">
                                Chapter Summary
                            </label>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onGenerateSummary(chapter.id);
                                }}
                                disabled={isGenerating || !chapter.content}
                                className="text-[10px] flex items-center text-brand-600 hover:text-brand-700 disabled:opacity-50 disabled:cursor-not-allowed py-1 px-2 rounded hover:bg-brand-50"
                            >
                                <SparklesIcon className="w-3 h-3 mr-1" />
                                Generate Summary
                            </button>
                        </div>
                        <textarea
                            value={chapter.summary || ''}
                            onChange={(e) => onUpdateChapter(chapter.id, { summary: e.target.value })}
                            className="w-full text-xs text-slate-700 bg-white/50 border border-brand-200 rounded-md p-2 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 focus:outline-none resize-y min-h-[60px]"
                            placeholder="Brief summary of this chapter..."
                        />
                    </div>
                ) : (
                    chapter.summary && (
                        <p className="text-xs text-slate-400 mt-1 truncate pl-6 opacity-80">
                            {chapter.summary}
                        </p>
                    )
                )}
            </div>
          );
        })}
        
        <button
          onClick={onAddChapter}
          className="w-full flex items-center justify-center p-3 mt-4 text-sm text-brand-600 border border-brand-300/50 bg-white/40 rounded-xl hover:bg-white/80 transition-all border-dashed font-bold shadow-sm active:scale-95 duration-200"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Chapter
        </button>
      </div>
      
      {/* Footer / Language & Stats */}
      <div className="p-4 border-t border-brand-500/10 bg-white/20 backdrop-blur-sm space-y-3 mb-safe">
        <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-black text-brand-700/60 uppercase tracking-widest px-1">Book Language</label>
            <div className="relative group">
                <select 
                    value={currentBook.language || 'English'} 
                    onChange={(e) => onUpdateBookLanguage(e.target.value)}
                    className="w-full p-2 bg-white/40 border border-brand-200/50 rounded-lg text-xs font-bold focus:ring-1 focus:ring-brand-500 focus:outline-none appearance-none pr-8 cursor-pointer"
                >
                    {SUPPORTED_LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
                <GlobeIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-400 pointer-events-none group-hover:text-brand-600" />
            </div>
        </div>
        <div className="flex justify-between text-xs text-brand-800/60">
            <span>Chapters:</span>
            <span className="font-bold text-brand-900">{currentBook.chapters.length}</span>
        </div>
        <div className="flex justify-between text-xs text-brand-800/60">
            <span>Words:</span>
            <span className="font-bold text-brand-900">
                {currentBook.chapters.reduce((acc, ch) => acc + (ch.content ? ch.content.split(/\s+/).length : 0), 0).toLocaleString()}
            </span>
        </div>
      </div>
    </div>
  );
};
