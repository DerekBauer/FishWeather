
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  description?: string;
  trend?: 'rising' | 'falling' | 'steady';
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, icon, description, trend }) => {
  const renderTrend = () => {
    if (!trend) return null;
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-emerald-400" title="Rising" />;
      case 'falling':
        return <TrendingDown className="w-4 h-4 text-rose-400" title="Falling" />;
      case 'steady':
        return <Minus className="w-4 h-4 text-slate-500" title="Steady" />;
      default:
        return null;
    }
  };

  return (
    <div className="glass p-5 rounded-2xl flex flex-col gap-3 transition-all hover:scale-[1.02] hover:bg-slate-800/80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            {icon}
          </div>
          <span className="text-sm font-medium text-slate-400 uppercase tracking-tight">{label}</span>
        </div>
        {renderTrend()}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-white">{value}</span>
        {unit && <span className="text-sm font-medium text-slate-500">{unit}</span>}
      </div>
      {description && <p className="text-xs text-slate-500 italic">{description}</p>}
    </div>
  );
};
