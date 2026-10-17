import React from 'react';

/**
 * Origin UI inspired Segmented Tabs / Pill Filter
 * 100% Tailwind CSS with count pills and smooth transitions
 */
export const Tabs = ({
  tabs, // [{ id: string, label: string, count?: number | string, icon?: LucideIcon }]
  activeTab,
  onChange,
  variant = 'pills', // 'pills' | 'segmented'
  className = ''
}) => {
  if (variant === 'segmented') {
    return (
      <div className={`inline-flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 gap-1 select-none ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {Icon && <Icon className={`size-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-blue-700/60 text-blue-100' : 'bg-slate-900 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default 'pills' variant
  return (
    <div className={`inline-flex items-center gap-1.5 flex-wrap ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              isActive
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-400 font-semibold shadow-sm'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {Icon && <Icon className={`size-3.5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-blue-500/25 text-blue-300' : 'bg-slate-800 text-slate-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
