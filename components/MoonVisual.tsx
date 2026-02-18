
import React from 'react';

interface MoonVisualProps {
  phase: string;
  illumination: number;
}

export const MoonVisual: React.FC<MoonVisualProps> = ({ phase, illumination }) => {
  // Simple heuristic mapping for icon representation
  const getPhaseIcon = () => {
    const p = phase.toLowerCase();
    if (p.includes('new')) return '🌑';
    if (p.includes('waxing crescent')) return '🌒';
    if (p.includes('first quarter')) return '🌓';
    if (p.includes('waxing gibbous')) return '🌔';
    if (p.includes('full')) return '🌕';
    if (p.includes('waning gibbous')) return '🌖';
    if (p.includes('last quarter')) return '🌗';
    if (p.includes('waning crescent')) return '🌘';
    return '🌙';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-800/50 rounded-2xl border border-indigo-500/20 shadow-lg">
      <div className="text-7xl mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-pulse">
        {getPhaseIcon()}
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-indigo-200 uppercase tracking-wider">{phase}</h3>
        <p className="text-sm text-slate-400 mt-1">{illumination}% Illumination</p>
      </div>
    </div>
  );
};
