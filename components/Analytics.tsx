
import React, { useMemo } from 'react';
import { Chapter } from '../types';

interface AnalyticsProps {
    chapter: Chapter | null;
}

export const Analytics: React.FC<AnalyticsProps> = ({ chapter }) => {
    const stats = useMemo(() => {
        if (!chapter || !chapter.content) return { 
            words: 0, 
            chars: 0, 
            readTime: 0, 
            sentiment: 'Neutral', 
            complexity: 'Low' 
        };

        const text = chapter.content;
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        const chars = text.length;
        const readTime = Math.ceil(words / 200); // 200 words per minute average
        
        // Very basic sentiment heuristic for demo purposes
        const positiveWords = ['happy', 'joy', 'great', 'love', 'success', 'bright', 'win', 'good', 'beautiful'];
        const negativeWords = ['sad', 'pain', 'loss', 'fail', 'dark', 'fear', 'bad', 'ugly', 'anger'];
        
        let score = 0;
        const lowerText = text.toLowerCase();
        positiveWords.forEach(w => { if(lowerText.includes(w)) score++; });
        negativeWords.forEach(w => { if(lowerText.includes(w)) score--; });
        
        let sentiment = 'Neutral';
        if (score > 2) sentiment = 'Positive';
        if (score < -2) sentiment = 'Negative';

        // Complexity heuristic (avg word length)
        const avgWordLen = chars / (words || 1);
        let complexity = 'Simple';
        if (avgWordLen > 5) complexity = 'Moderate';
        if (avgWordLen > 6.5) complexity = 'Complex';

        return { words, chars, readTime, sentiment, complexity };
    }, [chapter?.content]);

    return (
        <div className="absolute top-20 right-8 w-64 glass-card rounded-xl p-4 animate-fade-in z-20">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 border-b border-slate-200 pb-2">
                Chapter Intelligence
            </h4>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Reading Time</span>
                    <span className="text-sm font-bold text-slate-800">{stats.readTime} min</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Sentiment</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        stats.sentiment === 'Positive' ? 'bg-green-100 text-green-700' :
                        stats.sentiment === 'Negative' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                        {stats.sentiment}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Complexity</span>
                    <span className="text-sm font-bold text-slate-800">{stats.complexity}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-center">
                    <div>
                        <div className="text-lg font-bold text-brand-600">{stats.words}</div>
                        <div className="text-[10px] text-slate-400 uppercase">Words</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-brand-600">{stats.chars}</div>
                        <div className="text-[10px] text-slate-400 uppercase">Chars</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
