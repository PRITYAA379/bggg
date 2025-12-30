
import React, { useState } from 'react';
import { Book } from '../types';
import { BookIcon, PlusIcon, TrashIcon, BrainIcon, CrownIcon, KeyIcon, ArrowLeftIcon, CheckCircleIcon, LibraryIcon, HistoryIcon, SparklesIcon, XIcon } from './Icons';

interface DashboardProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onCreateBook: (book: Partial<Book>) => void;
  onDeleteBook: (id: string) => void;
  onOpenThinker: () => void;
  onOpenSubscriptions: () => void;
}

const ElectricCard: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string }> = ({ onClick, children, className }) => (
    <div className={`electric-card-root relative group cursor-pointer ${className}`} onClick={onClick}>
        <style dangerouslySetInnerHTML={{ __html: `
            .electric-card-root {
                --electric-border-color: #dd8448;
                --electric-light-color: #ffccaa;
                --gradient-color: rgba(221, 132, 72, 0.4);
                --color-neutral-900: #1a1a1a;
            }
            .ec-card-container {
                position: relative;
                border-radius: 24px;
                background: linear-gradient(-30deg, var(--gradient-color), transparent, var(--gradient-color)),
                            linear-gradient(to bottom, var(--color-neutral-900), var(--color-neutral-900));
                padding: 2px;
                height: 100%;
                transition: transform 0.3s ease;
            }
            .electric-card-root:hover .ec-card-container { transform: scale(1.02); }
            .ec-border-outer {
                border: 2px solid rgba(221, 132, 72, 0.5);
                border-radius: 24px;
                padding-right: 4px;
                padding-bottom: 4px;
                position: relative;
                height: 100%;
            }
            .ec-main-card {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                border-radius: 24px;
                border: 2px solid var(--electric-border-color);
                margin-top: -4px;
                margin-left: -4px;
                filter: url(#turbulent-displace);
                pointer-events: none;
                z-index: 0;
            }
            .ec-content {
                position: relative;
                z-index: 10;
                height: 100%;
                border-radius: 22px;
                overflow: hidden;
            }
        `}} />
        <div className="ec-card-container">
            <div className="ec-border-outer">
                 <div className="ec-main-card" />
                 <div className="ec-content">{children}</div>
            </div>
        </div>
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ 
    books, 
    onSelectBook, 
    onCreateBook, 
    onDeleteBook, 
    onOpenThinker,
    onOpenSubscriptions
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [secretKeyInput, setSecretKeyInput] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importedBookPreview, setImportedBookPreview] = useState<Book | null>(null);
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: '',
    author: '',
    genre: '',
    description: '',
    tone: 'Neutral',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBook.title) {
      onCreateBook(newBook);
      setIsModalOpen(false);
      setNewBook({ title: '', author: '', genre: '', description: '', tone: 'Neutral' });
    }
  };

  const handleDecodeKey = (e: React.FormEvent) => {
      e.preventDefault();
      setImportError(null);
      
      // Clean the input: Remove ALL whitespace, newlines, and potential non-base64 noise
      const cleanString = secretKeyInput.trim().replace(/\s/g, '');
      
      if (!cleanString) {
          setImportError("Please paste your archive code first.");
          return;
      }

      // Check if it's the short "Manuscript ID" by length and pattern
      if (cleanString.length < 100 && (cleanString.includes('-') || cleanString.length < 50)) {
          setImportError("You pasted the 'Manuscript ID'. This is just a label. You must use the MUCH LONGER 'Digital Archive Code' found in the Secure step to recover your data.");
          return;
      }
      
      try {
          // Standard base64 decoding with UTF-8 support
          const json = decodeURIComponent(escape(atob(cleanString)));
          const book = JSON.parse(json);
          
          if (!book.title || !book.chapters) {
              throw new Error("Invalid manuscript structure");
          }
          setImportedBookPreview(book);
      } catch (err) {
          console.error("Import error:", err);
          setImportError("Decoding failed. The code may be incomplete or corrupted. Ensure you copied the ENTIRE block of characters starting from the Secure step.");
      }
  };

  const confirmImport = () => {
      if (importedBookPreview) {
          const importedBook = { ...importedBookPreview, id: crypto.randomUUID(), title: `${importedBookPreview.title} (Imported)` };
          onCreateBook(importedBook);
          setIsImportModalOpen(false);
          setImportedBookPreview(null);
          setSecretKeyInput('');
          setImportError(null);
      }
  };

  return (
    <div className="h-full bg-slate-50 overflow-y-auto flex flex-col ios-scroll">
      <div className="bg-white border-b border-slate-200 py-4 px-4 md:py-6 md:px-8 flex justify-between items-center shadow-sm sticky top-0 z-10">
         <div className="flex items-center space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-600 rounded-lg flex items-center justify-center text-white">
                <BookIcon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-800 leading-tight">DigitalConfvisions</h1>
                <p className="text-[10px] md:text-xs text-slate-500 font-semibold tracking-wider uppercase">AI Writer Suite</p>
            </div>
         </div>
         <div className="flex items-center space-x-2 md:space-x-4">
             <button onClick={() => setIsImportModalOpen(true)} className="flex items-center px-3 py-2 bg-white border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors text-sm shadow-sm">
                 <KeyIcon className="w-4 h-4 md:mr-2" />
                 <span className="hidden md:inline">Import Project</span>
             </button>
             <button onClick={() => setIsModalOpen(true)} className="flex items-center px-3 py-2 md:px-5 md:py-2.5 bg-brand-600 text-white font-medium rounded-full hover:bg-brand-700 shadow-md transition-all transform hover:scale-105 text-sm">
                <PlusIcon className="w-4 h-4 md:w-5 md:h-5 md:mr-2" />
                <span className="hidden md:inline">Start New Book</span>
            </button>
         </div>
      </div>

      <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ElectricCard onClick={onOpenThinker} className="h-full md:min-h-[220px]">
                <div className="p-6 md:p-8 h-full flex flex-col relative z-10 text-white">
                    <div className="flex items-center mb-3">
                         <div className="bg-amber-500/20 p-2 rounded-lg border border-amber-500/50 mr-3">
                            <BrainIcon className="w-6 h-6 text-amber-400" />
                         </div>
                         <h2 className="text-2xl font-bold text-amber-400 tracking-wide">AI Book Thinker</h2>
                    </div>
                    <p className="text-slate-300 mb-6 text-sm md:text-base max-w-sm flex-1 leading-relaxed">Brainstorm high-value concepts and identify 1-Crore market opportunities.</p>
                </div>
            </ElectricCard>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Active Library</h2>
                <p className="text-slate-500 text-sm mb-4">{books.length} Professional Manuscripts</p>
            </div>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200 px-4">
             <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Your Writing Journey Begins Here</h3>
             <button onClick={() => setIsModalOpen(true)} className="mt-6 px-6 py-3 bg-brand-600 text-white rounded-lg font-bold shadow-lg">Start First Book</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div key={book.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-all cursor-pointer group flex flex-col h-64" onClick={() => onSelectBook(book)}>
                <div className="flex justify-between items-start mb-4">
                  <BookIcon className="w-8 h-8 text-brand-500" />
                  <button onClick={(e) => {e.stopPropagation(); if(confirm('Delete?')) onDeleteBook(book.id);}} className="text-slate-400 hover:text-red-500"><TrashIcon className="w-4 h-4"/></button>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1 truncate">{book.title}</h3>
                <p className="text-xs text-slate-500 mb-4">{book.author}</p>
                <p className="text-sm text-slate-600 line-clamp-3 flex-1">{book.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">New Manuscript</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input required autoFocus placeholder="Manuscript Title" className="w-full p-3 border border-slate-300 rounded-lg" value={newBook.title} onChange={(e) => setNewBook({...newBook, title: e.target.value})} />
                <div className="flex space-x-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 rounded-lg">Cancel</button>
                    <button type="submit" className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-lg shadow-lg">Create</button>
                </div>
            </form>
          </div>
        </div>
      )}

      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 flex flex-col max-h-[90vh]">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800">Import Manuscript</h2>
                <button onClick={() => { setIsImportModalOpen(false); setImportError(null); setImportedBookPreview(null); }} className="p-1 hover:bg-slate-100 rounded-full"><XIcon className="w-5 h-5 text-slate-400" /></button>
             </div>
             {!importedBookPreview ? (
                <form onSubmit={handleDecodeKey} className="flex flex-col flex-1">
                    <p className="text-sm text-slate-500 mb-4">Paste the long <strong>Digital Archive Code</strong> from your previous session to recover your work.</p>
                    <textarea 
                        required 
                        className={`flex-1 min-h-[200px] p-4 bg-slate-50 border rounded-lg font-mono text-xs focus:outline-none transition-colors ${importError ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-brand-500'}`} 
                        placeholder="Paste long archive code here..." 
                        value={secretKeyInput} 
                        onChange={(e) => { setSecretKeyInput(e.target.value); setImportError(null); }} 
                    />
                    {importError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start">
                            <div className="bg-red-500 rounded-full p-1 mr-3 flex-shrink-0 mt-0.5"><XIcon className="w-3 h-3 text-white" /></div>
                            <p className="text-xs text-red-700 font-medium leading-relaxed">{importError}</p>
                        </div>
                    )}
                    <div className="flex justify-end space-x-3 mt-6">
                        <button type="button" onClick={() => { setIsImportModalOpen(false); setImportError(null); }} className="px-4 py-2 bg-slate-100 rounded-lg">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-brand-600 text-white font-bold rounded-lg shadow-lg hover:bg-brand-700 transition-colors">Verify & Extract</button>
                    </div>
                </form>
             ) : (
                <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="bg-green-50 p-6 rounded-xl mb-6 border border-green-100">
                        <div className="flex items-center mb-2">
                            <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                            <span className="text-green-700 font-bold uppercase tracking-widest text-[10px]">Manuscript Detected</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-xl">{importedBookPreview.title}</h3>
                        <p className="text-sm text-slate-600">by {importedBookPreview.author}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto mb-6 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="p-3 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chapters included:</div>
                        {importedBookPreview.chapters.map((c, i) => (
                            <div key={i} className="p-3 border-b border-slate-100 text-sm text-slate-700 flex justify-between">
                                <span className="font-medium">{i+1}. {c.title}</span>
                                <span className="text-[10px] text-slate-400">~{Math.ceil((c.content?.length || 0) / 6)} words</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button onClick={() => setImportedBookPreview(null)} className="px-4 py-2 bg-slate-100 rounded-lg">Back</button>
                        <button onClick={confirmImport} className="px-6 py-2 bg-brand-600 text-white font-bold rounded-lg shadow-lg hover:bg-brand-700 transition-colors">Complete Import</button>
                    </div>
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};
