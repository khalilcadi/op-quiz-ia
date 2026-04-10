import { useState } from 'react';
import type { ButtonOption } from '../types';

interface ButtonGroupProps {
  options: ButtonOption[];
  mode: 'single' | 'multi';
  maxSelections?: number;
  onSubmit: (selected: string | string[]) => void;
}

export default function ButtonGroup({ options, mode, maxSelections, onSubmit }: ButtonGroupProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleClick = (option: ButtonOption) => {
    if (mode === 'single') {
      onSubmit(option.value);
      return;
    }

    setSelected((prev) => {
      if (prev.includes(option.value)) {
        return prev.filter((v) => v !== option.value);
      }
      if (maxSelections && prev.length >= maxSelections) {
        return prev;
      }
      return [...prev, option.value];
    });
  };

  const isMaxReached = maxSelections !== undefined && selected.length >= maxSelections;
  const useGrid = options.length <= 4;

  return (
    <div className="flex flex-col gap-2.5 animate-fade-in">
      <div className={useGrid ? 'grid grid-cols-2 gap-2.5' : 'flex flex-col gap-2.5'}>
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          const isDisabled = mode === 'multi' && !isSelected && isMaxReached;

          return (
            <button
              key={option.value}
              onClick={() => handleClick(option)}
              disabled={isDisabled}
              className={`px-4 py-3 rounded-[20px] text-[14px] font-medium border transition-all duration-200 text-left
                ${
                  isSelected
                    ? 'border-accent bg-accent text-white shadow-[0_0_15px_#8b5cf64d]'
                    : 'border-accent bg-transparent text-white hover:bg-[#8b5cf633] hover:shadow-[0_0_15px_#8b5cf64d]'
                }
                ${isDisabled ? 'opacity-30 cursor-not-allowed hover:bg-transparent hover:shadow-none' : 'cursor-pointer'}
              `}
            >
              {option.emoji && <span className="mr-1.5">{option.emoji}</span>}
              {option.label}
            </button>
          );
        })}
      </div>

      {mode === 'multi' && selected.length > 0 && (
        <button
          onClick={() => onSubmit(selected)}
          className="self-end mt-1 px-6 py-2.5 rounded-[20px] text-[14px] font-semibold bg-accent text-white cursor-pointer
            shadow-[0_0_15px_#8b5cf64d] hover:shadow-[0_0_25px_#8b5cf666] transition-all duration-200"
        >
          Valider{maxSelections ? ` (${selected.length}/${maxSelections})` : ` (${selected.length})`}
        </button>
      )}
    </div>
  );
}
