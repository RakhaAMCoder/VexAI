
import React from 'react';
import { RATIOS } from '../constants';
import { AspectRatio } from '../types';

interface RatioPickerProps {
  selected: AspectRatio;
  onSelect: (ratio: AspectRatio) => void;
}

const RatioPicker: React.FC<RatioPickerProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {RATIOS.map((r) => (
        <button
          key={r.value}
          onClick={() => onSelect(r.value)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all
            ${selected === r.value 
              ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/20' 
              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20'
            }
          `}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={r.icon} />
          </svg>
          <span className="flex flex-col items-start leading-none">
            <span>{r.label}</span>
            <span className="text-[9px] opacity-60 font-bold">{r.value}</span>
          </span>
        </button>
      ))}
    </div>
  );
};

export default RatioPicker;
