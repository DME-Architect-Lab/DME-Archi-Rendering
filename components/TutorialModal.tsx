
import React from 'react';
import { X, BookOpen, Layers, Film, Key, Wand2, Globe } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl h-[85vh] flex flex-col relative shadow-2xl z-10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          <h2 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            DME Archi အသုံးပြုနည်းလမ်းညွှန်
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          
          {/* Section 1: Introduction */}
          <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800">
             <h3 className="text-indigo-400 font-bold text-sm uppercase tracking-wider mb-2">မိတ်ဆက်</h3>
             <p className="text-slate-300 text-sm leading-relaxed font-medium">
               DME Archi Rendering App သည် ဉာဏ်ရည်တု (AI) နည်းပညာကို အသုံးပြု၍ ဗိသုကာ ဒီဇိုင်းများကို လျင်မြန်စွာ ပုံဖော်ပေးနိုင်သော စနစ်ဖြစ်သည်။ 
               ပုံကြမ်း (Sketch) များမှသည် လက်တွေ့ဆန်သော ပုံများ (Photorealistic Renders) အဖြစ်သို့ အချိန်တိုအတွင်း ပြောင်းလဲပေးနိုင်ပါသည်။
             </p>
          </div>

          {/* Section 2: Rendering Basics */}
          <div className="space-y-4">
             <h3 className="text-white font-bold text-base flex items-center gap-2">
               <Wand2 className="w-5 h-5 text-amber-400" />
               ၁။ Render ပြုလုပ်နည်း (အခြေခံ)
             </h3>
             <ul className="list-disc list-inside space-y-3 text-slate-400 text-sm ml-2">
               <li>
                 <strong className="text-slate-200">ပုံတင်ခြင်း (Upload):</strong> "Upload Source Image" နေရာတွင် မိမိ Render ထုတ်လိုသော Sketch သို့မဟုတ် 3D Model Screenshot ကို တင်ပါ။
               </li>
               <li>
                 <strong className="text-slate-200">Mode ရွေးချယ်ခြင်း:</strong> Exterior (အပြင်ပိုင်း) သို့မဟုတ် Interior (အတွင်းခန်း) ကို ရွေးချယ်ပါ။
               </li>
               <li>
                 <strong className="text-slate-200">ဖော်ပြချက် (Prompt):</strong> "Auto Detect" ကို နှိပ်၍ AI ကို အလိုအလျောက် ပုံဖတ်ခိုင်းနိုင်သလို၊ မိမိလိုချင်သော ပုံစံကိုလည်း စာဖြင့် ရေးသားနိုင်ပါသည်။ (ဥပမာ - Modern house with glass facade)
               </li>
               <li>
                 <strong className="text-slate-200">Generate:</strong> ဆက်တင်များ ချိန်ညှိပြီးပါက "Generate Render" ခလုတ်ကို နှိပ်ပါ။
               </li>
             </ul>
          </div>

          {/* Section 3: Floorplan to 3D */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
             <h3 className="text-white font-bold text-base flex items-center gap-2">
               <Layers className="w-5 h-5 text-blue-400" />
               ၂။ Floorplan မှ 3D ပြောင်းနည်း
             </h3>
             <p className="text-slate-400 text-sm">
               2D ပုံစံ (AutoCAD/Sketch) များကို 3D အဖြစ်ပြောင်းလဲရန် <strong>"Floorplan to 3D"</strong> mode ကို အသုံးပြုပါ။
             </p>
             <div className="bg-slate-800/50 p-4 rounded-xl text-xs text-slate-300 border border-slate-700">
               <span className="text-indigo-400 font-bold">အကြံပြုချက်:</span> ပုံတင်ပြီးပါက View Mode တွင် "Isometric 3D" ကို ရွေးချယ်ပါက အခန်းဖွဲ့စည်းပုံများကို အပေါ်စီးမှ 3D အနေအထားဖြင့် မြင်တွေ့ရမည်ဖြစ်သည်။
             </div>
          </div>

          {/* Section 4: Video Generation */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
             <h3 className="text-white font-bold text-base flex items-center gap-2">
               <Film className="w-5 h-5 text-pink-400" />
               ၃။ Video ပြုလုပ်နည်း (Image to Video)
             </h3>
             <p className="text-slate-400 text-sm">
               "Image to Video" Tab သို့သွားပါ။ Render ထုတ်ပြီးသားပုံကို Upload လုပ်ပါ။
             </p>
             <ul className="list-disc list-inside space-y-2 text-slate-400 text-sm ml-2">
               <li>Camera လှုပ်ရှားလိုသည့် ပုံစံကို စာဖြင့်ရေးပါ (ဥပမာ - Drone view moving forward)။</li>
               <li>Video ထုတ်ရန်အတွက် <strong>Paid API Key</strong> လိုအပ်ပါသည်။</li>
             </ul>
          </div>

          {/* Section 5: Utilities */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
             <h3 className="text-white font-bold text-base flex items-center gap-2">
               <Globe className="w-5 h-5 text-green-400" />
               ၄။ အခြားကိရိယာများ (Utilities)
             </h3>
             <p className="text-slate-400 text-sm">
               <strong>Google Map to 3D:</strong> Google Earth/Map Screenshot များကို 3D မြေမျက်နှာသွင်ပြင်အဖြစ် ပြောင်းလဲပေးသည်။ Masterplan ရေးဆွဲရာတွင် အသုံးဝင်သည်။
             </p>
          </div>

          {/* Section 6: API Key */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
             <h3 className="text-white font-bold text-base flex items-center gap-2">
               <Key className="w-5 h-5 text-slate-400" />
               ၅။ API Key ထည့်သွင်းခြင်း
             </h3>
             <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
               <p className="text-amber-200 text-sm mb-2">
                 High Quality (4K/8K) နှင့် Video များပြုလုပ်ရန် Google Gemini API Key လိုအပ်ပါသည်။
               </p>
               <ol className="list-decimal list-inside text-slate-400 text-xs space-y-1">
                 <li>ညာဘက်အပေါ်ထောင့်ရှိ Setting (ဂီယာပုံ) ကို နှိပ်ပါ။</li>
                 <li>"Manual API Key Entry" တွင် မိမိ၏ Key ကို ထည့်သွင်းပါ။</li>
                 <li>Save ကို နှိပ်ပါ။</li>
               </ol>
             </div>
          </div>

        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50 text-center">
           <p className="text-[10px] text-slate-500">© 2024 DME Archi Rendering Help Center</p>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
