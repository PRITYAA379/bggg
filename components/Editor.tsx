
import React, { useState, useRef, useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Chapter } from '../types';
import { BoldIcon, ItalicIcon, UnderlineIcon, ListIcon, PlayIcon, PauseIcon, MaximizeIcon, MinimizeIcon, BarChartIcon } from './Icons';
import { Analytics } from './Analytics';

interface EditorProps {
  chapter: Chapter | null;
  onUpdateContent: (content: string) => void;
  onUpdateTitle: (title: string) => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

export const Editor: React.FC<EditorProps> = ({ 
    chapter, 
    onUpdateContent, 
    onUpdateTitle, 
    isFocusMode, 
    onToggleFocusMode 
}) => {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // TTS Logic
  const synth = window.speechSynthesis;
  
  useEffect(() => {
    // Cleanup audio on unmount or chapter change
    return () => {
        synth.cancel();
    };
  }, [chapter?.id]);

  const handleTTS = () => {
      if (isPlaying) {
          synth.cancel();
          setIsPlaying(false);
      } else {
          if (!chapter?.content) return;
          const utterance = new SpeechSynthesisUtterance(chapter.content);
          utterance.rate = 1;
          utterance.pitch = 1;
          utterance.onend = () => setIsPlaying(false);
          synth.speak(utterance);
          setIsPlaying(true);
      }
  };

  const wordCount = useMemo(() => {
    if (!chapter?.content) return 0;
    return chapter.content.trim().split(/\s+/).filter(w => w.length > 0).length;
  }, [chapter?.content]);

  if (!chapter) {
    return (
      <div className="flex-1 flex items-center justify-center glass-panel h-full text-slate-500 rounded-xl m-4 electric-flow-border">
        <div className="text-center p-4">
          <p className="text-lg font-medium">No chapter selected</p>
          <p className="text-sm opacity-70">Select a chapter from the menu to start writing.</p>
        </div>
      </div>
    );
  }

  const applyFormat = (type: 'bold' | 'italic' | 'underline' | 'list') => {
    if (!textareaRef.current || !chapter) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);
    
    let newText = text;
    let newCursorStart = start;
    let newCursorEnd = end;

    switch(type) {
        case 'bold':
            newText = text.substring(0, start) + `**${selection}**` + text.substring(end);
            newCursorStart = start + 2;
            newCursorEnd = end + 2;
            break;
        case 'italic':
            newText = text.substring(0, start) + `*${selection}*` + text.substring(end);
            newCursorStart = start + 1;
            newCursorEnd = end + 1;
            break;
        case 'underline':
            newText = text.substring(0, start) + `<u>${selection}</u>` + text.substring(end);
            newCursorStart = start + 3;
            newCursorEnd = end + 3;
            break;
        case 'list':
             const prefix = selection.startsWith('- ') ? '' : '- ';
             newText = text.substring(0, start) + `\n${prefix}${selection}` + text.substring(end);
             newCursorStart = start + 1 + prefix.length;
             newCursorEnd = end + 1 + prefix.length;
             break;
    }

    onUpdateContent(newText);
    
    setTimeout(() => {
        if(textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newCursorStart, newCursorEnd);
        }
    }, 0);
  }

  return (
    <div className={`flex-1 flex flex-col h-full relative transition-all duration-500 ease-in-out w-full electric-flow-border ${isFocusMode ? 'm-0 rounded-none' : 'm-0 md:rounded-l-none'}`}>
      
      {showAnalytics && <Analytics chapter={chapter} />}

      {/* Header Area */}
      <div className={`flex flex-col border-b border-white/40 bg-white/40 backdrop-blur-md transition-all ${isFocusMode ? 'md:px-20 pt-2' : ''}`}>
        {/* Title Row */}
        <div className="px-4 pt-4 md:px-8 md:pt-6 pb-2 flex justify-between items-start">
            <input
                type="text"
                value={chapter.title}
                onChange={(e) => onUpdateTitle(e.target.value)}
                className="text-xl md:text-3xl font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 bg-transparent w-full font-serif-text"
                placeholder="Chapter Title"
            />
            
            <button
                onClick={onToggleFocusMode}
                className="p-2 ml-2 md:ml-4 text-slate-400 hover:text-brand-600 hover:bg-white/50 rounded-full transition-all hidden md:block"
                title={isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
            >
                {isFocusMode ? <MinimizeIcon className="w-5 h-5"/> : <MaximizeIcon className="w-5 h-5"/>}
            </button>
        </div>

        {/* Toolbar Row */}
        <div className="px-4 py-2 md:px-8 flex justify-between items-center overflow-x-auto ios-scroll no-scrollbar">
             {/* Formatting Tools - Hide text on mobile for space */}
             <div className="flex items-center space-x-1 h-8 flex-shrink-0">
                {mode === 'edit' && (
                    <>
                    <button onClick={() => applyFormat('bold')} className="p-2 md:p-1.5 hover:bg-black/5 rounded text-slate-600 transition-colors"><BoldIcon className="w-4 h-4" /></button>
                    <button onClick={() => applyFormat('italic')} className="p-2 md:p-1.5 hover:bg-black/5 rounded text-slate-600 transition-colors"><ItalicIcon className="w-4 h-4" /></button>
                    <button onClick={() => applyFormat('underline')} className="p-2 md:p-1.5 hover:bg-black/5 rounded text-slate-600 transition-colors"><UnderlineIcon className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-slate-300 mx-2"></div>
                    <button onClick={() => applyFormat('list')} className="p-2 md:p-1.5 hover:bg-black/5 rounded text-slate-600 transition-colors"><ListIcon className="w-4 h-4" /></button>
                    </>
                )}
             </div>

             <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0 ml-4">
                 {/* Smart Tools */}
                 <div className="flex items-center space-x-1 md:space-x-2 border-r border-slate-300 pr-2 md:pr-4 mr-1 md:mr-2">
                    <button 
                        onClick={() => setShowAnalytics(!showAnalytics)}
                        className={`p-1.5 rounded-lg transition-all flex items-center text-xs font-bold uppercase tracking-wider ${showAnalytics ? 'bg-brand-100 text-brand-700' : 'text-slate-500 hover:bg-white/50'}`}
                    >
                        <BarChartIcon className="w-4 h-4 md:mr-1.5"/>
                        <span className="hidden md:inline">Stats</span>
                    </button>
                    <button 
                        onClick={handleTTS}
                        className={`p-1.5 rounded-lg transition-all flex items-center text-xs font-bold uppercase tracking-wider ${isPlaying ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'text-slate-500 hover:bg-white/50'}`}
                    >
                        {isPlaying ? <PauseIcon className="w-4 h-4 md:mr-1.5"/> : <PlayIcon className="w-4 h-4 md:mr-1.5"/>}
                        <span className="hidden md:inline">{isPlaying ? 'Pause' : 'Listen'}</span>
                    </button>
                 </div>

                 <span className="text-[10px] md:text-xs text-slate-400 font-medium font-sans min-w-[50px] md:min-w-[60px] text-right">
                    {wordCount.toLocaleString()} w
                 </span>

                 {/* Mode Toggle */}
                 <div className="flex space-x-1 bg-slate-200/50 p-1 rounded-lg backdrop-blur-sm">
                    <button
                        onClick={() => setMode('edit')}
                        className={`px-2 md:px-3 py-1 text-[10px] md:text-xs font-medium rounded-md transition-all ${
                        mode === 'edit' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => setMode('preview')}
                        className={`px-2 md:px-3 py-1 text-[10px] md:text-xs font-medium rounded-md transition-all ${
                        mode === 'preview' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        View
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Editor / Preview Area */}
      <div className="flex-1 overflow-hidden relative bg-white/30 backdrop-blur-sm">
        {mode === 'edit' ? (
          <textarea
            ref={textareaRef}
            className={`w-full h-full resize-none focus:outline-none font-serif-text text-base md:text-lg leading-relaxed text-slate-700 selection:bg-brand-200 selection:text-brand-900 bg-transparent ${isFocusMode ? 'max-w-3xl mx-auto p-4 md:p-12' : 'p-4 md:p-10'} ios-scroll pb-32`}
            value={chapter.content}
            onChange={(e) => onUpdateContent(e.target.value)}
            placeholder="Start writing your masterpiece..."
          />
        ) : (
          <div className={`w-full h-full overflow-y-auto prose prose-slate max-w-none prose-base md:prose-lg font-serif-text ${isFocusMode ? 'px-4 md:px-20 py-8 md:py-12' : 'p-4 md:p-10'} ios-scroll pb-32`}>
             <div className={isFocusMode ? 'max-w-3xl mx-auto' : ''}>
                <ReactMarkdown>{chapter.content || '*No content yet.*'}</ReactMarkdown>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
