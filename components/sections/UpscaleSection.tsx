
import React, { useState, useRef } from 'react';
import { Upload, Maximize, Download, RotateCw, Trash2, Maximize2 } from 'lucide-react';
import { GeneratedImage } from '../../types';
import { generateArchitecturalRender } from '../../services/geminiService';
import ImageModal from '../ImageModal';

interface UpscaleSectionProps {
  resolution?: string;
}

const UpscaleSection: React.FC<UpscaleSectionProps> = ({ resolution = '1K' }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [selectedImageForModal, setSelectedImageForModal] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpscale = async () => {
    if (!image) return;
    setIsGenerating(true);
    try {
      const prompt = `Deep architectural upscale to ${resolution}. Ultra-clean 4k+ presentation grade. Sharp textures and structural lines.`;
      const resultUrl = await generateArchitecturalRender(prompt, image, '1:1', resolution);
      
      const newImg: GeneratedImage = {
        id: Date.now().toString(),
        url: resultUrl,
        prompt: "Deep Upscale Result",
        timestamp: Date.now()
      };
      setResults([newImg, ...results]);
    } catch (error) {
      console.error("Upscale failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      <ImageModal 
        isOpen={!!selectedImageForModal} 
        onClose={() => setSelectedImageForModal(null)} 
        imageUrl={selectedImageForModal || ''} 
      />

      <div className="lg:col-span-5 flex flex-col gap-6">
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-slate-200 mb-4">Source Low-Res</h3>
          <div onClick={() => fileInputRef.current?.click()} className="aspect-square bg-slate-950 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors group relative overflow-hidden">
            {image ? <img src={image} className="w-full h-full object-contain" alt="Source" /> : <Upload className="w-10 h-10 text-slate-700" />}
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <button onClick={handleUpscale} disabled={isGenerating || !image} className={`w-full py-4 rounded-xl font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${isGenerating || !image ? 'bg-slate-800 text-slate-500' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
            {isGenerating ? <RotateCw className="w-5 h-5 animate-spin" /> : <Maximize className="w-5 h-5" />}
            START {resolution} UPSCALE
          </button>
        </section>
      </div>

      <div className="lg:col-span-7 flex flex-col">
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex-1 flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Deep Resolution Output ({resolution})</h3>
          </div>
          <div 
            onClick={() => results.length > 0 && setSelectedImageForModal(results[0].url)}
            className={`flex-1 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden group ${results.length > 0 ? 'cursor-zoom-in' : ''}`}
          >
            {isGenerating ? (
              <RotateCw className="w-12 h-12 text-indigo-500 animate-spin" />
            ) : results.length > 0 ? (
              <>
                <img src={results[0].url} className="max-w-full max-h-full object-contain" alt="Upscaled" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Maximize2 className="w-8 h-8 text-white" />
                </div>
              </>
            ) : (
              <p className="text-slate-700 text-xs text-center">Ready for reconstruction</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UpscaleSection;
