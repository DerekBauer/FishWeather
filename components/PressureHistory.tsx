
import React from 'react';
import { History, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PressureHistoryProps {
  current: number;
  history: {
    past2h: number;
    past6h: number;
    past12h: number;
    past24h: number;
  };
}

export const PressureHistory: React.FC<PressureHistoryProps> = ({ current, history }) => {
  const items = [
    { label: '2h ago', value: history.past2h },
    { label: '6h ago', value: history.past6h },
    { label: '12h ago', value: history.past12h },
    { label: '24h ago', value: history.past24h },
  ];

  const getDelta = (past: number) => {
    const delta = current - past;
    const rounded = Math.round(delta * 100) / 100;
    if (rounded > 0) return { icon: <TrendingUp className="w-3 h-3 text-emerald-400" />, text: `+${rounded}`, color: 'text-emerald-400' };
    if (rounded < 0) return { icon: <TrendingDown className="w-3 h-3 text-rose-400" />, text: `${rounded}`, color: 'text-rose-400' };
    return { icon: <Minus className="w-3 h-3 text-slate-500" />, text: '0.00', color: 'text-slate-500' };
  };

  return (
    <div className="glass p-5 rounded-2xl border border-indigo-500/10 h-full">
      <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
        <History className="w-4 h-4 text-indigo-400" />
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pressure Trends</h4>
      </div>
      <div className="space-y-4">
        {items.map((item, idx) => {
          const delta = getDelta(item.value);
          return (
            <div key={idx} className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block leading-tight">{item.label}</span>
                <span className="text-sm font-mono font-bold text-white">{item.value.toFixed(2)} <span className="text-[10px] text-slate-600">inHg</span></span>
              </div>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/50 border border-white/5 ${delta.color}`}>
                {delta.icon}
                <span className="text-[10px] font-black">{delta.text}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-white/5">
        <p className="text-[9px] text-slate-600 font-medium italic leading-tight">
          Historical data synthesized from regional atmospheric reporting stations.
        </p>
      </div>
    </div>
  );
};
