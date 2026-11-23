import type { ProgressState } from '../types/matura';
import { validateImportedProgress } from './evaluator';

const PROGRESS_STORAGE_KEY = 'maturalab_progress_v1';
const THEME_STORAGE_KEY = 'maturalab_theme';

export type ThemeMode = 'light' | 'dark';

export function createEmptyProgress(): ProgressState {
  return {
    version: 1,
    attempts: {},
    lastActiveAt: new Date().toISOString(),
  };
}

export function loadProgress(validTaskIds: Set<number>): ProgressState {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return createEmptyProgress();
    const parsed = JSON.parse(raw);
    return validateImportedProgress(parsed, validTaskIds) ?? createEmptyProgress();
  } catch {
    return createEmptyProgress();
  }
}

export function saveProgress(state: ProgressState): void {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota/storage errors in restricted contexts
  }
}

export function loadTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  } catch {
    // Default to light
  }
  return 'light';
}

export function applyTheme(mode: ThemeMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Ignore storage errors
  }
  if (mode === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function exportProgressToJson(state: ProgressState): string {
  return JSON.stringify(state, null, 2);
}
