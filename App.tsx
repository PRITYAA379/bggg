
import React, { useState, useEffect } from 'react';
import { Book, Chapter, AIActionType } from './types';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { AIPanel } from './components/AIPanel';
import { ConceptStep, OutlineStep, PublishStep, SecureStep } from './components/Steps';
import { BookThinker } from './components/BookThinker';
import { SubscriptionPlans } from './components/SubscriptionPlans';
import { GeminiService } from './services/gemini';
import { DownloadIcon, LightbulbIcon, ListIcon, PenIcon, CheckCircleIcon, ArrowLeftIcon, MenuIcon, SparklesIcon, ShieldCheckIcon } from './components/Icons';

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentBookId, setCurrentBookId] = useState<string | null>(null);
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);
  
  // New States for Thinker & Plans
  const [showThinker, setShowThinker] = useState(false);
  const [showSubscriptions, setShowSubscriptions] = useState(false);

  // Mobile drawer states
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileAIPanelOpen, setMobileAIPanelOpen] = useState(false);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('inkflow_books_v2');
    if (saved) {
      try {
        setBooks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load books", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('inkflow_books_v2', JSON.stringify(books));
  }, [books]);

  const currentBook = books.find(b => b.id === currentBookId) || null;
  const currentChapter = currentBook?.chapters.find(c => c.id === currentChapterId) || null;

  // Handles both creating new books and importing books from secret key
  const handleCreateOrImportBook = (newBookData: Partial<Book>) => {
    const newBook: Book = {
      id: newBookData.id || crypto.randomUUID(),
      title: newBookData.title!,
      author: newBookData.author || 'Anonymous',
      genre: newBookData.genre || '',
      description: newBookData.description || '',
      tone: newBookData.tone || 'Neutral',
      language: newBookData.language || 'English',
      chapters: newBookData.chapters || [],
      coverImage: newBookData.coverImage,
      targetAudience: newBookData.targetAudience,
      createdAt: newBookData.createdAt || Date.now(),
      currentStep: newBookData.currentStep || 1
    };
    setBooks(prev => [...prev, newBook]);
    setCurrentBookId(newBook.id);
  };

  const updateBook = (updatedBook: Book) => {
    setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
  };

  const handleStepChange = (step: 1 | 2 | 3 | 4 | 5) => {
      if(!currentBook) return;
      updateBook({ ...currentBook, currentStep: step });
      
      // Auto-select first chapter when entering writing mode (Step 4)
      if (step === 4 && !currentChapterId && currentBook.chapters.length > 0) {
          setCurrentChapterId(currentBook.chapters[0].id);
      }
  };

  // --- Actions (Drafting) ---
  const handleAddChapter = () => {
    if (!currentBook) return;
    const newChapter: Chapter = {
      id: crypto.randomUUID(),
      title: `Chapter ${currentBook.chapters.length + 1}`,
      content: '',
      summary: '',
      lastUpdated: Date.now(),
    };
    const updatedBook = {
      ...currentBook,
      chapters: [...currentBook.chapters, newChapter],
    };
    updateBook(updatedBook);
    setCurrentChapterId(newChapter.id);
  };

  const handleDeleteChapter = (id: string) => {
      if (!currentBook) return;
      const updatedBook = {
          ...currentBook,
          chapters: currentBook.chapters.filter(c => c.id !== id)
      };
      updateBook(updatedBook);
      if (currentChapterId === id) setCurrentChapterId(null);
  };

  const handleUpdateChapter = (id: string, updates: Partial<Chapter>) => {
    if (!currentBook) return;
    const updatedChapters = currentBook.chapters.map(c => 
        c.id === id ? { ...c, ...updates, lastUpdated: Date.now() } : c
    );
    updateBook({ ...currentBook, chapters: updatedChapters });
  };

  const handleReorderChapters = (startIndex: number, endIndex: number) => {
    if (!currentBook) return;
    const newChapters = [...currentBook.chapters];
    const [reorderedItem] = newChapters.splice(startIndex, 1);
    newChapters.splice(endIndex, 0, reorderedItem);
    updateBook({ ...currentBook, chapters: newChapters });
  };

  const handleUpdateContent = (content: string) => {
    if (!currentBook || !currentChapter) return;
    handleUpdateChapter(currentChapter.id, { content });
  };
  
  const handleUpdateTitle = (title: string) => {
    if (!currentBook || !currentChapter) return;
    handleUpdateChapter(currentChapter.id, { title });
  };

  const handleGenerateSummary = async (chapterId: string) => {
    const chapterToSummarize = currentBook?.chapters.find(c => c.id === chapterId);
    if (!chapterToSummarize || !chapterToSummarize.content) {
        alert("Chapter content is empty. Write something first!");
        return;
    }

    setIsGenerating(true);
    try {
        const summary = await GeminiService.generateChapterSummary(
            chapterToSummarize.content, 
            currentBook?.language
        );
        handleUpdateChapter(chapterId, { summary });
    } catch (e) {
        console.error("Summary generation failed", e);
        alert("Failed to generate summary.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleTranslateChapter = async (chapterId: string) => {
    const chapterToTranslate = currentBook?.chapters.find(c => c.id === chapterId);
    if (!chapterToTranslate || !chapterToTranslate.content) {
      alert("Chapter content is empty. Please write or generate content before translating.");
      return;
    }

    const language = window.prompt("Into which language would you like to translate this chapter? (e.g. Hindi, Spanish, French)", currentBook?.language);
    if (!language) return;

    if (!window.confirm(`This will translate the content into ${language} and overwrite the current text. Are you sure?`)) return;

    setIsGenerating(true);
    try {
      const translatedContent = await GeminiService.translateText(chapterToTranslate.content, language);
      handleUpdateChapter(chapterId, { content: translatedContent });
      alert(`Chapter translated to ${language} successfully!`);
    } catch (e) {
      console.error("Translation failed", e);
      alert("Translation failed. Please try again or check your connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateBookLanguage = (lang: string) => {
      if (!currentBook) return;
      updateBook({ ...currentBook, language: lang });
  };

  const handleAIAction = async (action: AIActionType, params: any) => {
    if (!currentBook) {
        alert("Please select a book first.");
        return;
    }

    setIsGenerating(true);
    try {
        let result = '';
        const { config, prompt } = params;

        // Route actions
        if ([
            AIActionType.WRITE_WHOLE_CHAPTER, 
            AIActionType.WRITE_CHAPTER, 
            AIActionType.CONTINUE_WRITING, 
            AIActionType.REWRITE_SELECTION, 
            AIActionType.REWRITE_CHAPTER
        ].includes(action)) {
             if(!currentChapter) { alert("Select a chapter."); return; }
             
             switch (action) {
                case AIActionType.WRITE_WHOLE_CHAPTER:
                    result = await GeminiService.writeChapter(currentBook, currentChapter, prompt, config, true);
                    handleUpdateContent(result);
                    break;
                case AIActionType.WRITE_CHAPTER:
                    result = await GeminiService.writeChapter(currentBook, currentChapter, prompt, config, false);
                    handleUpdateContent(currentChapter.content + (currentChapter.content ? '\n\n' : '') + result);
                    break;
                case AIActionType.CONTINUE_WRITING:
                    result = await GeminiService.continueWriting(currentBook, currentChapter, currentChapter.content, config);
                    handleUpdateContent(currentChapter.content + ' ' + result);
                    break;
                case AIActionType.REWRITE_SELECTION:
                    const selection = window.getSelection()?.toString();
                    if (selection) {
                        result = await GeminiService.refineText(selection, prompt || "Improve style and grammar");
                        const newContent = currentChapter.content.replace(selection, result);
                        handleUpdateContent(newContent);
                    } else {
                        alert("Please highlight the text you want to refine.");
                    }
                    break;
                case AIActionType.REWRITE_CHAPTER:
                    if (currentChapter.content) {
                        result = await GeminiService.refineText(currentChapter.content, prompt || "Improve style and grammar");
                        handleUpdateContent(result);
                    } else {
                        alert("Chapter is empty.");
                    }
                    break;
            }
        } else {
            // New 2026 Studio Actions
            const studioResult = await GeminiService.runSpecializedTask(action, currentBook, currentChapter, prompt);
            
            if (action === AIActionType.STORYBOARD_SCENE) {
                if (studioResult.startsWith('data:image')) {
                     const win = window.open();
                     win?.document.write(`<img src="${studioResult}" style="max-width:100%"/>`);
                } else {
                    alert("Storyboard generation failed.");
                }
            } else {
                if(currentChapter) {
                    const noteBlock = `\n\n> **AI Studio Note (${action}):**\n> ${studioResult.replace(/\n/g, '\n> ')}\n`;
                    handleUpdateContent(currentChapter.content + noteBlock);
                }
            }
        }

    } catch (e) {
        console.error(e);
        alert("AI generation failed. Please check your API key or try again.");
    } finally {
        setIsGenerating(false);
    }
  };

  if (!currentBookId || !currentBook) {
    return (
      <div className="relative w-full h-full bg-orange-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
             <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
             <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
             <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-rose-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative z-10 h-full">
            <Dashboard 
                books={books} 
                onSelectBook={(b) => setCurrentBookId(b.id)} 
                onCreateBook={handleCreateOrImportBook}
                onDeleteBook={(id) => setBooks(prev => prev.filter(b => b.id !== id))}
                onOpenThinker={() => setShowThinker(true)}
                onOpenSubscriptions={() => setShowSubscriptions(true)}
            />
        </div>
        {showThinker && (
            <BookThinker 
                onCreateBook={(book) => {
                    handleCreateOrImportBook(book);
                    setShowThinker(false);
                }} 
                onClose={() => setShowThinker(false)} 
            />
        )}
        {showSubscriptions && (
            <SubscriptionPlans onClose={() => setShowSubscriptions(false)} />
        )}
      </div>
    );
  }

  const steps = [
      { id: 1, name: 'Concept', icon: LightbulbIcon },
      { id: 2, name: 'Outline', icon: ListIcon },
      { id: 3, name: 'Secure', icon: ShieldCheckIcon },
      { id: 4, name: 'Draft', icon: PenIcon },
      { id: 5, name: 'Publish', icon: CheckCircleIcon },
  ];

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-orange-50/50 relative ios-scroll">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
         <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-amber-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className={`glass-panel border-b border-brand-500/10 px-4 md:px-6 py-2 md:py-4 flex items-center justify-between shadow-sm z-20 transition-all duration-500 ${isFocusMode ? '-mt-24' : 'mt-0'}`}>
         <div className="flex items-center">
            <button onClick={() => setCurrentBookId(null)} className="mr-3 md:mr-6 p-2 text-slate-400 hover:text-brand-800 hover:bg-white/50 rounded-full transition-colors" title="Back to Dashboard">
                <ArrowLeftIcon className="w-5 h-5"/>
            </button>
            <div className="mr-4 md:mr-8 hidden sm:block">
                <h2 className="font-bold text-slate-800 truncate max-w-[150px]">{currentBook.title}</h2>
                <div className="text-[10px] text-brand-600 font-extrabold tracking-widest uppercase">DigitalConfvisions</div>
            </div>
         </div>

         <div className="flex items-center space-x-1 overflow-x-auto ios-scroll no-scrollbar py-1">
             {steps.map((step, idx) => (
                 <React.Fragment key={step.id}>
                    <button
                        onClick={() => handleStepChange(step.id as any)}
                        className={`relative flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                            currentBook.currentStep === step.id 
                                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' 
                                : 'text-slate-500 hover:bg-white/60'
                        }`}
                    >
                        <step.icon className={`w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2 ${currentBook.currentStep === step.id ? 'text-white' : 'text-slate-400'}`}/>
                        {step.name}
                    </button>
                    {idx < steps.length - 1 && (
                        <div className="w-3 md:w-6 h-px bg-slate-200 flex-shrink-0"></div>
                    )}
                 </React.Fragment>
             ))}
         </div>
      </div>

      <div className="flex-1 overflow-hidden relative z-10 w-full">
        {currentBook.currentStep === 1 && (
            <div className="h-full overflow-y-auto ios-scroll">
                <ConceptStep book={currentBook} onUpdate={updateBook} onNext={() => handleStepChange(2)} />
            </div>
        )}

        {currentBook.currentStep === 2 && (
            <div className="h-full w-full">
                <OutlineStep book={currentBook} onUpdate={updateBook} onNext={() => handleStepChange(3)} />
            </div>
        )}

        {currentBook.currentStep === 3 && (
             <div className="h-full w-full overflow-y-auto ios-scroll">
                <SecureStep book={currentBook} onNext={() => handleStepChange(4)} />
            </div>
        )}

        {currentBook.currentStep === 4 && (
            <div className="flex h-full relative">
                {(mobileSidebarOpen || mobileAIPanelOpen) && (
                    <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity" onClick={() => { setMobileSidebarOpen(false); setMobileAIPanelOpen(false); }}></div>
                )}
                <div className={`fixed md:relative inset-y-0 left-0 z-40 w-72 md:w-72 bg-white/95 md:bg-transparent shadow-2xl md:shadow-none transform transition-transform duration-300 ease-in-out ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${isFocusMode ? 'md:w-0 md:opacity-0 md:overflow-hidden' : 'md:opacity-100'}`}>
                    <Sidebar 
                        currentBook={currentBook}
                        currentChapterId={currentChapterId}
                        onSelectChapter={(id) => { setCurrentChapterId(id); setMobileSidebarOpen(false); }}
                        onAddChapter={handleAddChapter}
                        onDeleteChapter={handleDeleteChapter}
                        onUpdateChapter={handleUpdateChapter}
                        onBackToDashboard={() => setCurrentBookId(null)}
                        onReorderChapters={handleReorderChapters}
                        onGenerateSummary={handleGenerateSummary}
                        onTranslateChapter={handleTranslateChapter}
                        onUpdateBookLanguage={handleUpdateBookLanguage}
                        isGenerating={isGenerating}
                        onClose={() => setMobileSidebarOpen(false)}
                    />
                </div>
                <div className="flex-1 flex flex-col min-w-0 h-full w-full">
                    {!isFocusMode && (
                    <div className="md:hidden h-12 bg-white/60 border-b border-white/20 flex items-center justify-between px-4 backdrop-blur-md sticky top-0 z-20">
                        <button onClick={() => setMobileSidebarOpen(true)} className="p-2 -ml-2 text-slate-600"><MenuIcon className="w-6 h-6" /></button>
                        <span className="text-xs font-bold text-slate-500 uppercase">{currentChapter?.title || 'Drafting'}</span>
                        <button onClick={() => setMobileAIPanelOpen(true)} className="p-2 -mr-2 text-brand-600"><SparklesIcon className="w-6 h-6" /></button>
                    </div>
                    )}
                    <div className={`hidden md:flex h-10 border-b border-brand-500/20 items-center justify-between px-4 bg-white/30 backdrop-blur transition-all duration-500 ${isFocusMode ? 'h-0 opacity-0 overflow-hidden' : ''}`}>
                        <span className="text-xs text-brand-700 font-bold uppercase tracking-wider">{isGenerating ? 'AI writing in progress...' : `Ready to write (${currentBook.language})`}</span>
                        <button onClick={() => setShowAIPanel(!showAIPanel)} className="text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors">{showAIPanel ? 'Hide AI Panel' : 'Show AI Panel'}</button>
                    </div>
                    <div className="flex-1 flex overflow-hidden relative">
                        <Editor chapter={currentChapter} onUpdateContent={handleUpdateContent} onUpdateTitle={handleUpdateTitle} isFocusMode={isFocusMode} onToggleFocusMode={() => setIsFocusMode(!isFocusMode)} />
                        <div className={`fixed md:relative inset-y-0 right-0 z-40 w-80 md:w-80 bg-white/95 md:bg-transparent shadow-2xl md:shadow-none transform transition-transform duration-300 ease-in-out ${mobileAIPanelOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} ${isFocusMode || (!showAIPanel && !mobileAIPanelOpen) ? 'md:w-0 md:opacity-0 md:overflow-hidden' : 'md:opacity-100'}`}>
                            <AIPanel isGenerating={isGenerating} onGenerate={handleAIAction} onClose={() => setMobileAIPanelOpen(false)} />
                        </div>
                    </div>
                </div>
            </div>
        )}

        {currentBook.currentStep === 5 && (
            <div className="h-full overflow-y-auto ios-scroll">
                 <PublishStep book={currentBook} onBack={() => handleStepChange(4)} />
            </div>
        )}
      </div>
    </div>
  );
}

export default App;
