
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Wand2, Play, Download, Trash2, Maximize2, RotateCw, Film, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Logo from '../Logo';

const LOADING_MESSAGES = [
  "Generating complex fluid physics...",
  "Applying volumetric lighting across frames...",
  "Rendering high-fidelity architectural motion...",
  "Synchronizing camera paths for cinematic flow...",
  "DME Neural Engine is processing your design...",
  "Optimizing frame transitions for realism...",
  "Finalizing 1080p architectural visualization..."
];

const VideoSection: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingMessageIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSourceImage(reader.result as string);
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleGenerateVideo = async () => {
    if (!sourceImage) return;

    try {
      setIsGenerating(true);
      setError(null);
      
      // Determine API Key: Check Local Storage first, then Environment
      const manualKey = localStorage.getItem('gemini_api_key');
      let apiKey = manualKey || process.env.API_KEY;

      // Only if no manual key is set, try the interactive selection
      if (!manualKey && typeof window.aistudio !== 'undefined') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
        }
      }

      // Re-read apiKey after potential selection (though environment variable won't update in real-time in this context, 
      // standard practice for the component flow is to rely on what we have)
      if (!apiKey) {
          throw new Error("API Key missing. Please go to Settings and enter a valid API Key.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Start video generation
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || 'Cinematic architectural flythrough of this building, hyper-realistic, 8k, smooth motion, natural lighting.',
        image: {
          imageBytes: sourceImage.split(',')[1],
          mimeType: 'image/png',
        },
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: aspectRatio
        }
      });

      // Long polling for video completion
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error("Video generation failed - no URI returned.");

      // Use the resolved apiKey for the download fetch as well
      const response = await fetch(`${downloadLink}&key=${apiKey}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);

    } catch (err: any) {
      console.error("Video Generation Error:", err);
      if (err.message?.includes("Requested entity was not found") || err.message?.includes("API Key missing")) {
        setError("API Key error. Please go to Settings and save your API Key manually.");
      } else {
        setError("Generation failed. Veo models require a paid billing account and a valid project API key.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `DME_Archi_Video_${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
      
      {/* Configuration Column */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-[2rem] p-6 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col mb-4">
            <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
              <Film className="w-4 h-4 text-indigo-400" />
              1. Image to Motion
            </h3>
            <span className="text-[10px] text-slate-500 font-bold italic">၁။ ဗီဒီယို ပြုလုပ်ရန် ပုံတင်ပါ</span>
          </div>

          <div 
            onClick={() => !sourceImage && fileInputRef.current?.click()}
            className={`aspect-video bg-slate-950/80 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all group relative overflow-hidden ${sourceImage ? 'border-indigo-500/50' : 'border-slate-800 hover:border-indigo-500/40 cursor-pointer'}`}
          >
            {sourceImage ? (
              <>
                <img src={sourceImage} className="w-full h-full object-contain p-2" alt="Source" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setSourceImage(null); }}
                  className="absolute top-2 right-2 p-2 bg-slate-900/80 hover:bg-red-500/20 text-red-400 rounded-xl border border-white/5"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-all">
                  <Upload className="w-7 h-7 text-slate-400 group-hover:text-indigo-400" />
                </div>
                <div className="text-center px-4">
                  <p className="text-[11px] text-slate-300 font-black uppercase tracking-widest">Click to upload Render</p>
                  <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">အဆောက်အဦးပုံ တင်ရန်</p>
                </div>
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase font-black text-slate-500 px-1 flex justify-between">
                <span>Motion Prompt (Optional)</span>
                <span className="text-slate-700">လှုပ်ရှားမှု ပုံစံ</span>
              </label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how the camera should move... (e.g., slow drone sweep right, cinematic tilt up)"
                className="w-full h-24 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase font-black text-slate-500 px-1">Video Aspect Ratio</label>
              <div className="flex bg-slate-950 rounded-xl border border-slate-800 p-1">
                {(['16:9', '9:16'] as const).map(ratio => (
                  <button 
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all ${aspectRatio === ratio ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-300'}`}
                  >
                    {ratio === '16:9' ? 'Landscape (16:9)' : 'Portrait (9:16)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  Video generation utilizes the <strong>Veo 3.1</strong> engine. This requires a <strong>Paid Billing Project</strong>. 
                  Generation typically takes 2-4 minutes.
                </p>
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-400 hover:underline font-bold uppercase tracking-tighter">
                  View Billing Documentation →
                </a>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-red-200 font-medium">{error}</p>
              </div>
            )}

            <button 
              onClick={handleGenerateVideo}
              disabled={isGenerating || !sourceImage}
              className={`w-full py-5 rounded-[2rem] font-black text-[12px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl ${
                isGenerating || !sourceImage 
                ? 'bg-slate-800 text-slate-600 border border-slate-700' 
                : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-500 hover:to-blue-500'
              }`}
            >
              {isGenerating ? <RotateCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {isGenerating ? 'PROCESSING VIDEO...' : 'GENERATE ARCHITECTURAL VIDEO'}
            </button>
          </div>
        </section>
      </div>

      {/* Output Column */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-3xl min-h-[600px] flex flex-col relative overflow-hidden">
          
          {/* Animated Loading State */}
          {isGenerating && (
            <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-12 animate-in fade-in duration-700">
               <div className="relative">
                  <Logo className="w-32 h-32 animate-pulse" />
                  <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full animate-ping"></div>
               </div>
               
               <div className="text-center px-10 max-w-md">
                  <h2 className="text-3xl font-black text-white tracking-[0.3em] uppercase italic mb-2">VEVO <span className="text-indigo-500">ENGINE</span></h2>
                  <div className="h-1 w-48 bg-slate-900 rounded-full overflow-hidden mx-auto mb-6">
                    <div className="h-full bg-indigo-500 animate-[loading_2s_infinite]"></div>
                  </div>
                  <p className="text-[13px] text-indigo-400 font-black uppercase tracking-widest min-h-[1.5em] transition-all duration-500">
                    {LOADING_MESSAGES[loadingMessageIdx]}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium uppercase mt-4 tracking-tighter">
                    Please keep this tab open. Rendering complex architectural geometry takes time.
                  </p>
               </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest">Cinematic Video Result</h3>
              <span className="text-[11px] text-slate-500 font-bold italic">ဗီဒီယို ရလဒ်</span>
            </div>
            {videoUrl && (
              <button 
                onClick={handleDownload}
                className="flex items-center gap-3 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white transition-all shadow-lg"
              >
                <Download className="w-4 h-4" /> Download MP4
              </button>
            )}
          </div>

          <div className="flex-1 bg-slate-950/80 border border-slate-800/30 rounded-[2rem] flex items-center justify-center relative overflow-hidden shadow-inner group">
             {videoUrl ? (
               <video 
                 src={videoUrl} 
                 controls 
                 autoPlay 
                 loop 
                 className={`w-full h-full ${aspectRatio === '16:9' ? 'object-contain' : 'object-cover'} rounded-2xl animate-in zoom-in-95 duration-1000`} 
               />
             ) : !isGenerating && (
               <div className="text-center opacity-20">
                  <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-slate-800">
                    <Film className="w-10 h-10 text-slate-600" />
                  </div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Cinematic Buffer</p>
               </div>
             )}
          </div>

          <div className="mt-8 p-6 bg-slate-900/50 border border-slate-800/50 rounded-3xl flex items-center justify-center gap-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
              <span>1080P HIGH DEFINITION</span>
            </div>
            <div className="w-px h-3 bg-slate-800"></div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
              <span>TEMPORAL CONSISTENCY V3</span>
            </div>
            <div className="w-px h-3 bg-slate-800"></div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
              <span>ARCHI-READY MOTION</span>
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

export default VideoSection;
