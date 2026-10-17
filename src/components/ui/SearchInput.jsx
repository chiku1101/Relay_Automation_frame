import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * Origin UI inspired Search Input
 * 100% Tailwind CSS with leading icon, trailing clear button, and shortcut badge
 */
export const SearchInput = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  shortcut,
  width = 'w-64',
  className = ''
}) => {
  return (
    <div className={`relative inline-flex items-center ${width.startsWith('w-') ? width : 'w-64'} ${className}`}>
      <div className="absolute left-3 flex items-center pointer-events-none text-slate-500">
        <Search className="size-3.5" />
      </div>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-9 pl-9 pr-9 bg-slate-900/90 border border-slate-800 focus:border-blue-500 focus:bg-slate-900 rounded-lg text-slate-100 placeholder:text-slate-500 text-xs outline-none transition-all"
      />

      {value ? (
        <button
          type="button"
          onClick={() => {
            if (onClear) onClear();
            else if (onChange) onChange({ target: { value: '' } });
          }}
          className="absolute right-2.5 text-slate-500 hover:text-slate-300 transition-colors p-0.5"
          title="Clear search"
        >
          <X className="size-3.5" />
        </button>
      ) : shortcut ? (
        <div className="absolute right-2.5 pointer-events-none flex items-center">
          <kbd className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.2 text-[10px] font-mono text-slate-400">
            {shortcut}
          </kbd>
        </div>
      ) : null}
    </div>
  );
};
