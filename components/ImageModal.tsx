
import React, { useEffect } from 'react';
import { X, Download, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  title,
  onNext,
  onPrev,
  hasNext,
  hasPrev
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext && onNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev && onPrev) onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  if (!isOpen) return null;

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `DME_Archi_Full_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-200 group/modal">
      <div 
        className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" 
        onClick={onClose}
      />
      
      {/* Navigation Controls */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
          className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 p-4 bg-slate-900/50 hover:bg-indigo-600/80 text-white rounded-full border border-slate-700/50 backdrop-blur-md transition-all z-50 opacity-0 group-hover/modal:opacity-100 hover:scale-110 shadow-2xl"
          title="Previous Image (Left Arrow)"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext?.(); }}
          className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 p-4 bg-slate-900/50 hover:bg-indigo-600/80 text-white rounded-full border border-slate-700/50 backdrop-blur-md transition-all z-50 opacity-0 group-hover/modal:opacity-100 hover:scale-110 shadow-2xl"
          title="Next Image (Right Arrow)"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}
      
      <div className="relative w-full h-full max-w-7xl flex flex-col gap-4 z-10 pointer-events-none">
        <div className="flex items-center justify-between px-2 pointer-events-auto">
          <div className="flex flex-col">
            <h3 className="text-white font-black text-sm uppercase tracking-widest">{title || 'Architectural Preview'}</h3>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Professional Visualization Output</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={downloadImage}
              className="p-2.5 bg-slate-900 border border-slate-800 text-indigo-400 hover:text-white hover:bg-indigo-600/20 rounded-xl transition-all"
              title="Download High Res"
            >
              <Download className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 overflow-hidden flex items-center justify-center relative group pointer-events-auto">
          <img 
            src={imageUrl} 
            className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-300 select-none" 
            alt="Full view" 
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
