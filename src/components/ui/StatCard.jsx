import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Origin UI inspired StatCard
 * Clean utility-first Tailwind CSS metrics card
 */
export const StatCard = ({
  label,
  value,
  description,
  trend, // { type: 'up' | 'down' | 'neutral', text: string }
  icon: Icon,
  accentColor = '#38bdf8',
  className = ''
}) => {
  return (
    <div className={`p-4 bg-[#0e1422] border border-slate-800/80 rounded-2xl flex flex-col justify-between shadow-xl min-h-[116px] relative overflow-hidden ${className}`}>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-400">
            {label}
          </span>
          {Icon && (
            <div 
              className="size-7 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0"
              style={{ color: accentColor }}
            >
              <Icon size={14} />
            </div>
          )}
        </div>

        <div className="text-2xl font-black font-mono text-slate-100 tracking-tight mb-1.5">
          {value}
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] font-mono min-w-0">
        {trend && (
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 ${
            trend.type === 'up'
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : trend.type === 'down'
              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {trend.type === 'up' && <TrendingUp size={11} />}
            {trend.type === 'down' && <TrendingDown size={11} />}
            {trend.type === 'neutral' && <Minus size={11} />}
            {trend.text}
          </span>
        )}
        <span className="text-slate-500 truncate">
          {description}
        </span>
      </div>
    </div>
  );
};
