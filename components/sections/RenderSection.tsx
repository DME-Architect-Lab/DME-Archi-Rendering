
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Upload, Wand2, Play, Download, Trash2, 
  Maximize2, RotateCw, Building2, Home, Sun, Cloud, 
  Moon, Map as MapIcon, Layers, Grid3X3, Palette,
  Square, RectangleHorizontal, RectangleVertical, 
  Camera, Image as ImageIcon, Sparkles, Check,
  BrainCircuit, AlertCircle, Zap
} from 'lucide-react';
import { RenderMode, GeneratedImage } from '../../types';
import { 
  STYLE_OPTIONS, CONTEXT_OPTIONS, LIGHTING_OPTIONS, TONE_OPTIONS,
  ASPECT_RATIOS, ANGLE_OPTIONS, ROOM_TYPES, ROOM_STYLES, INTERIOR_RENDER_PRESETS,
  FLOORPLAN_ANGLES, TIME_OPTIONS, FLOORPLAN_VIEW_OPTIONS
} from '../../constants';
import { generateArchitecturalRender, analyzeArchitecturalImage, AnalysisResult } from '../../services/geminiService';
import Logo from '../Logo';
import ImageModal from '../ImageModal';

interface RenderSectionProps {
  mode: RenderMode;
  resolution?: string;
  clearHistoryTrigger?: number;
}

