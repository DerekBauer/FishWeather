
import React from 'react';
import { Navigation } from 'lucide-react';

interface WindCompassProps {
  direction: number; // degrees
  cardinal: string;
  speed: number;
  gust: number;
}

export const WindCompass: React.FC<WindCompassProps> = ({ direction, cardinal, speed, gust }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-800/50 rounded-2xl border border-indigo-500/20 shadow-lg relative overflow-hidden group">
      {/* Compass Ring */}
      <div className="relative w-32 h-32 rounded-full border-2 border-slate-700/50 flex items-center justify-center">
        <div className="absolute top-1 text-[10px] font-bold text-slate-500">N</div>
        <div className="absolute right-1 text-[10px] font-bold text-slate-500">E</div>
        <div className="absolute bottom-1 text-[10px] font-bold text-slate-500">S</div>
        <div className="absolute left-1 text-[10px] font-bold text-slate-500">W</div>
        
        {/* Rotating Arrow */}
        <div 
          className="transition-transform duration-1000 ease-out flex items-center justify-center"
          style={{ transform: `rotate(${direction}deg)` }}
        >
          <Navigation className="w-8 h-8 text-indigo-400 fill-indigo-400/20 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
        </div>
      </div>

      <div className="mt-4 text-center">
        <div className="text-2xl font-bold text-white leading-none">
          {speed} <span className="text-xs text-slate-500 uppercase">mph</span>
        </div>
        <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">
          {cardinal} • {direction}°
        </div>
        <div className="mt-2 flex items-center gap-2 justify-center bg-slate-900/50 px-3 py-1 rounded-full border border-white/5">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Gusts</span>
          <span className="text-xs font-bold text-rose-400">{gust} mph</span>
        </div>
      </div>
      
      {/* Decorative wind lines background effect */}
      <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <path d="M10 20 Q 50 10 90 20" stroke="white" strokeWidth="2" fill="none" />
          <path d="M10 50 Q 50 40 90 50" stroke="white" strokeWidth="2" fill="none" />
          <path d="M10 80 Q 50 70 90 80" stroke="white" strokeWidth="2" fill="none" />
        </svg>
      </div>
    </div>
  );
};
