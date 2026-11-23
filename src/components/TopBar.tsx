import React from 'react';
import { Moon, Sun } from 'lucide-react';
import type { ThemeMode } from '../utils/storage';

export type ActiveView = 'dashboard' | 'practice' | 'catalog' | 'exam';

interface TopBarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeView,
  onNavigate,
  theme,
  onToggleTheme,
}) => {
  const navItems: { id: ActiveView; label: string }[] = [
    { id: 'dashboard', label: 'Pulpit' },
    { id: 'catalog', label: 'Baza zadań' },
    { id: 'exam', label: 'Tryb arkusza' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 sm:gap-8 px-3 sm:px-6 h-14">
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 whitespace-nowrap shrink-0 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-md"
        >
          MaturaLab
        </button>

        <nav aria-label="Nawigacja główna" className="flex items-center gap-3 sm:gap-7">
          {navItems.map((item) => {
            const isActive =
              activeView === item.id ||
              (item.id === 'catalog' && activeView === 'practice');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1.5 text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-md ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[14px] sm:-bottom-[13px] h-0.5 bg-indigo-600 dark:bg-indigo-400"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'}
            title={theme === 'dark' ? 'Tryb jasny' : 'Tryb ciemny'}
            className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
