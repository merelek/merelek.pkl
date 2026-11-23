import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  ClipboardList,
  Download,
  RotateCcw,
  Shuffle,
  Trash2,
  Upload,
} from 'lucide-react';
import type {
  LevelFilter,
  OverallStats,
  TopicId,
  TopicMeta,
  TopicStats,
} from '../types/matura';
import { formatPolishTasksCount } from '../utils/evaluator';
import { LevelSegmentedControl } from './LevelSegmentedControl';

interface DashboardViewProps {
  levelFilter: LevelFilter;
  levelCounts: {
    podstawa: number;
    rozszerzenie: number;
    oba: number;
  };
  onChangeLevelFilter: (level: LevelFilter) => void;
  overallStats: OverallStats;
  topicStats: TopicStats[];
  topics: TopicMeta[];
  wrongCount: number;
  onStartRandom: () => void;
  onStartWrongReview: () => void;
  onStartTopic: (topicId: TopicId) => void;
  onStartExam: () => void;
  onExportProgress: () => void;
  onImportProgress: (file: File) => Promise<{ ok: boolean; message: string }>;
  onResetProgress: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  levelFilter,
  levelCounts,
  onChangeLevelFilter,
  overallStats,
  topicStats,
  topics,
  wrongCount,
  onStartRandom,
  onStartWrongReview,
  onStartTopic,
  onStartExam,
  onExportProgress,
  onImportProgress,
  onResetProgress,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await onImportProgress(file);
    setStatusNotice({
      type: result.ok ? 'success' : 'error',
      text: result.message,
    });
    e.target.value = '';
  };

  const handleConfirmReset = () => {
    onResetProgress();
    setConfirmReset(false);
    setStatusNotice({
      type: 'success',
      text: 'Postępy zostały wyzerowane.',
    });
  };

  const levelSubtitle =
    levelFilter === 'podstawa'
      ? 'Matematyka · Poziom podstawowy'
      : levelFilter === 'rozszerzenie'
        ? 'Matematyka · Poziom rozszerzony'
        : 'Matematyka · Poziom podstawowy i rozszerzony';

  return (
    <div className="space-y-8">
      {/* Level Filter Bar at Top of Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Poziom matury
          </span>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Dostosuj zadania, działy i statystyki do wybranego egzaminu
          </p>
        </div>
        <LevelSegmentedControl
          value={levelFilter}
          onChange={onChangeLevelFilter}
          counts={levelCounts}
        />
      </div>

      {/* Hero & Overall Progress Card */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              {levelSubtitle}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Przygotuj się do matury krok po kroku
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Rozwiązuj zadania dział po dziale, sprawdzaj wskazówki oraz pełne rozwiązania
              w zapisie matematycznym i trenuj w trybie arkusza maturalnego.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onStartRandom}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Shuffle className="h-4 w-4" />
              Losowe zadanie
            </button>

            <button
              type="button"
              onClick={onStartWrongReview}
              disabled={wrongCount === 0}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                wrongCount > 0
                  ? 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/70'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="h-4 w-4" />
              Powtórz błędne ({wrongCount})
            </button>

            <button
              type="button"
              onClick={onStartExam}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <ClipboardList className="h-4 w-4" />
              Tryb arkusza
            </button>
          </div>
        </div>

        {/* Overall Progress Bar + Clean Tabular Metrics */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Ogólny postęp nauki
              </span>
              <span className="ml-2 text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                {overallStats.solvedTasks} z {overallStats.totalTasks} zadań sprawdzonych
              </span>
            </div>
            <span
              data-testid="overall-percent"
              className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400 tabular-nums"
            >
              {overallStats.completionPercent}%
            </span>
          </div>

          <div
            role="progressbar"
            aria-valuenow={overallStats.completionPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Ogólny postęp rozwiązanych zadań"
            className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
          >
            <div
              className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500 transition-[width] duration-300"
              style={{ width: `${overallStats.completionPercent}%` }}
            />
          </div>

          <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Poprawne zadania
              </dt>
              <dd className="mt-1 font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {overallStats.correctTasks}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Do poprawy
              </dt>
              <dd className="mt-1 font-mono text-xl font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                {overallStats.wrongTasks}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Skuteczność
              </dt>
              <dd className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {overallStats.solvedTasks > 0 ? `${overallStats.accuracyPercent}%` : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Zdobyte punkty
              </dt>
              <dd className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {overallStats.earnedPoints} / {overallStats.totalPoints}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Topics Grid */}
      <section aria-labelledby="topics-heading" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2
            id="topics-heading"
            className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50"
          >
            Działy tematyczne ({topicStats.length})
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Wybierz dział, aby rozpocząć ćwiczenia
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topicStats.map((stat) => {
            const meta = topics.find((t) => t.id === stat.topicId);
            return (
              <button
                key={stat.topicId}
                type="button"
                onClick={() => onStartTopic(stat.topicId)}
                className="group text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex flex-col justify-between gap-5"
              >
                <div className="space-y-2 w-full">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 min-w-0">
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {stat.topicName}
                      </h3>
                      {stat.extensionOnly && (
                        <p className="text-xs font-semibold text-violet-700 dark:text-violet-400">
                          Rozszerzenie
                        </p>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 mt-1 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                  {meta && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {meta.shortDescription}
                    </p>
                  )}
                </div>

                <div className="space-y-2.5 w-full">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300 tabular-nums">
                    <span>
                      {stat.solvedTasks}/{stat.totalTasks} rozwiązanych
                    </span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">
                      {stat.completionPercent}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-emerald-600 dark:bg-emerald-500 transition-[width] duration-300"
                      style={{ width: `${stat.completionPercent}%` }}
                    />
                  </div>
                  <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    {levelFilter === 'oba' && (
                      <p className="text-slate-600 dark:text-slate-300">
                        {stat.basicTasks > 0 && stat.extensionTasks > 0
                          ? `Podstawa: ${stat.basicTasks} · +${formatPolishTasksCount(stat.extensionTasks)} z rozszerzenia`
                          : stat.extensionOnly
                            ? `Tylko Rozszerzenie · ${formatPolishTasksCount(stat.extensionTasks)}`
                            : `Podstawa · ${formatPolishTasksCount(stat.basicTasks)}`}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <span>Poprawne: {stat.correctTasks}</span>
                      <span aria-hidden="true">·</span>
                      <span>Błędne: {stat.wrongTasks}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Progress Management Section */}
      <section
        aria-labelledby="progress-management-heading"
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h2
              id="progress-management-heading"
              className="text-base font-bold text-slate-900 dark:text-slate-50"
            >
              Zarządzanie postępami
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Dane zapisują się automatycznie w pamięci przeglądarki. Możesz pobrać kopię zapasową JSON lub wczytać zapisany plik.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onExportProgress}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Download className="h-4 w-4" />
              Eksportuj JSON
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleFileChange}
              className="sr-only"
              aria-label="Wybierz plik JSON z postępami"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Upload className="h-4 w-4" />
              Importuj JSON
            </button>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 px-4 py-2 text-sm font-medium text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                <Trash2 className="h-4 w-4" />
                Resetuj postępy
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-rose-700 dark:text-rose-300">
                  Wyzerować?
                </span>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="rounded-xl bg-rose-600 hover:bg-rose-700 px-3 py-2 text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0"
                >
                  Potwierdź reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                >
                  Anuluj
                </button>
              </div>
            )}
          </div>
        </div>

        {statusNotice && (
          <p
            role="status"
            className={`mt-4 text-sm font-medium ${
              statusNotice.type === 'success'
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-rose-700 dark:text-rose-400'
            }`}
          >
            {statusNotice.text}
          </p>
        )}
      </section>
    </div>
  );
};