const RenderSection: React.FC<RenderSectionProps> = ({ mode, resolution = '1K', clearHistoryTrigger }) => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [refImage, setRefImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [selectedImageForModal, setSelectedImageForModal] = useState<string | null>(null);
  
  // State for Exterior/Interior common
  const [style, setStyle] = useState(STYLE_OPTIONS[0]);
  const [context, setContext] = useState(CONTEXT_OPTIONS[0]);
  const [lighting, setLighting] = useState(LIGHTING_OPTIONS[0]);
  const [tone, setTone] = useState(TONE_OPTIONS[0]);
  
  // State for Interior Specific
  const [selectedRoomType, setSelectedRoomType] = useState(ROOM_TYPES[0]);
  const [selectedRoomStyle, setSelectedRoomStyle] = useState(ROOM_STYLES[0]);
  const [interiorPreset, setInteriorPreset] = useState(INTERIOR_RENDER_PRESETS[0]);

  // State for Floorplan Specific
  const [floorplanView, setFloorplanView] = useState(FLOORPLAN_VIEW_OPTIONS[0]);
  
  // State for other modes
  const [angle, setAngle] = useState(ANGLE_OPTIONS[0]);
  const [floorplanAngle, setFloorplanAngle] = useState(FLOORPLAN_ANGLES[1]);
  const [aspectRatio, setAspectRatio] = useState('4:3');
  const [numImages, setNumImages] = useState(2);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const refInputRef = useRef<HTMLInputElement>(null);

  const isFloorplanMode = mode === 'Floorplan3D' || mode === '3DFloorplan';
  const isInteriorMode = mode === 'Interior';

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('archi_render_history');
    if (saved) {
      try {
        setResults(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage whenever results change
  useEffect(() => {
    if (results.length > 0) {
      localStorage.setItem('archi_render_history', JSON.stringify(results));
    }
  }, [results]);

  // Handle external clear history trigger
  useEffect(() => {
    if (clearHistoryTrigger && clearHistoryTrigger > 0) {
      setResults([]);
    }
  }, [clearHistoryTrigger]);


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleAutoDetect = async () => {
    if (!sourceImage) {
      setError("Please upload an image first to use Auto Detect. (ပုံတင်ပြီးမှ Auto Detect လုပ်ပါ)");
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    try {
      const contextMsg = isFloorplanMode 
        ? `This is a floorplan visualization. Mode: ${mode}. Analyze the layout and suggest a 3D conversion.`
        : isInteriorMode 
          ? `Analyze this interior space. Identify the room function, furniture style, materials, and lighting.`
          : `This is an architectural exterior. Analyze the building style, facade materials, surroundings, and lighting conditions.`;
        
      const data: AnalysisResult = await analyzeArchitecturalImage(sourceImage, contextMsg);
      if (data) {
        setPrompt(data.prompt);
        // We could also auto-set dropdowns here if we wanted to map the analysis result to options
      }
    } catch (err: any) {
      console.error("Analysis failed", err);
      setError("AI analysis is temporarily unavailable. (AI အလုပ်များနေသဖြင့် ခဏအကြာမှ ထပ်စမ်းကြည့်ပါ)");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const finalPromptText = useMemo(() => {
    let constructed = "";
    
    if (isFloorplanMode) {
      // Floorplan to 3D Conversion Prompt
      constructed = `Transform this 2D floorplan line drawing into a photorealistic 3D visualization. View Mode: ${floorplanView.value}. Target Room: ${selectedRoomType.value}. Interior Design Style: ${selectedRoomStyle.value}. Materials and Details: ${prompt}. The output must be a fully furnished, lighted, and textured rendering of the room specified, respecting the structural layout of the source plan.`;
    } else if (isInteriorMode) {
      // Specialized Interior Prompt Construction
      constructed = `[${interiorPreset.value}]. Professional interior design of a ${selectedRoomType.value}. Architectural Style: ${selectedRoomStyle.value}. Lighting: ${lighting.value}. Mood: ${tone.value}. Additional details: ${prompt}.`;
    } else {
      // Exterior Prompt Construction
      constructed = `Professional architectural visualization of ${prompt || 'a building'}. Style: ${style.value}. Context: ${context.value}. Lighting: ${lighting.value}. Color Tone: ${tone.value}. Camera: ${angle}. 8k resolution, highly detailed, photorealistic, cinematic composition.`;
    }
    
    return constructed;
  }, [style, mode, angle, floorplanAngle, selectedRoomType, selectedRoomStyle, interiorPreset, floorplanView, context, lighting, tone, prompt, isFloorplanMode, isInteriorMode]);

  const handleRender = async () => {
    if (!sourceImage) return;
    setIsGenerating(true);
    setError(null);
    try {
      // Generate multiple images concurrently based on numImages
      const promises = Array.from({ length: numImages }).map(async (_, index) => {
        // Add a small delay between requests to avoid potential rate limiting on lower tiers
        await new Promise(resolve => setTimeout(resolve, index * 300));
        return generateArchitecturalRender(finalPromptText, sourceImage, aspectRatio, resolution);
      });

      const generatedUrls = await Promise.all(promises);

      const newImages: GeneratedImage[] = generatedUrls.map((url, idx) => ({
        id: `${Date.now()}-${idx}`,
        url: url,
        prompt: finalPromptText,
        timestamp: Date.now()
      }));

      // Update state, this will trigger the useEffect to save to localStorage
      setResults(prev => [...newImages, ...prev]);
    } catch (err: any) {
      console.error("Rendering failed", err);
      setError("The rendering engine is overloaded. Please try generating fewer images or wait a moment.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Image Navigation Handlers
  const selectedIndex = results.findIndex(r => r.url === selectedImageForModal);

  const handleNext = () => {
    if (selectedIndex < results.length - 1) {
      setSelectedImageForModal(results[selectedIndex + 1].url);
    }
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedImageForModal(results[selectedIndex - 1].url);
    }
  };

  const clearHistory = () => {
    setResults([]);
    localStorage.removeItem('archi_render_history');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative pb-20">
      <ImageModal 
        isOpen={!!selectedImageForModal} 
        onClose={() => setSelectedImageForModal(null)} 
        imageUrl={selectedImageForModal || ''}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={selectedIndex < results.length - 1}
        hasPrev={selectedIndex > 0}
      />

      {/* Settings Column */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* SECTION 1: SOURCE IMAGE */}
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest">
                {isFloorplanMode ? '1. Upload Floorplan' : '1. Upload Source Image'}
              </h3>
              <span className="text-[10px] text-slate-500 font-bold italic">၁။ မူရင်းပုံအားတင်ပါ</span>
            </div>
            {sourceImage && (
              <button onClick={() => setSourceImage(null)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div 
            onClick={() => !sourceImage && fileInputRef.current?.click()}
            className={`aspect-[16/10] bg-slate-950/80 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all group relative overflow-hidden ${sourceImage ? 'border-indigo-500/50 shadow-inner' : 'border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/40 cursor-pointer'}`}
          >
            {sourceImage ? (
              <img src={sourceImage} className="w-full h-full object-contain p-2" alt="Preview" />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-slate-800 transition-all duration-500">
                  <Upload className="w-7 h-7 text-slate-400 group-hover:text-indigo-400" />
                </div>
                <div className="text-center px-4">
                  <p className="text-[11px] text-slate-300 font-black uppercase tracking-widest">
                    {isFloorplanMode ? 'Click to upload 2D Floorplan' : 'Click to upload photo/sketch'}
                  </p>
                  <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">ပုံတင်ရန် နှိပ်ပါ</p>
                </div>
              </div>
            )}
            <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => handleImageUpload(e, setSourceImage)} accept="image/*" />
          </div>
        </section>

        {/* SECTION 2: OPTIONS */}
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur-sm flex flex-col gap-5">
          <div className="flex flex-col mb-1">
             <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest">2. Description & Options</h3>
             <span className="text-[10px] text-slate-500 font-bold italic">၂။ ဖော်ပြချက်နှင့် ရွေးချယ်စရာများ</span>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-3 animate-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-red-200 font-medium leading-relaxed">{error}</p>
            </div>
          )}

           {/* Reference Image Option */}
          <div 
              onClick={() => refInputRef.current?.click()}
              className={`w-full py-3 px-4 bg-slate-950/50 border border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-indigo-500/30 transition-all ${refImage ? 'border-indigo-500/30' : ''}`}
            >
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4 text-slate-500" />
                <span className="text-[10px] font-black tracking-widest uppercase text-slate-500">
                  {refImage ? "Style Reference Loaded" : "Upload Reference Style (Optional)"}
                </span>
              </div>
              {refImage && <Check className="w-4 h-4 text-green-500" />}
              <input type="file" className="hidden" ref={refInputRef} onChange={(e) => handleImageUpload(e, setRefImage)} accept="image/*" />
          </div>

          {/* AUTO DETECT BUTTON */}
          <button 
            onClick={handleAutoDetect}
            disabled={!sourceImage || isAnalyzing}
            className={`w-full py-2.5 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${(!sourceImage || isAnalyzing) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
             {isAnalyzing ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <BrainCircuit className="w-3.5 h-3.5" />}
             {isAnalyzing ? 'ANALYZING...' : 'AUTO DETECT IMAGE & WRITE PROMPT'}
          </button>

          {/* Description Text Area */}
          <textarea
            value={prompt} onChange={(e) => setPrompt(e.target.value)}
            placeholder={isFloorplanMode ? "Describe specific details (e.g., kitchen on the left wall, large wooden dining table, marble floor)..." : "Describe specific details... (e.g., 2 storey modern house with glass facade, coffee shop on ground floor)"}
            className="w-full h-20 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 resize-none shadow-inner"
          />

          {/* DYNAMIC DROPDOWNS BASED ON MODE */}
          {isInteriorMode ? (
            /* INTERIOR MODE OPTIONS */
            <div className="flex flex-col gap-4">
               {/* 1. Render Preset (Photorealistic, etc.) */}
               <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-black text-slate-500 px-1">Render Preset (ပုံထွက်ပုံစံ)</label>
                <select 
                  value={interiorPreset.label} 
                  onChange={(e) => {
                    const p = INTERIOR_RENDER_PRESETS.find(opt => opt.label === e.target.value);
                    if (p) setInteriorPreset(p);
                  }} 
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {INTERIOR_RENDER_PRESETS.map(opt => <option key={opt.label} value={opt.label}>{opt.label}</option>)}
                </select>
              </div>

              {/* 2. Room Function */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-black text-slate-500 px-1">Room Function (အခန်းအမျိုးအစား)</label>
                <select 
                  value={selectedRoomType.label} 
                  onChange={(e) => {
                    const r = ROOM_TYPES.find(opt => opt.label === e.target.value);
                    if (r) setSelectedRoomType(r);
                  }} 
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {ROOM_TYPES.map(opt => <option key={opt.label} value={opt.label}>{opt.label}</option>)}
                </select>
              </div>

              {/* 3. Architectural Style */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase font-black text-slate-500 px-1">Architectural Style (ဒီဇိုင်းပုံစံ)</label>
                <select 
                  value={selectedRoomStyle.label} 
                  onChange={(e) => {
                    const s = ROOM_STYLES.find(opt => opt.label === e.target.value);
                    if (s) setSelectedRoomStyle(s);
                  }} 
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {ROOM_STYLES.map(opt => <option key={opt.label} value={opt.label}>{opt.label}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                   <label className="text-[9px] uppercase font-black text-slate-500 px-1">Lighting (အလင်း)</label>
                   <select 
                     value={lighting.label} 
                     onChange={(e) => {
                       const l = LIGHTING_OPTIONS.find(opt => opt.label === e.target.value);
                       if (l) setLighting(l);
                     }} 
                     className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                   >
                     {LIGHTING_OPTIONS.map(opt => <option key={opt.label} value={opt.label}>{opt.label}</option>)}
                   </select>
                </div>
                <div className="flex flex-col gap-1.5">
                   <label className="text-[9px] uppercase font-black text-slate-500 px-1">Tone/Mood</label>
                   <select 
                     value={tone.label} 
                     onChange={(e) => {
                       const t = TONE_OPTIONS.find(opt => opt.label === e.target.value);
                       if (t) setTone(t);
                     }} 
                     className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                   >
                     {TONE_OPTIONS.map(opt => <option key={opt.label} value={opt.label}>{opt.label}</option>)}
                   </select>
                </div>
              </div>
            </div>
          ) : isFloorplanMode ? (
            /* FLOORPLAN MODE OPTIONS */
             <div className="flex flex-col gap-4">
               {/* 1. View Mode (Perspective vs Isometric) */}
               <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase font-black text-slate-500 px-1">View Mode (မြင်ကွင်းပုံစံ)</label>
                  <select 
                    value={floorplanView.label} 
                    onChange={(e) => {
                        const v = FLOORPLAN_VIEW_OPTIONS.find(opt => opt.label === e.target.value);
                        if(v) setFloorplanView(v);
                    }} 
                    className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {FLOORPLAN_VIEW_OPTIONS.map(v => <option key={v.label} value={v.label}>{v.label}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* 2. Target Room Type */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase font-black text-slate-500 px-1">Room Type</label>
                    <select 
                      value={selectedRoomType.label} 
                      onChange={(e) => {
                          const r = ROOM_TYPES.find(opt => opt.label === e.target.value);
                          if(r) setSelectedRoomType(r);
                      }} 
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      {ROOM_TYPES.map(rt => <option key={rt.label} value={rt.label}>{rt.label}</option>)}
                    </select>
                  </div>
                  
                  {/* 3. Style */}
                  <div className="flex flex-col gap-1.5">
                     <label className="text-[9px] uppercase font-black text-slate-500 px-1">Style</label>
                     <select 
                       value={selectedRoomStyle.label} 
                       onChange={(e) => {
                         const s = ROOM_STYLES.find(opt => opt.label === e.target.value);
                         if(s) setSelectedRoomStyle(s);
                       }} 
                       className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                     >
                        {ROOM_STYLES.map(rs => <option key={rs.label} value={rs.label}>{rs.label}</option>)}
                     </select>
                  </div>
                </div>
             </div>
          ) : (
            /* EXTERIOR/GENERIC MODE OPTIONS */
            <div className="flex flex-col gap-4">
               <div className="flex flex-col gap-1.5">
                 <label className="text-[9px] uppercase font-black text-slate-500 px-1">Architectural Style (ပုံစံ)</label>
                 <select 
                   value={style.label} 
                   onChange={(e) => {
                     const s = STYLE_OPTIONS.find(opt => opt.label === e.target.value);
                     if (s) setStyle(s);
                   }} 
                   className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                 >
                   {STYLE_OPTIONS.map(opt => <option key={opt.label} value={opt.label}>{opt.label}</option>)}
                 </select>
               </div>

               <div className="flex flex-col gap-1.5">
                 <label className="text-[9px] uppercase font-black text-slate-500 px-1">Context (ပတ်ဝန်းကျင်)</label>
                 <select 
                   value={context.label} 
                   onChange={(e) => {
                     const c = CONTEXT_OPTIONS.find(opt => opt.label === e.target.value);
                     if (c) setContext(c);
                   }} 
                   className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                 >
                   {CONTEXT_OPTIONS.map(opt => <option key={opt.label} value={opt.label}>{opt.label}</option>)}
                 </select>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase font-black text-slate-500 px-1">Lighting (အလင်း)</label>
                    <select 
                      value={lighting.label} 
                      onChange={(e) => {
                        const l = LIGHTING_OPTIONS.find(opt => opt.label === e.target.value);
                        if (l) setLighting(l);
                      }} 
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      {LIGHTING_OPTIONS.map(opt => <option key={opt.label} value={opt.label}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase font-black text-slate-500 px-1">Tone (ကာလာ)</label>
                    <select 
                      value={tone.label} 
                      onChange={(e) => {
                        const t = TONE_OPTIONS.find(opt => opt.label === e.target.value);
                        if (t) setTone(t);
                      }} 
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      {TONE_OPTIONS.map(opt => <option key={opt.label} value={opt.label}>{opt.label}</option>)}
                    </select>
                  </div>
               </div>
            </div>
          )}

          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-4 flex flex-col gap-1.5 shadow-inner">
            <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em]">Final Prompt Construction</span>
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium italic line-clamp-3">
              {finalPromptText}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase font-black text-slate-500 px-1">Quantity (အရေအတွက်)</label>
              <div className="flex bg-slate-950 rounded-xl border border-slate-800 p-1">
                {[1, 2, 4].map(n => (
                  <button key={n} onClick={() => setNumImages(n)} className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${numImages === n ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-300'}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase font-black text-slate-500 px-1">Aspect Ratio (အချိုးအစား)</label>
              <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer">
                {ASPECT_RATIOS.map(ar => <option key={ar} value={ar}>{ar}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={handleRender}
            disabled={isGenerating || !sourceImage}
            className={`w-full flex items-center justify-center gap-4 py-4.5 mt-2 rounded-[2rem] font-black text-[13px] tracking-[0.15em] transition-all shadow-3xl ${
              isGenerating || !sourceImage 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white'
            }`}
          >
            {isGenerating ? <RotateCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {isFloorplanMode ? 'GENERATE 3D FLOORPLAN' : isInteriorMode ? 'GENERATE INTERIOR' : 'GENERATE RENDER'}
          </button>
        </section>

        {/* SECTION 3: CAMERA PERSPECTIVE */}
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col mb-4">
             <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest">3. Camera Perspective</h3>
             <span className="text-[10px] text-slate-500 font-bold italic">၃။ ရိုက်ကူးမည့်ထောင့်</span>
          </div>
          <div className="relative">
            <select value={angle} onChange={(e) => setAngle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-bold text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer">
               {ANGLE_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <Camera className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
          </div>
        </section>
      </div>

      {/* Results Column */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-7 shadow-3xl flex-1 flex flex-col min-h-[650px] relative overflow-hidden">
          {isGenerating && (
            <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center gap-10 animate-in fade-in duration-700">
               <Logo className="w-40 h-40 animate-pulse duration-[2s]" />
               <div className="text-center px-10">
                  <h2 className="text-4xl font-black text-white tracking-[0.5em] uppercase italic mb-2">RENDERING</h2>
                  <p className="text-[12px] text-indigo-400 font-black uppercase tracking-[0.2em] mb-6">DME Neural Processing...</p>
                  <div className="w-80 h-2 bg-slate-900 rounded-full overflow-hidden mx-auto">
                    <div className="h-full bg-indigo-500 animate-[loading_2s_infinite]"></div>
                  </div>
               </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
               <h3 className="text-base font-black text-slate-100 uppercase tracking-widest">Neural Visualization Output</h3>
               <span className="text-[12px] text-slate-500 font-bold italic">ဗီဇူရယ် ရလဒ်</span>
            </div>
            {results.length > 0 && (
              <button onClick={() => setSelectedImageForModal(results[0].url)} className="flex items-center gap-3 px-6 py-2.5 bg-slate-800/80 hover:bg-indigo-600 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white border border-slate-700 transition-all">
                <Maximize2 className="w-4 h-4" /> Full View
              </button>
            )}
          </div>

          <div 
            onClick={() => results.length > 0 && setSelectedImageForModal(results[0].url)}
            className={`flex-1 bg-slate-950/80 border border-slate-800/30 rounded-[2rem] relative overflow-hidden flex items-center justify-center group shadow-2xl transition-all ${results.length > 0 ? 'cursor-zoom-in' : ''}`}
          >
            {results.length > 0 ? (
              <>
                <img src={results[0].url} className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-1000 p-2" alt="Current render" />
                <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-slate-900/95 backdrop-blur-2xl p-6 rounded-[2rem] border border-slate-700 shadow-3xl transform scale-90 group-hover:scale-100 transition-all duration-500">
                    <Maximize2 className="w-10 h-10 text-indigo-400" />
                  </div>
                </div>
              </>
            ) : !isGenerating && (
              <div className="text-center opacity-30">
                <div className="w-28 h-28 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-slate-800 rotate-[15deg] group-hover:rotate-0 transition-all duration-700 shadow-2xl">
                   {isFloorplanMode ? <Layers className="w-14 h-14 text-slate-600" /> : <Building2 className="w-14 h-14 text-slate-600" />}
                </div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mb-2">Neural Output Buffer</p>
                <p className="text-[10px] text-slate-700 font-black uppercase italic">Transformation Ready</p>
              </div>
            )}
          </div>
          
          {/* Enhanced History Strip */}
          <div className="mt-10 pt-8 border-t border-slate-800/30">
             <div className="flex items-center justify-between mb-5 px-3">
                <div className="flex items-center gap-4">
                   <h4 className="text-[11px] uppercase font-black text-slate-400 tracking-[0.2em]">Output History</h4>
                   <span className="text-[11px] text-slate-700 font-bold italic">ရလဒ်မှတ်တမ်း</span>
                </div>
                {results.length > 0 && (
                  <button onClick={clearHistory} className="text-[10px] text-slate-600 hover:text-red-400 font-black uppercase tracking-[0.1em] transition-all flex items-center gap-2">
                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                  </button>
                )}
             </div>
             <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide px-2">
                {results.length > 0 ? results.map((res, i) => (
                  <div 
                    key={res.id} 
                    onClick={() => {const r = [...results]; const [c] = r.splice(i,1); setResults([c, ...r]);}} 
                    className={`w-36 aspect-[4/3] rounded-[1.5rem] border-2 flex-shrink-0 cursor-pointer overflow-hidden transition-all duration-500 relative group/item ${i === 0 ? 'border-indigo-500 scale-105 z-10 shadow-2xl' : 'border-slate-800 opacity-40 hover:opacity-100 hover:border-slate-600'}`}
                  >
                    <img src={res.url} className="w-full h-full object-cover" alt="History" />
                  </div>
                )) : (
                  <div className="w-full py-12 flex flex-col items-center justify-center border border-slate-800/30 rounded-[2rem] border-dashed">
                     <p className="text-slate-800 text-[11px] font-black uppercase tracking-[0.3em] italic">No Records Found</p>
                  </div>
                )}
             </div>
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}} />
    </div>
  );
};

export default RenderSection;
