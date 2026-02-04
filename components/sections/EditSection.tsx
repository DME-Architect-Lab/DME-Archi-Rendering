
import React, { useState, useRef } from 'react';
import { 
  Upload, Sparkles, Box, UserPlus, Palette, 
  StickyNote, Trash2, Download, RotateCw, 
  Maximize2, Image as ImageIcon, Send
} from 'lucide-react';
import { GeneratedImage } from '../../types';
import { generateArchitecturalRender } from '../../services/geminiService';
import ImageModal from '../ImageModal';

type EditMode = 'General' | 'Replace' | 'Add' | 'Material' | 'Notes';

interface EditSectionProps {
  resolution?: string;
}

const EditSection: React.FC<EditSectionProps> = ({ resolution = '1K' }) => {
  const [image, setImage] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<EditMode>('General');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [selectedImageForModal, setSelectedImageForModal] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editModes = [
    { id: 'General' as EditMode, label: 'General Edit', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'Replace' as EditMode, label: 'Replace Model', icon: <Box className="w-4 h-4" /> },
    { id: 'Add' as EditMode, label: 'Add Object', icon: <UserPlus className="w-4 h-4" /> },
    { id: 'Material' as EditMode, label: 'Change Material', icon: <Palette className="w-4 h-4" /> },
    { id: 'Notes' as EditMode, label: 'Annotations', icon: <StickyNote className="w-4 h-4" /> },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;
    setIsGenerating(true);
    try {
      let finalPrompt = prompt;
      if (activeMode === 'Replace') finalPrompt = `Architectural model replacement: ${prompt}. Maintain same lighting and perspective.`;
      if (activeMode === 'Add') finalPrompt = `Architectural addition: Precisely add ${prompt} into the scene. High realism.`;
      if (activeMode === 'Material') finalPrompt = `Architectural material swap: Change ${prompt}. Keep architectural integrity.`;
      
      const resultUrl = await generateArchitecturalRender(finalPrompt, image, '1:1', resolution);
      
      const newImg: GeneratedImage = {
        id: Date.now().toString(),
        url: resultUrl,
        prompt: finalPrompt,
        timestamp: Date.now()
      };
      setResults([newImg, ...results]);
    } catch (error) {
      console.error("Edit failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
      <ImageModal 
        isOpen={!!selectedImageForModal} 
        onClose={() => setSelectedImageForModal(null)} 
        imageUrl={selectedImageForModal || ''} 
      />

      <div className="flex gap-2 p-1 bg-slate-900/80 rounded-xl self-center border border-slate-800 backdrop-blur-sm">
        {editModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeMode === mode.id 
              ? 'bg-slate-800 text-amber-500 shadow-sm border border-amber-500/30' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            {mode.icon}
            {mode.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-320px)] min-h-[500px]">
        <section className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-2xl relative overflow-hidden group">
          <div className="absolute top-4 left-6 z-10 flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">1. Select Area & Describe</span>
          </div>

          <div 
            onClick={() => !image && fileInputRef.current?.click()}
            className={`flex-1 flex flex-col items-center justify-center relative overflow-hidden ${!image ? 'cursor-pointer hover:bg-slate-800/20' : ''}`}
          >
            {image ? (
              <img src={image} className="w-full h-full object-contain" alt="Editor source" />
            ) : (
              <div className="flex flex-col items-center gap-3">
                 <Upload className="w-8 h-8 text-slate-700" />
                 <p className="text-slate-400 font-medium text-sm">Click to upload image</p>
              </div>
            )}
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
          </div>

          {image && (
            <div className="absolute bottom-6 left-6 right-6 flex gap-3 p-3 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl">
              <input 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe specific changes..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-200 placeholder:text-slate-600"
                onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
              />
              <button 
                onClick={handleEdit}
                disabled={isGenerating || !prompt}
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:bg-slate-800"
              >
                {isGenerating ? <RotateCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          )}
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-2xl relative overflow-hidden group">
          <div className="absolute top-4 left-6 z-10">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">2. Result ({resolution})</span>
          </div>

          <div 
            onClick={() => results.length > 0 && setSelectedImageForModal(results[0].url)}
            className={`flex-1 flex items-center justify-center bg-slate-950 relative overflow-hidden ${results.length > 0 ? 'cursor-zoom-in' : ''}`}
          >
            {isGenerating ? (
              <Sparkles className="w-12 h-12 text-indigo-500 animate-pulse" />
            ) : results.length > 0 ? (
              <>
                <img src={results[0].url} className="w-full h-full object-contain" alt="Edit result" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Maximize2 className="w-8 h-8 text-white" />
                </div>
              </>
            ) : (
              <p className="text-slate-700 text-[10px] uppercase font-bold">Results appear here</p>
            )}
          </div>
        </section>
      </div>

      <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Edit History</h4>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {results.map((res, i) => (
            <div 
              key={res.id} 
              onClick={() => {
                const newRes = [...results];
                const [selected] = newRes.splice(i, 1);
                setResults([selected, ...newRes]);
              }}
              className={`w-32 aspect-[4/3] rounded-xl border-2 flex-shrink-0 cursor-pointer overflow-hidden transition-all ${i === 0 ? 'border-amber-500' : 'border-slate-800 opacity-40 hover:opacity-100'}`}
            >
              <img src={res.url} className="w-full h-full object-cover" alt="History" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EditSection;
