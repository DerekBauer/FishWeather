
import React from 'react';
import { ArrowUp, ArrowDown, MapPin } from 'lucide-react';
import { TideEvent } from '../types';

interface TideDisplayProps {
  station: string;
  events: TideEvent[];
}

export const TideDisplay: React.FC<TideDisplayProps> = ({ station, events }) => {
  if (!events || events.length === 0) return null;

  return (
    <div className="glass p-6 rounded-2xl border border-blue-500/20 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 10a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9H3m9 9a9 9 0 01-9-9" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Coastal Tide Data</h3>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
              <MapPin className="w-3 h-3" /> {station}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {events.map((event, i) => (
          <div key={i} className="flex flex-col items-center p-3 rounded-xl bg-slate-900/50 border border-white/5 transition-transform hover:scale-[1.05]">
            <div className={`mb-2 p-1.5 rounded-full ${event.type === 'High' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {event.type === 'High' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            </div>
            <span className="text-[10px] text-slate-500 uppercase font-bold mb-1">{event.type} Tide</span>
            <span className="text-sm font-bold text-white mb-1">{event.time}</span>
            <span className="text-xs font-medium text-slate-400">{event.height}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
