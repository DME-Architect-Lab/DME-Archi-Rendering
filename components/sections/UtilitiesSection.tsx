
import React, { useState, useRef } from 'react';
import { 
  Globe, PlusCircle, Eye, Armchair, Palette, 
  Upload, Sparkles, RotateCw, Trash2, Maximize2, 
  ChevronLeft, AlertCircle, Building2, Zap
} from 'lucide-react';
import { UTILITIES, MAP_3D_TIMES, MAP_3D_ANGLES } from '../../constants';
import { generateArchitecturalRender, analyzeArchitecturalImage } from '../../services/geminiService';
import ImageModal from '../ImageModal';
import Logo from '../Logo';

interface UtilitiesSectionProps {
  resolution?: string;
}

type SelectedUtility = typeof UTILITIES[0] | null;

const MAP_PRESETS = [
  {
    id: 'coastal',
    label: 'Coastal / ကမ်းခြေ',
    prompt: 'Photorealistic aerial view of a coastal area, deep blue ocean with realistic water caustics and reflections, white sandy beaches, dense tropical vegetation, 3D buildings, cinematic lighting, high detailed terrain elevation.'
  },
  {
    id: 'urban',
    label: 'Urban / မြို့ပြ',
    prompt: 'Dense urban cityscape, modern high-rise buildings with glass facades, busy road networks with traffic, city parks, realistic shadows from skyscrapers, golden hour lighting, detailed 3D city model.'
  },
  {
    id: 'rural',
    label: 'Rural / ကျေးလက်',
    prompt: 'Lush green rural landscape, rolling hills, organic agricultural fields, scattered small houses, winding rivers with reflective water, dense forests, soft morning mist, photorealistic nature photography style.'
  },
  {
    id: 'lake',
    label: 'Lakeside / ကန်ဘောင်',
    prompt: 'Serene lakeside view, large body of water with reflections, surrounding lush forests and parklands, residential buildings near the shore, clear blue sky, peaceful atmosphere, high fidelity 3D environment.'
  }
];

