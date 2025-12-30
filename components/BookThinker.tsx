
import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/gemini';
import { Book } from '../types';
import { BrainIcon, SparklesIcon, XIcon, ArrowLeftIcon, RupeeIcon, BarChartIcon, KeyIcon, LightbulbIcon, UsersIcon, AlertTriangleIcon } from './Icons';

interface BookThinkerProps {
    onCreateBook: (book: Partial<Book>) => void;
    onClose: () => void;
}

type ThinkingMode = 'brainstorm' | 'market' | 'critic' | 'muse';

export const BookThinker: React.FC<BookThinkerProps> = ({ onCreateBook, onClose }) => {
    const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([
        { role: 'model', text: "Welcome to the Crore Club Lab. I am your Neural Architect. Let's design a book worth ₹1 Crore (10 Million). What is your core idea?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [detectedConcept, setDetectedConcept] = useState<{title: string, description: string} | null>(null);
    const [activeTab, setActiveTab] = useState<'profit' | 'secrets'>('profit');
    const [mode, setMode] = useState<ThinkingMode>('brainstorm');
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Profit Calculator State - Default to Crore Strategy
    const [price, setPrice] = useState(1999);
    
    // Curated Crore Club Secrets
    const salesSecrets = [
        "The High-Ticket Backend: The book is just a brochure. Use it to sell a ₹50,000 course or ₹2 Lakh consulting package.",
        "Corporate Bulk Buys: Don't sell 1 book. Sell 1000 copies to a Fortune 500 company for their employees.",
        "Foreign Rights Licensing: Translate your book into German, Japanese, and Spanish. Sell the rights for an advance.",
        "The 'Keynote' Flywheel: Use the book to book speaking gigs. One speech = ₹1 Lakh. Do 100 speeches.",
        "Create a 'Methodology': Don't just share tips. Trademark a system (e.g. 'The 4-Hour Workweek'). Sell the certification.",
        "The Movie/Series Option: Write cinematically. Shop the rights to Netflix/Prime India. Even an option deal pays well.",
        "The 'Challenge' Launch: Run a 5-Day Challenge based on your book content. Charge for VIP access. Sell the book as entry.",
        "Affiliate Army: Give influencers 50% commission on the backend course. They will promote the book for free.",
        "Audiobook Empire: Record it yourself. Upload to Audible. It pays royalties forever.",
        "Print-on-Demand Merch: If your characters/quotes are catchy, sell t-shirts and mugs via automated stores.",
        "The 'Legacy' Hardcover: Release a limited edition, gold-foiled, signed hardcover for ₹5,000. Superfans will buy it.",
        "Ghostwrite for CEOs: Use your AI skills to write books for CEOs. Charge ₹10 Lakh per project. Use this tool.",
        "Podcast Tour: Don't start a podcast. Be a guest on top 50 podcasts in your niche. Borrow their audience.",
        "The 'Free + Shipping' Funnel: Give the book for free, charge for shipping. Upsell an audiobook immediately.",
        "Library Distribution: Get your book into Overdrive/Libby. Libraries pay higher per unit.",
        "Update & Relaunch: Every 2 years, release an 'Updated & Expanded' edition to spike sales again.",
        "Bundle with Software: Partner with a SaaS company. Give your book to every new subscriber.",
        "University Curriculum: Get your non-fiction book adopted as a textbook. Guaranteed recurring sales.",
        "Collaborative Anthology: Co-author with 10 other experts. Everyone promotes to their list. 10x Reach.",
        "Own the Data: Never rely solely on Amazon. Capture emails inside the book. The money is in the list."
    ];

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMsg = { role: 'user' as const, text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const { response, extractedConcept } = await GeminiService.chatWithThinker(messages, input, mode);
            setMessages(prev => [...prev, { role: 'model', text: response }]);
            if (extractedConcept) {
                setDetectedConcept(extractedConcept);
            }
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: 'model', text: "Connection anomaly detected. Please retry transmission." }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleCreate = () => {
        if (detectedConcept) {
            onCreateBook({
                title: detectedConcept.title,
                description: detectedConcept.description,
                genre: 'Non-Fiction', // Default assumption
                tone: 'Engaging'
            });
            onClose();
        }
    };

    const modes: {id: ThinkingMode, label: string, icon: any, color: string, desc: string}[] = [
        { id: 'brainstorm', label: 'Architect', icon: BrainIcon, color: 'text-amber-400', desc: 'Empire Structure' },
        { id: 'market', label: 'Builder', icon: BarChartIcon, color: 'text-emerald-400', desc: 'Scale & Revenue' },
        { id: 'critic', label: 'Investor', icon: AlertTriangleIcon, color: 'text-red-400', desc: 'Risk Analysis' },
        { id: 'muse', label: 'Visionary', icon: SparklesIcon, color: 'text-fuchsia-400', desc: 'Global Impact' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex flex-col md:flex-row bg-slate-950 font-sans text-slate-100 overflow-hidden">
            {/* Ambient Background Effects - Gold/Amber for Crore Value */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-amber-900/20 rounded-full blur-[100px] animate-blob" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
            </div>

            {/* Header / Nav (Mobile) */}
            <div className="md:hidden bg-slate-900/50 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center z-20">
                <span className="font-bold flex items-center text-amber-500 tracking-wider">
                    <BrainIcon className="w-5 h-5 mr-2"/> CRORE CLUB LAB
                </span>
                <button onClick={onClose}><XIcon className="w-6 h-6 text-slate-400"/></button>
            </div>

            {/* Left: Chat Area (Deep Lab Interface) */}
            <div className="flex-1 flex flex-col h-full relative z-10 bg-gradient-to-br from-slate-900 via-slate-950 to-black">
                <div className="hidden md:flex absolute top-6 left-6 z-20">
                     <button 
                        onClick={onClose} 
                        className="group flex items-center px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 hover:border-amber-500/50 transition-all text-xs font-bold text-slate-400 hover:text-amber-300"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        EXIT LAB
                     </button>
                </div>

                {/* Mode Selector */}
                <div className="absolute top-20 md:top-6 right-6 md:right-1/2 md:translate-x-1/2 z-20 flex bg-black/40 backdrop-blur-xl p-1 rounded-full border border-amber-500/20 shadow-2xl">
                    {modes.map(m => (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center group ${
                                mode === m.id ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'text-slate-500 hover:text-slate-300'
                            }`}
                            title={m.desc}
                        >
                            <m.icon className={`w-3 h-3 mr-2 ${mode === m.id ? m.color : 'text-slate-600 group-hover:text-slate-400'}`} />
                            {m.label}
                            {mode === m.id && <span className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${m.color.replace('text', 'bg')}`}></span>}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-12 pt-24 space-y-6 pb-32 scroll-smooth">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                            <div className={`relative max-w-[85%] md:max-w-[70%] p-4 md:p-6 rounded-2xl text-sm md:text-base backdrop-blur-md border ${
                                m.role === 'user' 
                                    ? 'bg-amber-600/10 border-amber-500/30 text-amber-50 rounded-br-none shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                                    : 'bg-white/5 border-white/10 text-slate-200 rounded-bl-none shadow-lg'
                            }`}>
                                <div className="absolute -top-3 left-0 text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {m.role === 'user' ? 'USER_INPUT' : 'SYS_RESPONSE'}
                                </div>
                                <span className="leading-relaxed">{m.text}</span>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                             <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-bl-none text-amber-400 text-xs font-mono flex items-center shadow-lg">
                                <SparklesIcon className="w-3 h-3 mr-2 animate-spin"/> GENERATING STRATEGY...
                             </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div className="p-6 bg-gradient-to-t from-black to-transparent">
                    <div className="max-w-3xl mx-auto relative group">
                        <div className={`absolute -inset-0.5 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 ${
                            mode === 'brainstorm' ? 'bg-amber-600' :
                            mode === 'market' ? 'bg-emerald-600' :
                            mode === 'critic' ? 'bg-red-600' : 'bg-fuchsia-600'
                        }`}></div>
                        <div className="relative flex space-x-2 bg-slate-900 rounded-2xl border border-white/10 p-2">
                            <input 
                                className="flex-1 bg-transparent border-none text-slate-200 p-3 focus:outline-none placeholder-slate-600"
                                placeholder={`Command the ${modes.find(m => m.id === mode)?.label || 'AI'}...`}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                autoFocus
                            />
                            <button 
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className={`px-6 rounded-xl font-bold text-slate-900 transition-all shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 disabled:shadow-none ${
                                    mode === 'brainstorm' ? 'bg-amber-400 hover:bg-amber-300' :
                                    mode === 'market' ? 'bg-emerald-400 hover:bg-emerald-300' :
                                    mode === 'critic' ? 'bg-red-400 hover:bg-red-300' : 'bg-fuchsia-400 hover:bg-fuchsia-300'
                                }`}
                            >
                                TRANSMIT
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Profit & Secrets Panel (Futuristic Data HUD) */}
            <div className="w-full md:w-[450px] bg-black/90 backdrop-blur-xl border-l border-white/10 flex flex-col shadow-2xl z-20">
                {/* Tabs */}
                <div className="flex border-b border-white/10">
                    <button 
                        onClick={() => setActiveTab('profit')}
                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'profit' ? 'text-emerald-400 bg-white/5 border-b-2 border-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Empire Calculator
                    </button>
                    <button 
                        onClick={() => setActiveTab('secrets')}
                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center transition-all ${activeTab === 'secrets' ? 'text-amber-400 bg-white/5 border-b-2 border-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <KeyIcon className="w-3 h-3 mr-2" /> 1 Crore Codes
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 ios-scroll">
                    {activeTab === 'profit' && (
                        <>
                            <div className="mb-10 relative">
                                <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-4 flex items-center">
                                    <SparklesIcon className="w-4 h-4 mr-2" /> Live Asset Extraction
                                </h3>
                                
                                {detectedConcept ? (
                                    <div className="bg-slate-900/50 border border-amber-500/30 rounded-2xl p-5 space-y-4 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors"></div>
                                        <div className="relative">
                                            <div className="text-[10px] font-mono text-amber-400 mb-1">ASSET_CODENAME</div>
                                            <p className="font-bold text-lg text-white font-serif">{detectedConcept.title}</p>
                                        </div>
                                        <div className="relative">
                                            <div className="text-[10px] font-mono text-amber-400 mb-1">VALUE_PROPOSITION</div>
                                            <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-amber-500/50 pl-3">{detectedConcept.description}</p>
                                        </div>
                                        <button 
                                            onClick={handleCreate}
                                            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-900/50 hover:from-amber-500 hover:to-amber-400 hover:scale-[1.02] transition-all relative z-10"
                                        >
                                            Initialize Asset
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center p-8 border border-dashed border-slate-800 rounded-2xl text-slate-600 text-xs font-mono">
                                        AWAITING INTEL...<br/>
                                        <span className="opacity-50 text-[10px]">Chat to extract concept</span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-white/10 pt-8">
                                <h3 className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-6 flex items-center">
                                    <RupeeIcon className="w-4 h-4 mr-2" /> Revenue Projection
                                </h3>
                                
                                <div className="space-y-8">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-xs font-mono text-slate-400">UNIT VALUE (INR)</label>
                                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">CRORE STRATEGY</span>
                                        </div>
                                        <div className="flex items-center bg-slate-800 rounded-xl p-2 border border-slate-700">
                                            <span className="text-xl font-bold text-emerald-400 w-24 pl-3">₹{price}</span>
                                            <input 
                                                type="range" 
                                                min="499" 
                                                max="20000" 
                                                step="100"
                                                value={price}
                                                onChange={(e) => setPrice(Number(e.target.value))}
                                                className="flex-1 mr-3 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                            />
                                        </div>
                                        <div className="text-[10px] text-slate-500 mt-1">
                                            Set higher for Consulting/Courses backend.
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {[
                                            { count: 1000, label: 'Launch' },
                                            { count: 5000, label: 'National Bestseller' },
                                            { count: 50000, label: 'Global Phenomenon' }
                                        ].map((tier, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-colors">
                                                <div>
                                                    <div className="text-sm font-bold text-slate-300">{tier.count.toLocaleString()} Units</div>
                                                    <div className="text-[10px] text-slate-600 font-mono uppercase">{tier.label}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-emerald-400 font-mono text-lg">₹{(tier.count * price).toLocaleString()}</div>
                                                    {tier.count * price >= 10000000 && <span className="text-[9px] text-amber-500 font-bold">CRORE+ UNLOCKED</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="bg-emerald-950/40 p-4 rounded-xl text-xs text-emerald-200/80 leading-relaxed border border-emerald-500/20 font-mono">
                                        <span className="text-amber-400 font-bold">1 CRORE BLUEPRINT:</span> To generate <span className="text-white">₹1 Crore</span>, you need <span className="text-white font-bold">{Math.ceil(10000000/price).toLocaleString()}</span> units sold.
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'secrets' && (
                        <div className="space-y-6 animate-fade-in">
                            <h3 className="text-xl font-bold text-amber-500 mb-2">The Crore Club Codes</h3>
                            <p className="text-xs text-slate-400 mb-6 font-mono">
                                TOP SECRET LEVERAGE TACTICS.
                            </p>
                            <div className="space-y-4">
                                {salesSecrets.map((secret, idx) => (
                                    <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-xl text-sm text-slate-300 hover:bg-white/10 hover:border-amber-500/30 transition-all group">
                                        <span className="font-mono text-xs text-amber-500 mr-2 opacity-50 group-hover:opacity-100">0{idx + 1} //</span>
                                        {secret}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
