
import React from 'react';
import Logo from './Logo';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
      
      <div className="z-10 text-center px-4">
        <div className="flex flex-col items-center mb-6">
          <Logo className="w-24 h-24 mb-4" />
          <h1 className="text-6xl font-black tracking-tight text-white uppercase">
            DME <span className="text-indigo-500 italic">ARCHI</span>
          </h1>
        </div>
        
        <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
          The next generation of AI architectural visualization. 
          Professional tools for rendering, enhancement, and high-fidelity upscaling.
        </p>
        
        <button 
          onClick={onStart}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/25 flex items-center gap-2 mx-auto"
        >
          Start Designing
          <span className="text-xl">→</span>
        </button>
      </div>

      <div className="absolute bottom-10 text-slate-600 text-xs flex flex-col items-center gap-2">
        <div className="flex gap-4">
          <span>Official Partner</span>
          <span>|</span>
          <span>Professional Grade</span>
        </div>
        <p>© 2024 DME ARCHI RENDERING - Advanced AI Suite</p>
      </div>
    </div>
  );
};

export default LandingPage;
