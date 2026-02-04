
import React, { useState, useEffect } from 'react';
import { X, Key, Trash2, ShieldCheck, ExternalLink, Globe, Save, LogOut } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearHistory: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onClearHistory }) => {
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'set' | 'unset'>('checking');
  const [manualKey, setManualKey] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  useEffect(() => {
    if (isOpen) {
        checkKey();
    }
  }, [isOpen]);

  const checkKey = async () => {
    // 1. Check Local Storage first (Manual Key)
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
        setManualKey(storedKey);
        setApiKeyStatus('set');
        return;
    }

    // 2. Check AI Studio Environment
    if (typeof window.aistudio !== 'undefined') {
      try {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeyStatus(hasKey ? 'set' : 'unset');
      } catch (e) {
        setApiKeyStatus('unset');
      }
    } else {
      setApiKeyStatus('unset');
    }
  };

  const handleSetKeyAIStudio = async () => {
    if (typeof window.aistudio !== 'undefined') {
      await window.aistudio.openSelectKey();
      checkKey();
    } else {
        alert("AI Studio environment not detected. Please use Manual Entry.");
        setShowManualInput(true);
    }
  };

  const handleSaveManualKey = () => {
      if (!manualKey.trim()) return;
      
      // Basic validation (Gemini keys usually start with AIza)
      if (!manualKey.trim().startsWith('AIza')) {
          const confirm = window.confirm("This API Key doesn't look like a standard Google Cloud Key (usually starts with 'AIza'). Save anyway?");
          if (!confirm) return;
      }

      localStorage.setItem('gemini_api_key', manualKey.trim());
      setApiKeyStatus('set');
      alert("API Key Saved Locally!");
  };

  const handleClearKey = () => {
      localStorage.removeItem('gemini_api_key');
      setManualKey('');
      setApiKeyStatus('unset');
      checkKey(); // Re-check to update status
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
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
              This application uses Google's Gemini models. You must provide a valid API Key to use high-fidelity rendering and video generation.
            </p>

            {/* AI Studio Button (Hidden if irrelevant, or kept for hybrid usage) */}
            <div className="mb-4">
                 <button 
                  onClick={handleSetKeyAIStudio}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all mb-2"
                >
                  Select via Google AI Studio Provider
                </button>
                <div className="flex items-center gap-2 my-2">
                    <div className="h-px bg-slate-800 flex-1"></div>
                    <span className="text-[9px] text-slate-600 uppercase font-bold">OR Manual Entry</span>
                    <div className="h-px bg-slate-800 flex-1"></div>
                </div>
            </div>

            {/* Manual Input Area */}
            <div className="flex flex-col gap-2">
                <label className="text-[9px] uppercase font-black text-slate-500 px-1">Enter Your Gemini API Key</label>
                <div className="flex gap-2">
                    <input 
                        type="password" 
                        value={manualKey}
                        onChange={(e) => setManualKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none placeholder:text-slate-600"
                    />
                    {apiKeyStatus === 'set' && localStorage.getItem('gemini_api_key') ? (
                        <button 
                            onClick={handleClearKey}
                            className="px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl"
                            title="Remove Saved Key"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    ) : (
                         <button 
                            onClick={handleSaveManualKey}
                            className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider"
                        >
                            Save
                        </button>
                    )}
                </div>
                <p className="text-[9px] text-slate-600 italic mt-1">
                    Key is stored securely in your browser's local storage.
                </p>
            </div>

             <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 mt-4 text-[10px] text-indigo-400 hover:underline">
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
