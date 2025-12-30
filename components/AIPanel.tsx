
import React, { useState, useEffect } from 'react';
import { GenerationConfig, AIActionType } from '../types';
import { 
    SparklesIcon, WandIcon, PenIcon, UsersIcon, MapIcon, FilmIcon, 
    AlertTriangleIcon, BarChartIcon, HeartIcon, EyeIcon, MusicIcon, 
    GlobeIcon, XIcon, WindIcon, CpuIcon, ActivityIcon, PlusIcon, TrashIcon
} from './Icons';

interface AIPanelProps {
  isGenerating: boolean;
  onGenerate: (action: AIActionType, params: any) => void;
  onClose?: () => void;
}

interface ToneMix {
    name: string;
    value: number;
}

export const AIPanel: React.FC<AIPanelProps> = ({ isGenerating, onGenerate, onClose }) => {
  const [activeTab, setActiveTab] = useState<'write' | 'refine' | 'studio'>('write');
  
  // Tone Mixer State
  const [toneMix, setToneMix] = useState<ToneMix[]>([{ name: 'Engaging', value: 100 }]);
  const [customPrompt, setCustomPrompt] = useState('');
  
  const [config, setConfig] = useState<GenerationConfig>({
    tone: '100% Engaging',
    perspective: 'third_person_limited',
    creativity: 0.7,
  });

  // Update main config whenever mixer changes
  useEffect(() => {
      const toneString = toneMix.map(t => `${t.value}% ${t.name}`).join(', ');
      setConfig(prev => ({ ...prev, tone: toneString }));
  }, [toneMix]);

  const handleAction = (type: AIActionType) => {
    onGenerate(type, { config, prompt: customPrompt });
  };

  const availableTones = [
      'Engaging', 'Dramatic', 'Humorous', 'Standup Comedy', 
      'Dark', 'Romantic', 'Technical', 'Fast-Paced', 
      'Philosophical', 'Minimalist', 'Poetic'
  ];

  const addTone = (toneName: string) => {
      if (toneMix.find(t => t.name === toneName)) return;
      // When adding a new tone, try to distribute equally initially or just add at 50%
      setToneMix(prev => [...prev, { name: toneName, value: 50 }]);
  };

  const removeTone = (toneName: string) => {
      if (toneMix.length <= 1) return; // Prevent empty state
      setToneMix(prev => prev.filter(t => t.name !== toneName));
  };

  const updateToneValue = (toneName: string, newValue: number) => {
      setToneMix(prev => prev.map(t => t.name === toneName ? { ...t, value: newValue } : t));
  };

  const refineOptions = [
    "Make it more engaging",
    "Improve flow & clarity",
    "Fix grammar & spelling",
    "Show, don't tell",
    "Simplify language"
  ];

  const tools2026 = [
      { id: 'world', title: 'World Architecture', icon: MapIcon, items: [
          { label: 'Character Forge', action: AIActionType.CHARACTER_PROFILE, icon: UsersIcon, hint: 'Name or Role' },
          { label: 'World Builder Wiki', action: AIActionType.WORLD_LORE, icon: MapIcon, hint: 'Location/Concept' },
          { label: 'Storyboarder', action: AIActionType.STORYBOARD_SCENE, icon: FilmIcon, hint: 'Scene Description' },
          { label: 'Theme Weaver', action: AIActionType.THEME_WEAVER, icon: SparklesIcon, hint: 'Theme (e.g. Redemption)' },
      ]},
      { id: 'structure', title: 'Deep Structure', icon: BarChartIcon, items: [
          { label: 'Plot Hole Check', action: AIActionType.PLOT_HOLE_CHECK, icon: AlertTriangleIcon, hint: 'Analyzes context' },
          { label: 'Pacing Heatmap', action: AIActionType.PACING_HEATMAP, icon: BarChartIcon, hint: 'Analyzes tension' },
          { label: 'Readability Analyzer', action: AIActionType.READABILITY_ANALYZER, icon: WindIcon, hint: 'Grade Level & Fixes' },
          { label: 'Cliffhanger Gen', action: AIActionType.CLIFFHANGER_GEN, icon: WandIcon, hint: 'Suggests endings' },
      ]},
      { id: 'style', title: 'Stylistic Alchemy', icon: PenIcon, items: [
          { label: 'Sensory Enhancer', action: AIActionType.SENSORY_ENHANCER, icon: EyeIcon, hint: 'Text to enhance' },
          { label: 'Dialogue Doctor', action: AIActionType.DIALOGUE_DOCTOR, icon: UsersIcon, hint: 'Analyzes voices' },
          { label: 'Show Don\'t Tell', action: AIActionType.SHOW_DONT_TELL, icon: EyeIcon, hint: 'Text to fix' },
          { label: 'Voice Switcher', action: AIActionType.VOICE_SWITCHER, icon: UsersIcon, hint: 'Target Perspective' },
      ]},
      { id: 'market', title: 'Market & Audio', icon: GlobeIcon, items: [
          { label: 'Beta Reader Sim', action: AIActionType.BETA_READER_SIM, icon: HeartIcon, hint: 'Target Demographic' },
          { label: 'Audio Drama Script', action: AIActionType.AUDIO_DRAMA_SCRIPT, icon: MusicIcon, hint: 'Converts scene' },
          { label: 'Translator Preview', action: AIActionType.TRANSLATION_PREVIEW, icon: GlobeIcon, hint: 'Language' },
          { label: 'Marketing Blurb', action: AIActionType.MARKETING_BLURB, icon: SparklesIcon, hint: 'Platform' },
      ]}
  ];

  return (
    <div className="w-full h-full bg-stone-900 flex flex-col z-10 text-amber-50 shadow-[0_0_30px_rgba(221,132,72,0.1)] relative overflow-hidden electric-flow-border md:rounded-l-none">
      
      {/* Background Tech Effects - Brown/Amber Theme */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
          <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
          <div className="w-full h-full bg-[linear-gradient(rgba(221,132,72,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(221,132,72,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Futuristic Header */}
      <div className="p-4 border-b border-amber-500/20 bg-stone-900/80 backdrop-blur-md flex justify-between items-center relative z-20">
        <div className="flex items-center space-x-2">
            <CpuIcon className="w-5 h-5 text-amber-400 animate-pulse" />
            <div>
                <h3 className="text-xs font-bold text-amber-400 tracking-[0.2em] uppercase leading-none">NEURAL COPILOT</h3>
                <span className="text-[9px] text-amber-700 font-mono">SYS_ONLINE_V4.2</span>
            </div>
        </div>
        
        {isGenerating && (
            <div className="flex items-center bg-amber-950/40 px-2 py-1 rounded border border-amber-500/30">
                <ActivityIcon className="w-3 h-3 text-amber-400 mr-2 animate-bounce" />
                <span className="text-[9px] text-amber-300 font-mono animate-pulse">PROCESSING...</span>
            </div>
        )}

        {onClose && (
            <button onClick={onClose} className="md:hidden p-1 rounded-full bg-stone-800 text-stone-400 hover:text-white">
                <XIcon className="w-5 h-5" />
            </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 ios-scroll pb-safe relative z-10 scrollbar-thin scrollbar-thumb-amber-900 scrollbar-track-stone-900">
        
        {/* Settings - Cyber Style */}
        {activeTab !== 'studio' && (
        <div className="space-y-4">
          <div className="bg-stone-800/50 p-3 rounded-lg border border-white/5 relative group">
            <div className="absolute -left-px top-2 bottom-2 w-0.5 bg-amber-600/50"></div>
            <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-mono text-amber-600 uppercase tracking-wide">Cognitive Tone Mixer</label>
                <div className="relative group/add">
                    <button className="text-[10px] text-amber-400 hover:text-white flex items-center bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                        <PlusIcon className="w-3 h-3 mr-1" /> Add Tone
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-32 bg-stone-900 border border-stone-700 rounded shadow-xl hidden group-hover/add:block z-50">
                        {availableTones.map(t => (
                            <button 
                                key={t} 
                                onClick={() => addTone(t)}
                                className="block w-full text-left px-3 py-2 text-[10px] text-stone-300 hover:bg-amber-900/50 hover:text-amber-400"
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="space-y-3">
                {toneMix.map((t, idx) => (
                    <div key={t.name} className="animate-fade-in">
                        <div className="flex justify-between text-[10px] text-stone-400 mb-1 font-mono">
                            <span>{t.name}</span>
                            <div className="flex items-center space-x-2">
                                <span className={t.value > 50 ? 'text-amber-400 font-bold' : ''}>{t.value}%</span>
                                {toneMix.length > 1 && (
                                    <button onClick={() => removeTone(t.name)} className="text-stone-600 hover:text-red-400">
                                        <XIcon className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <input 
                            type="range"
                            min="0"
                            max="100"
                            value={t.value}
                            onChange={(e) => updateToneValue(t.name, parseInt(e.target.value))}
                            className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                    </div>
                ))}
            </div>
          </div>
        </div>
        )}

        {/* Tabs - Holo Toggle */}
        <div className="flex bg-stone-800/80 p-1 rounded-lg border border-white/5 relative">
          <button
            onClick={() => setActiveTab('write')}
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${
              activeTab === 'write' ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'text-stone-500 hover:text-amber-400'
            }`}
          >
            Draft
          </button>
          <button
            onClick={() => setActiveTab('refine')}
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${
              activeTab === 'refine' ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'text-stone-500 hover:text-amber-400'
            }`}
          >
            Refine
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${
              activeTab === 'studio' ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' : 'text-stone-500 hover:text-orange-400'
            }`}
          >
            Studio '26
          </button>
        </div>

        {activeTab === 'write' && (
          <div className="space-y-4 animate-fade-in">
            {/* Custom Instructions Input */}
            <div>
                <label className="block text-[10px] font-mono text-amber-600 mb-2 uppercase tracking-wide">
                    Core Directive
                </label>
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <textarea
                        className="relative w-full text-sm p-3 border border-white/10 rounded-lg focus:border-amber-500/50 min-h-[80px] placeholder:text-stone-600 bg-stone-900 text-amber-50 focus:outline-none transition-all font-sans"
                        placeholder="Input parameters (scene, mood, plot)..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
                <button
                    disabled={isGenerating}
                    onClick={() => handleAction(AIActionType.WRITE_WHOLE_CHAPTER)}
                    className="w-full relative overflow-hidden group flex items-center justify-center p-4 bg-stone-800 rounded-xl border border-amber-500/30 hover:border-amber-400/80 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-amber-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <SparklesIcon className="w-5 h-5 mr-3 text-amber-400 group-hover:animate-spin" />
                    <span className="text-xs font-bold text-amber-100 uppercase tracking-widest relative z-10">Generate Full Chapter</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    disabled={isGenerating}
                    onClick={() => handleAction(AIActionType.WRITE_CHAPTER)}
                    className="w-full flex items-center justify-center p-3 bg-stone-800 border border-stone-700 text-stone-300 rounded-xl hover:bg-stone-700 hover:text-white disabled:opacity-50 transition-colors text-[10px] font-bold uppercase tracking-wider hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                  >
                    <PenIcon className="w-3 h-3 mr-2"/> Paragraph
                  </button>
                  <button
                    disabled={isGenerating}
                    onClick={() => handleAction(AIActionType.CONTINUE_WRITING)}
                    className="w-full flex items-center justify-center p-3 bg-stone-800 border border-stone-700 text-stone-300 rounded-xl hover:bg-stone-700 hover:text-white disabled:opacity-50 transition-colors text-[10px] font-bold uppercase tracking-wider hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                  >
                     <WandIcon className="w-3 h-3 mr-2"/> Continue
                  </button>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'refine' && (
          <div className="space-y-4 animate-fade-in">
             <div className="bg-stone-800/50 p-3 rounded border border-white/5 text-[10px] text-amber-400/70 font-mono">
                > SELECT TEXT SEGMENT IN EDITOR TO INITIALIZE REFINEMENT PROTOCOLS.
            </div>
            
            <div className="flex flex-wrap gap-2">
              {refineOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setCustomPrompt(opt)}
                  className="px-2.5 py-2 text-[10px] bg-stone-800 text-stone-400 rounded border border-stone-700 hover:bg-amber-900/40 hover:text-amber-300 hover:border-amber-500/40 transition-all font-mono uppercase truncate max-w-full"
                >
                  {opt}
                </button>
              ))}
            </div>

            <textarea
              className="w-full text-sm p-3 border border-white/10 rounded-lg focus:border-amber-500/50 min-h-[100px] bg-stone-900 text-amber-50 focus:outline-none transition-all font-sans placeholder:text-stone-600"
              placeholder="Input custom refinement parameters..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            />
            
            <div className="space-y-2">
                <button
                    disabled={isGenerating}
                    onClick={() => handleAction(AIActionType.REWRITE_SELECTION)}
                    className="w-full flex items-center justify-center p-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 transition-all text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-95 border border-white/10"
                >
                    {isGenerating ? 'PROCESSING...' : <><SparklesIcon className="w-4 h-4 mr-2"/> Refine Selection</>}
                </button>
                
                <button
                    disabled={isGenerating}
                    onClick={() => {
                        if(confirm("Rewrite entire chapter contents?")) {
                            handleAction(AIActionType.REWRITE_CHAPTER);
                        }
                    }}
                    className="w-full flex items-center justify-center p-3 bg-stone-800 border border-stone-600 text-stone-300 rounded-xl hover:bg-stone-700 hover:text-white disabled:opacity-50 transition-colors text-xs font-bold uppercase tracking-wider active:scale-95"
                >
                    <WandIcon className="w-4 h-4 mr-2"/> Refine Whole Chapter
                </button>
            </div>
          </div>
        )}
        
        {activeTab === 'studio' && (
            <div className="space-y-6 animate-fade-in">
                <div className="bg-orange-900/20 p-4 rounded-xl border border-orange-500/30 relative">
                    <div className="absolute top-0 right-0 p-1">
                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                    </div>
                    <label className="text-[10px] font-mono text-orange-400 uppercase mb-2 block">Data Input Stream</label>
                    <input 
                        className="w-full bg-transparent border-b border-orange-500/50 text-xs text-orange-100 focus:outline-none focus:border-orange-400 pb-2 placeholder-orange-400/30"
                        placeholder="Entity / Location / Concept..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                    />
                </div>

                {tools2026.map(group => (
                    <div key={group.id} className="space-y-3">
                        <h4 className="flex items-center text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] border-b border-white/5 pb-1">
                            <group.icon className="w-3 h-3 mr-2" /> {group.title}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {group.items.map(item => (
                                <button
                                    key={item.label}
                                    disabled={isGenerating}
                                    onClick={() => handleAction(item.action)}
                                    title={item.hint}
                                    className="relative overflow-hidden flex flex-col items-center justify-center p-3 bg-stone-800/50 hover:bg-stone-700/80 border border-white/5 hover:border-amber-500/30 rounded-lg transition-all group active:scale-95"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:to-amber-500/10 transition-all duration-500"></div>
                                    <item.icon className="w-4 h-4 mb-2 text-stone-500 group-hover:text-amber-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-[9px] font-bold text-stone-400 group-hover:text-amber-100 text-center leading-tight uppercase tracking-wide relative z-10">
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )}

      </div>
      
      {/* System Footer */}
      <div className="p-2 border-t border-white/5 bg-black/40 text-[9px] font-mono text-stone-600 flex justify-between uppercase">
        <span>MEM: OK</span>
        <span>LATENCY: 12ms</span>
        <span className="text-amber-800">SECURE_CONN</span>
      </div>
    </div>
  );
};
