import React, { useMemo } from 'react';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  FileText,
} from 'lucide-react';
import { CKE_SESSION_GROUPS } from '../data/ckeSheets';
import type { CkeSheet, MaturaLevel, MaturaTask, ProgressMap } from '../types/matura';
import { calculateCkeSheetStats, formatPolishTasksCount } from '../utils/evaluator';

interface CkeSheetsViewProps {
  sheets: CkeSheet[];
  tasks: MaturaTask[];
  attempts: ProgressMap;
  selectedLevel: MaturaLevel;
  onChangeLevel: (level: MaturaLevel) => void;
  onStartSheet: (sheetId: string) => void;
}

export const CkeSheetsView: React.FC<CkeSheetsViewProps> = ({
  sheets,
  tasks,
  attempts,
  selectedLevel,
  onChangeLevel,
  onStartSheet,
}) => {
  const sheetStats = useMemo(
    () => calculateCkeSheetStats(sheets, tasks, attempts, selectedLevel),
    [sheets, tasks, attempts, selectedLevel]
  );

  const ppSheetCount = useMemo(
    () => sheets.filter((s) => s.level === 'podstawa').length,
    [sheets]
  );
  const prSheetCount = useMemo(
    () => sheets.filter((s) => s.level === 'rozszerzenie').length,
    [sheets]
  );

  return (
    <div className="space-y-8">
      {/* Header + PP / PR Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>Formuła 2023 · CKE</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Arkusze maturalne CKE
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Oficjalne arkusze maturalne z matematyki wyłącznie w Formule 2023 (lata 2023–2026) z
            podziałem na sesje i możliwością bezpośredniego rozwiązywania zadań w aplikacji.
          </p>
        </div>

        <div
          role="group"
          aria-label="Poziom arkuszy CKE"
          className="inline-flex flex-wrap sm:flex-nowrap items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-1 shadow-xs self-start lg:self-auto shrink-0"
        >
          <button
            type="button"
            aria-pressed={selectedLevel === 'podstawa'}
            onClick={() => onChangeLevel('podstawa')}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
              selectedLevel === 'podstawa'
                ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Poziom Podstawowy (PP)</span>
            <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
              {ppSheetCount}
            </span>
          </button>

          <button
            type="button"
            aria-pressed={selectedLevel === 'rozszerzenie'}
            onClick={() => onChangeLevel('rozszerzenie')}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
              selectedLevel === 'rozszerzenie'
                ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Poziom Rozszerzony (PR)</span>
            <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
              {prSheetCount}
            </span>
          </button>
        </div>
      </div>

      {/* Session Groups */}
      <div className="space-y-8">
        {CKE_SESSION_GROUPS.map((group) => {
          const groupSheets = sheetStats.filter((s) => s.sheet.session === group.id);

          return (
            <section key={group.id} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    {group.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {group.description}
                  </p>
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
                  Liczba arkuszy: {groupSheets.length}
                </span>
              </div>

              {groupSheets.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-6 text-sm text-slate-600 dark:text-slate-400 shadow-xs">
                  W terminie poprawkowym (sierpień) CKE przeprowadza egzamin maturalny z matematyki
                  wyłącznie na poziomie podstawowym (PP). Przełącz poziom powyżej na{' '}
                  <button
                    type="button"
                    onClick={() => onChangeLevel('podstawa')}
                    className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Poziom Podstawowy (PP)
                  </button>
                  , aby zobaczyć arkusze poprawkowe.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupSheets.map(({ sheet, totalTasks, solvedTasks, completionPercent }) => {
                    const isCompleted = totalTasks > 0 && solvedTasks === totalTasks;
                    return (
                      <article
                        key={sheet.id}
                        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between gap-5"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                                {sheet.dateLabel}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{sheet.formula}</span>
                            </div>

                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Ukończono
                              </span>
                            )}
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50 leading-snug">
                            {sheet.title}
                          </h3>

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                W bazie: {formatPolishTasksCount(totalTasks)}
                              </span>
                              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                                {solvedTasks} / {totalTasks} rozwiązanych ({completionPercent}%)
                              </span>
                            </div>

                            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isCompleted ? 'bg-emerald-600' : 'bg-indigo-600'
                                }`}
                                style={{ width: `${completionPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
                          <button
                            type="button"
                            onClick={() => onStartSheet(sheet.id)}
                            disabled={totalTasks === 0}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 px-4 py-2.5 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            <span>Rozwiąż zadania z tego arkusza</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>

                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <a
                              href={sheet.examPdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              <span>Arkusz PDF (CKE)</span>
                              <ExternalLink className="h-3 w-3 opacity-70" />
                            </a>

                            <a
                              href={sheet.keyPdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                              <FileCheck2 className="h-3.5 w-3.5" />
                              <span>Zasady oceniania PDF (CKE)</span>
                              <ExternalLink className="h-3 w-3 opacity-70" />
                            </a>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
