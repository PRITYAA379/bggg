
import React from 'react';
import { CheckCircleIcon, XIcon, CrownIcon } from './Icons';

interface SubscriptionPlansProps {
    onClose: () => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors z-10"
                >
                    <XIcon className="w-5 h-5 text-slate-500" />
                </button>

                <div className="p-8 md:p-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Unlock Professional Publishing</h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-12">
                        Choose a plan to supercharge your writing with advanced AI models, unlimited cloud storage, and premium export options.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {/* Starter Plan */}
                        <div className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow bg-white flex flex-col">
                            <h3 className="text-lg font-bold text-slate-700 mb-2">Starter Author</h3>
                            <div className="text-3xl font-bold text-slate-900 mb-6">Free</div>
                            <ul className="space-y-3 mb-8 flex-1">
                                <li className="flex items-center text-sm text-slate-600"><CheckCircleIcon className="w-4 h-4 mr-2 text-green-500"/> 1 Active Project</li>
                                <li className="flex items-center text-sm text-slate-600"><CheckCircleIcon className="w-4 h-4 mr-2 text-green-500"/> Basic AI Writing (Flash)</li>
                                <li className="flex items-center text-sm text-slate-600"><CheckCircleIcon className="w-4 h-4 mr-2 text-green-500"/> Standard PDF Export</li>
                            </ul>
                            <button className="w-full py-3 border border-brand-600 text-brand-600 font-bold rounded-xl hover:bg-brand-50 transition-colors">
                                Current Plan
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className="border-2 border-brand-500 rounded-2xl p-6 shadow-xl bg-white flex flex-col relative transform md:-translate-y-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
                                Most Popular
                            </div>
                            <h3 className="text-lg font-bold text-brand-600 mb-2 flex items-center">
                                <CrownIcon className="w-5 h-5 mr-2" /> Pro Author
                            </h3>
                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-bold text-slate-900">₹999</span>
                                <span className="text-slate-500 ml-1">/mo</span>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                <li className="flex items-center text-sm text-slate-700 font-medium"><CheckCircleIcon className="w-4 h-4 mr-2 text-brand-500"/> Unlimited Projects</li>
                                <li className="flex items-center text-sm text-slate-700 font-medium"><CheckCircleIcon className="w-4 h-4 mr-2 text-brand-500"/> Advanced AI (Gemini Pro)</li>
                                <li className="flex items-center text-sm text-slate-700 font-medium"><CheckCircleIcon className="w-4 h-4 mr-2 text-brand-500"/> AI Book Cover Gen</li>
                                <li className="flex items-center text-sm text-slate-700 font-medium"><CheckCircleIcon className="w-4 h-4 mr-2 text-brand-500"/> Plot Hole Analysis</li>
                                <li className="flex items-center text-sm text-slate-700 font-medium"><CheckCircleIcon className="w-4 h-4 mr-2 text-brand-500"/> Audiobook Generation</li>
                            </ul>
                            <button className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold rounded-xl hover:shadow-lg hover:from-brand-700 hover:to-brand-600 transition-all">
                                Upgrade to Pro
                            </button>
                        </div>

                        {/* Publisher Plan */}
                        <div className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow bg-slate-50 flex flex-col">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Publisher Elite</h3>
                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-bold text-slate-900">₹4,999</span>
                                <span className="text-slate-500 ml-1">/mo</span>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                <li className="flex items-center text-sm text-slate-600"><CheckCircleIcon className="w-4 h-4 mr-2 text-indigo-500"/> Everything in Pro</li>
                                <li className="flex items-center text-sm text-slate-600"><CheckCircleIcon className="w-4 h-4 mr-2 text-indigo-500"/> White-label Exports</li>
                                <li className="flex items-center text-sm text-slate-600"><CheckCircleIcon className="w-4 h-4 mr-2 text-indigo-500"/> Team Collaboration</li>
                                <li className="flex items-center text-sm text-slate-600"><CheckCircleIcon className="w-4 h-4 mr-2 text-indigo-500"/> API Access</li>
                            </ul>
                            <button className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                    
                    <p className="mt-8 text-xs text-slate-400">
                        * Prices are in Indian Rupees (INR). Taxes may apply. Cancel anytime.
                    </p>
                </div>
            </div>
        </div>
    );
};