const UtilitiesSection: React.FC<UtilitiesSectionProps> = ({ resolution = '1K' }) => {
  const [selectedUtility, setSelectedUtility] = useState<SelectedUtility>(null);
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [selectedImageForModal, setSelectedImageForModal] = useState<string | null>(null);
  
  // Map specific state
  const [mapTime, setMapTime] = useState(MAP_3D_TIMES[0]);
  const [mapAngle, setMapAngle] = useState(MAP_3D_ANGLES[0]);

  const fileInput1 = useRef<HTMLInputElement>(null);
  const fileInput2 = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleAutoDetect = async () => {
    if (!image1 || !selectedUtility) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      let context = "";
      if (selectedUtility.id === 'MapTo3D') {
        context = "Analyze this Google Map screenshot. Identify the terrain type, vegetation density (forests, trees), water bodies (sea, rivers, lakes), road networks, and building density. Describe the scene geography in high detail to serve as a base for a 3D heightmap and photorealistic aerial render.";
      } else {
        context = `Specialized architectural utility: ${selectedUtility.title}. Input image analysis required for transformation.`;
      }
      
      const data = await analyzeArchitecturalImage(image1, context);
      if (data) setPrompt(data.prompt);
    } catch (err: any) {
      setError("AI analysis unavailable. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleProcess = async () => {
    if (!image1 || !selectedUtility) return;
    setIsProcessing(true);
    setError(null);
    try {
      let finalPrompt = "";
      
      if (selectedUtility.id === 'MapTo3D') {
        const timeVal = mapTime.split('/')[0].trim();
        const angleVal = mapAngle.split('/')[0].trim();
        finalPrompt = `[GOOGLE MAP TO 3D REALISM] Transform this 2D map satellite view into a realistic 3D world. Perspective: ${angleVal}. Lighting: ${timeVal}. Scene details: ${prompt || selectedUtility.desc}. Render high quality water reflections, 3d buildings, volumetric trees, accurate elevation. Cinematic 8k aerial photography.`;
      } else {
        finalPrompt = `[MODE: ${selectedUtility.id}] ${prompt || selectedUtility.desc}. High fidelity render, photorealistic, cinematic lighting.`;
      }
      
      const resultUrl = await generateArchitecturalRender(finalPrompt, image1, '4:3', resolution);
      setResult(resultUrl);
      setHistory(prev => [resultUrl, ...prev]);
    } catch (err: any) {
      setError("Processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedUtility) {
    return (
      <div className="max-w-7xl mx-auto flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
        <ImageModal isOpen={!!selectedImageForModal} onClose={() => setSelectedImageForModal(null)} imageUrl={selectedImageForModal || ''} />
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {setSelectedUtility(null); setResult(null); setImage1(null); setImage2(null); setPrompt('');}}
            className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all shadow-xl"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
              {selectedUtility.icon}
              {selectedUtility.title}
            </h2>
            <span className="text-[11px] text-slate-500 font-bold italic">{selectedUtility.burmese}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <section className="bg-slate-900/60 border border-slate-800/80 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-sm flex flex-col gap-6">
              <div className="flex flex-col">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">1. Configuration & Inputs</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase font-black text-slate-600 px-1">Primary Source (မူရင်းပုံ)</label>
                    <div 
                      onClick={() => fileInput1.current?.click()}
                      className="aspect-video bg-slate-950/80 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 hover:bg-slate-900/50 transition-all group overflow-hidden"
                    >
                      {image1 ? (
                        <img src={image1} className="w-full h-full object-cover" alt="Source" />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="w-6 h-6 text-slate-700 group-hover:text-indigo-400 transition-colors" />
                          <span className="text-[10px] font-black text-slate-600 uppercase">
                            {selectedUtility.id === 'MapTo3D' ? 'Upload Google Map Screenshot' : 'Upload Main Image'}
                          </span>
                        </div>
                      )}
                      <input type="file" ref={fileInput1} className="hidden" onChange={(e) => handleImageUpload(e, setImage1)} />
                    </div>
                  </div>

                  {(selectedUtility.id === 'FurniturePlacement' || selectedUtility.id === 'InsertBuilding') && (
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] uppercase font-black text-slate-600 px-1">Reference/Target (ကိုးကားပုံ)</label>
                      <div 
                        onClick={() => fileInput2.current?.click()}
                        className="aspect-video bg-slate-950/80 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 hover:bg-slate-900/50 transition-all group overflow-hidden"
                      >
                        {image2 ? (
                          <img src={image2} className="w-full h-full object-cover" alt="Target" />
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="w-6 h-6 text-slate-700 group-hover:text-indigo-400 transition-colors" />
                            <span className="text-[10px] font-black text-slate-600 uppercase">Upload Reference</span>
                          </div>
                        )}
                        <input type="file" ref={fileInput2} className="hidden" onChange={(e) => handleImageUpload(e, setImage2)} />
                      </div>
                    </div>
                  )}
                  
                  {/* Google Map Specific Inputs */}
                  {selectedUtility.id === 'MapTo3D' && (
                    <div className="flex flex-col gap-4 mt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                           <label className="text-[9px] uppercase font-black text-slate-600 px-1">Lighting Time (အချိန်)</label>
                           <select value={mapTime} onChange={(e) => setMapTime(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer">
                             {MAP_3D_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                           </select>
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-[9px] uppercase font-black text-slate-600 px-1">View Angle (ရှုထောင့်)</label>
                           <select value={mapAngle} onChange={(e) => setMapAngle(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer">
                             {MAP_3D_ANGLES.map(a => <option key={a} value={a}>{a}</option>)}
                           </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                         <label className="text-[9px] uppercase font-black text-slate-600 px-1">Quick Presets (နမူနာပုံစံများ)</label>
                         <div className="flex flex-wrap gap-2">
                            {MAP_PRESETS.map(preset => (
                              <button
                                key={preset.id}
                                onClick={() => setPrompt(preset.prompt)}
                                className="px-3 py-2 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-600/10 hover:text-indigo-400 rounded-xl text-[10px] font-bold text-slate-400 transition-all text-left flex-1 min-w-[120px]"
                              >
                                {preset.label}
                              </button>
                            ))}
                         </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-col gap-4">
                  <button 
                    onClick={handleAutoDetect}
                    disabled={isAnalyzing || !image1}
                    className="w-full py-3 bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50"
                  >
                    {isAnalyzing ? <RotateCw className="w-4 h-4 animate-spin mx-auto" /> : 'AI Analyze & Detect Details'}
                  </button>

                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={selectedUtility.id === 'MapTo3D' ? "Select a preset above or describe terrain features..." : "Describe specific transformation details..."}
                    className="w-full h-24 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-[10px] text-red-200">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    {error}
                  </div>
                )}

                <button 
                  onClick={handleProcess}
                  disabled={isProcessing || !image1}
                  className="w-full py-4.5 mt-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-[2rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl hover:shadow-indigo-500/30 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isProcessing ? <RotateCw className="w-5 h-5 animate-spin mx-auto" /> : (selectedUtility.id === 'MapTo3D' ? 'GENERATE 3D LANDSCAPE' : 'GENERATE TRANSFORMATION')}
                </button>
              </div>
            </section>
          </div>

          {/* Result */}
          <div className="lg:col-span-7 flex flex-col">
            <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-3xl min-h-[600px] flex flex-col relative overflow-hidden">
               {isProcessing && (
                  <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
                    <Logo className="w-32 h-32 animate-pulse" />
                    <div className="text-center">
                      <h3 className="text-2xl font-black text-white uppercase tracking-[0.4em] italic">PROCESSING</h3>
                      <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-2">DME Neural Engine calculating 3D geometry...</p>
                    </div>
                  </div>
               )}

               <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col">
                    <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest">
                      {selectedUtility.id === 'MapTo3D' ? '3D Landscape Output' : 'Transformation Preview'}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-bold italic">ဗီဇူရယ် ရလဒ်</span>
                  </div>
                  {result && (
                    <button onClick={() => setSelectedImageForModal(result)} className="p-3 bg-slate-800 hover:bg-indigo-600 rounded-2xl text-white transition-all border border-slate-700">
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  )}
               </div>

               <div 
                 onClick={() => result && setSelectedImageForModal(result)}
                 className={`flex-1 bg-slate-950/80 border border-slate-800/30 rounded-[2rem] flex items-center justify-center relative overflow-hidden shadow-inner group ${result ? 'cursor-zoom-in' : ''}`}
               >
                  {result ? (
                    <>
                      <img src={result} className="max-w-full max-h-full object-contain p-2 animate-in zoom-in-95 duration-700" alt="Utility result" />
                      <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-slate-900/95 backdrop-blur-2xl p-6 rounded-[2rem] border border-slate-700 shadow-3xl transform scale-90 group-hover:scale-100 transition-all duration-500">
                          <Maximize2 className="w-10 h-10 text-indigo-400" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center opacity-20">
                      <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <Building2 className="w-10 h-10 text-slate-600" />
                      </div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Output Buffer</p>
                    </div>
                  )}
               </div>

               {/* History Section */}
               <div className="mt-8 pt-6 border-t border-slate-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Generation History</h4>
                       <span className="text-[9px] text-slate-600 font-bold italic">မှတ်တမ်း</span>
                    </div>
                    {history.length > 0 && (
                      <button onClick={() => setHistory([])} className="flex items-center gap-2 text-[10px] text-slate-600 hover:text-red-400 font-bold uppercase tracking-wider transition-colors">
                         <Trash2 className="w-3.5 h-3.5" /> Clear
                      </button>
                    )}
                  </div>
                  
                  {history.length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                      {history.map((url, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setResult(url)}
                          className={`flex-shrink-0 w-24 h-24 rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-300 snap-start ${result === url ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'}`}
                        >
                          <img src={url} className="w-full h-full object-cover" alt="History" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-24 flex items-center justify-center border border-slate-800/30 rounded-2xl border-dashed bg-slate-950/30">
                       <span className="text-[10px] text-slate-700 font-black uppercase tracking-widest">No History Available</span>
                    </div>
                  )}
               </div>

            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-10 py-4 animate-in fade-in duration-500">
      <div className="flex flex-col items-center text-center gap-2">
        <h2 className="text-3xl font-black text-white uppercase tracking-[0.3em]">Architectural Utilities</h2>
        <p className="text-slate-500 text-sm font-bold italic">အဆင့်မြင့် အဆောက်အဦး ရေးဆွဲရေး အထောက်အကူပြု ကိရိယာများ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {UTILITIES.map((util) => (
          <button
            key={util.id}
            onClick={() => {
              setSelectedUtility(util);
              if (util.id === 'MapTo3D') {
                 setPrompt(`A hyper-realistic, cinematic drone photograph based strictly on the geography and layout of the provided satellite image. Transform the flat, top-down satellite view into a slight oblique angle (high-angle shot) to create three-dimensional depth.
The ground should not look flat; it must show realistic elevation changes and topography based on the image's features. Apply dramatic [Golden Hour sunrise/sunset)] lighting.
The low sun angle must cast long, distinct, directional shadows from every tree, building, and hill, defining their shapes on the ground. The light should be warm and rich. Add atmospheric haze and perspective, making distant elements slightly bluer and softer.
Enhance environmental textures: trees must be volumetric with individual leaves, water surfaces must be reflective, and roads/buildings must show realistic weathering and material textures.
Shot on a high-resolution aerial cinema camera. incredible detail, sharp focus across the frame, natural cinematic color grading. Remove any text that was placed in google earth.`);
              } else {
                 setPrompt('');
              }
            }}
            className="bg-slate-900/40 border border-slate-800/50 p-8 rounded-[2.5rem] flex flex-col items-center text-center gap-6 group hover:bg-slate-900/80 hover:border-indigo-500/50 hover:-translate-y-2 transition-all duration-500 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
               <Zap className="w-32 h-32" />
            </div>
            
            <div className="w-20 h-20 rounded-[1.8rem] bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-slate-900 transition-all duration-500 shadow-2xl">
              {util.icon}
            </div>

            <div className="flex flex-col gap-2 relative z-10">
              <h3 className="text-lg font-black text-slate-100 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">
                {util.title}
              </h3>
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter group-hover:text-slate-400 transition-colors">
                {util.burmese}
              </span>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2 px-2">
                {util.desc}
              </p>
            </div>

            <div className="mt-auto w-10 h-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-indigo-600 group-hover:border-indigo-400 transition-all">
               <ChevronLeft className="w-5 h-5 text-white rotate-180" />
            </div>
          </button>
        ))}
      </div>

      {/* Footer Info */}
      <div className="flex justify-center mt-8">
        <div className="px-6 py-3 bg-slate-900/50 border border-slate-800/50 rounded-2xl flex items-center gap-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
          <span>Neural Engine v2.4</span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span>Systems Optimal</span>
        </div>
      </div>
    </div>
  );
};

export default UtilitiesSection;
