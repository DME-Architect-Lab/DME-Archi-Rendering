
import React, { useState, useEffect } from 'react';
import { Settings, User, Zap, Lock, Info, ExternalLink, ChevronDown, Check } from 'lucide-react';
import { NAVIGATION_TABS, RENDER_MODES } from '../constants';
import { TabType, RenderMode } from '../types';
import RenderSection from './sections/RenderSection';
import ImproveSection from './sections/ImproveSection';
import UpscaleSection from './sections/UpscaleSection';
import EditSection from './sections/EditSection';
import UtilitiesSection from './sections/UtilitiesSection';
import VideoSection from './sections/VideoSection';
import Logo from './Logo';

interface DashboardProps {
  onHome: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onHome }) => {
  const [activeTab, setActiveTab] = useState<TabType>('Render');
  const [activeRenderMode, setActiveRenderMode] = useState<RenderMode>('Exterior');
  const [isPro, setIsPro] = useState(true);
  const [resolution, setResolution] = useState('1K');
  const [showResMenu, setShowResMenu] = useState(false);

  const resolutions = ['1K', '2K', '4K', '6K'];

  const handleResolutionSelect = async (res: string) => {
    if (res !== '1K') {
      if (typeof window.aistudio !== 'undefined') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
        }
      }
    }
    setResolution(res);
    setShowResMenu(false);
  };

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'Render':
        return (
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            <div className="flex flex-wrap gap-2 p-1 bg-slate-900/80 rounded-2xl self-start border border-slate-800/50 backdrop-blur-sm">
              {RENDER_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setActiveRenderMode(mode.id as RenderMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    activeRenderMode === mode.id 
                    ? 'bg-indigo-600 text-white shadow-lg border border-indigo-500/50' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
                >
                  {mode.icon}
                  {mode.label}
                </button>
              ))}
            </div>
            <RenderSection mode={activeRenderMode} resolution={resolution} />
          </div>
        );
      case 'Video':
        return <VideoSection />;
      case 'Improve':
        return <ImproveSection resolution={resolution} />;
      case 'Upscale':
        return <UpscaleSection resolution={resolution} />;
      case 'Edit':
        return <EditSection resolution={resolution} />;
      case 'Utilities':
        return <UtilitiesSection resolution={resolution} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <Zap className="w-12 h-12 mb-4 text-slate-700" />
            <p className="text-lg font-medium uppercase tracking-widest">Coming soon</p>
            <p className="text-sm text-center max-w-xs opacity-60">This feature is being optimized for high-performance architectural AI.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-indigo-500/30">
      <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-4 lg:px-6 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-[60]">
        <div className="flex items-center gap-4 lg:gap-8 flex-1 overflow-hidden">
          <button 
            onClick={onHome}
            className="flex-shrink-0 flex items-center gap-3 group transition-all"
          >
            <Logo className="w-8 h-8 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-black text-white tracking-tighter uppercase group-hover:text-indigo-400 transition-colors hidden sm:block">
              DME <span className="text-indigo-500 italic">ARCHI</span>
            </h2>
          </button>
          
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide pr-4">
            {NAVIGATION_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30' 
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-shrink-0 flex items-center gap-2 lg:gap-4 ml-2">
          <div className="relative">
            <button 
              onClick={() => setShowResMenu(!showResMenu)}
              className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl hover:border-indigo-500 transition-all text-[11px] font-black text-slate-300 shadow-xl"
            >
              <span className="text-indigo-400 uppercase tracking-tighter mr-1 hidden sm:inline">RES:</span>
              {resolution}
              <ChevronDown className={`w-3 h-3 transition-transform ${showResMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showResMenu && (
              <div className="absolute top-full mt-2 right-0 w-32 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-3xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-slate-800">
                {resolutions.map(res => (
                  <button 
                    key={res}
                    onClick={() => handleResolutionSelect(res)}
                    className="w-full flex items-center justify-between px-4 py-3 text-[11px] font-black tracking-widest text-slate-400 hover:bg-indigo-600 hover:text-white transition-all border-b border-slate-800/50 last:border-none"
                  >
                    {res}
                    {resolution === res && <Check className="w-3 h-3 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden md:flex bg-slate-900 p-1 rounded-full items-center gap-2 px-3 border border-slate-800 shadow-inner">
            <span className="text-[10px] uppercase font-black text-slate-600">PRO</span>
            <button 
              onClick={() => setIsPro(!isPro)}
              className={`w-8 h-4 lg:w-10 lg:h-5 rounded-full relative transition-all duration-500 ${isPro ? 'bg-indigo-600 shadow-indigo-600/30 shadow-lg' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-0.5 w-3 h-3 lg:w-4 lg:h-4 bg-white rounded-full transition-all duration-300 ${isPro ? 'left-4.5 lg:left-5.5' : 'left-0.5 shadow-sm'}`} />
            </button>
          </div>
          
          <button className="p-2 text-slate-500 hover:text-white transition-colors hidden sm:block">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-[11px] font-black border border-indigo-400/30 shadow-xl text-white">
            DA
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth scrollbar-hide">
          {renderActiveContent()}
        </div>

        <div className="hidden lg:flex w-16 border-l border-slate-800/50 flex-col items-center py-8 gap-8 bg-slate-900/30 backdrop-blur-sm">
          <button className="text-slate-600 hover:text-indigo-400 transition-colors p-2" title="Tutorials">
            <Info className="w-6 h-6" />
          </button>
          <button className="text-slate-600 hover:text-indigo-400 transition-colors p-2" title="Documentation">
            <ExternalLink className="w-6 h-6" />
          </button>
          <div className="mt-auto flex flex-col gap-6">
             <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-700 cursor-not-allowed border border-slate-800 shadow-inner" title="Locked Feature">
                <Lock className="w-4 h-4" />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
