import React from 'react';
import type { LevelFilter } from '../types/matura';

interface LevelSegmentedControlProps {
  value: LevelFilter;
  onChange: (level: LevelFilter) => void;
  counts?: {
    podstawa: number;
    rozszerzenie: number;
    oba: number;
  };
}

export const LevelSegmentedControl: React.FC<LevelSegmentedControlProps> = ({
  value,
  onChange,
  counts,
}) => {
  const options: { id: LevelFilter; label: string; count?: number }[] = [
    { id: 'podstawa', label: 'Podstawa', count: counts?.podstawa },
    { id: 'rozszerzenie', label: 'Rozszerzenie', count: counts?.rozszerzenie },
    { id: 'oba', label: 'Oba (Wszystkie)', count: counts?.oba },
  ];

  return (
    <div
      role="group"
      aria-label="Wybór poziomu matury"
      className="inline-flex flex-wrap items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 p-1 border border-slate-200 dark:border-slate-700/80"
    >
      {options.map((opt) => {
        const isActive = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(opt.id)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
              isActive
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                className={`font-mono text-xs tabular-nums ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                ({opt.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
