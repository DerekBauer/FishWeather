
import React from 'react';

interface MoonSkyLocationProps {
  azimuth: number;
  altitude: number;
}

export const MoonSkyLocation: React.FC<MoonSkyLocationProps> = ({ azimuth, altitude }) => {
  // SVG Dimensions
  const width = 400;
  const height = 150;
  const horizonY = 110; // Y coordinate for 0° altitude
  const skyHeight = 90; // Pixels from horizon to top of chart (90°)

  // Calculate moon coordinates
  // X: Map 0-360 azimuth to 0-width
  const moonX = (azimuth / 360) * width;
  
  // Y: Map altitude to vertical position
  // 90° altitude = horizonY - skyHeight
  // 0° altitude = horizonY
  // -altitude for below horizon
  const moonY = horizonY - (altitude / 90) * skyHeight;

  const isBelowHorizon = altitude < 0;

  // Markers for compass directions
  const directions = [
    { label: 'N', deg: 0 },
    { label: 'E', deg: 90 },
    { label: 'S', deg: 180 },
    { label: 'W', deg: 270 },
    { label: 'N', deg: 360 },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-800/50 rounded-2xl border border-indigo-500/20 shadow-lg relative group overflow-hidden h-full">
      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">Horizon Reference Chart</div>
      
      <div className="relative w-full aspect-[8/3]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <filter id="moonGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Sky Background */}
          <rect x="0" y="0" width={width} height={horizonY} fill="url(#skyGradient)" rx="4" />

          {/* Altitude Grid Lines */}
          {[30, 60].map(alt => (
            <g key={alt}>
              <line 
                x1="0" y1={horizonY - (alt/90)*skyHeight} 
                x2={width} y2={horizonY - (alt/90)*skyHeight} 
                stroke="white" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.1" 
              />
              <text x="2" y={horizonY - (alt/90)*skyHeight - 2} fontSize="6" className="fill-slate-600 font-bold">{alt}°</text>
            </g>
          ))}

          {/* Azimuth Markers & Labels */}
          {directions.map((dir, i) => {
            const x = (dir.deg / 360) * width;
            return (
              <g key={i}>
                <line x1={x} y1="0" x2={x} y2={horizonY} stroke="white" strokeWidth="0.5" opacity="0.1" />
                <text x={x} y={height - 10} textAnchor="middle" fontSize="10" className="fill-slate-400 font-black tracking-tighter">{dir.label}</text>
                <text x={x} y={height - 2} textAnchor="middle" fontSize="6" className="fill-slate-600 font-bold">{dir.deg}°</text>
              </g>
            );
          })}

          {/* The Horizon / Ground */}
          <rect x="0" y={horizonY} width={width} height={height - horizonY} fill="#020617" />
          <line x1="0" y1={horizonY} x2={width} y2={horizonY} stroke="#334155" strokeWidth="2" />

          {/* The Moon Marker */}
          <g className="transition-all duration-1000 ease-out">
            {/* Connection line to horizon if above */}
            {!isBelowHorizon && (
              <line 
                x1={moonX} y1={horizonY} 
                x2={moonX} y2={moonY} 
                stroke="white" strokeWidth="1" strokeDasharray="2 2" opacity="0.2" 
              />
            )}
            
            {/* The Moon Orb */}
            <circle 
              cx={moonX} cy={moonY} r="6" 
              className={`${isBelowHorizon ? 'fill-slate-800 opacity-40' : 'fill-white'} drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]`} 
              filter={!isBelowHorizon ? "url(#moonGlow)" : ""}
            />
            
            {/* Indicator label */}
            <g transform={`translate(${moonX}, ${moonY - 12})`}>
                <text textAnchor="middle" fontSize="8" className={`${isBelowHorizon ? 'fill-slate-600' : 'fill-indigo-300 font-bold'} uppercase tracking-tighter`}>
                  {isBelowHorizon ? 'Below Horizon' : 'Moon'}
                </text>
            </g>
          </g>
        </svg>
      </div>

      <div className="mt-4 w-full">
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <span className="text-slate-500 block uppercase text-[8px] font-black tracking-widest">Azimuth</span>
            <span className="text-white font-mono font-bold text-sm">{azimuth}°</span>
          </div>
          <div className="w-px h-6 bg-slate-700"></div>
          <div className="text-center">
            <span className="text-slate-500 block uppercase text-[8px] font-black tracking-widest">Altitude</span>
            <span className={`font-mono font-bold text-sm ${isBelowHorizon ? 'text-slate-500' : 'text-emerald-400'}`}>{altitude}°</span>
          </div>
        </div>
      </div>
    </div>
  );
};
