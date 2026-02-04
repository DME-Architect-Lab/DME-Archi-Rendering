
import React, { useState, useEffect } from 'react';
import { X, Key, Trash2, ShieldCheck, ExternalLink, Globe } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearHistory: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onClearHistory }) => {
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'set' | 'unset'>('checking');

  useEffect(() => {
    checkKey();
  }, [isOpen]);

  const checkKey = async () => {
    if (typeof window.aistudio !== 'undefined') {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setApiKeyStatus(hasKey ? 'set' : 'unset');
    } else {
      setApiKeyStatus('unset');
    }
  };

  const handleSetKey = async () => {
    if (typeof window.aistudio !== 'undefined') {
      await window.aistudio.openSelectKey();
      checkKey();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative shadow-2xl z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-500" />
            Application Settings
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* API Key Section */}
          <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                Gemini API Configuration
              </h3>
              {apiKeyStatus === 'set' && (
                <span className="text-[10px] font-black text-green-400 bg-green-400/10 px-2 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> ACTIVE
                </span>
              )}
            </div>
            
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              This application uses Google's Gemini models. You must select a valid API Key from a paid billing project to use features like Veo Video and High-Res Rendering.
            </p>

            <button 
              onClick={handleSetKey}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              {apiKeyStatus === 'set' ? 'Change API Key' : 'Select API Key'}
            </button>

             <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 mt-3 text-[10px] text-indigo-400 hover:underline">
                View Billing Documentation <ExternalLink className="w-3 h-3" />
             </a>
          </div>

          {/* History Section */}
          <div className="p-5 bg-slate-950/50 rounded-2xl border border-slate-800">
             <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-400" />
                Data Management
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Clear all locally saved rendering history and cached images. This action cannot be undone.
            </p>
            <button 
              onClick={() => {
                onClearHistory();
                onClose();
              }}
              className="w-full py-3 bg-slate-800 hover:bg-red-900/30 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/30 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
            >
              Clear Local History
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
           <p className="text-[10px] text-slate-600">DME Neural Architecture v2.4</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
