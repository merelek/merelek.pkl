import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  RotateCcw,
  Shuffle,
  XCircle,
} from 'lucide-react';
import type { MaturaTask, TaskAttempt } from '../types/matura';
import { checkTaskAnswer } from '../utils/evaluator';
import { MathText } from './MathText';

interface TaskSolverViewProps {
  tasksQueue: MaturaTask[];
  currentTaskId: number;
  contextTitle: string;
  attempts: Record<number, TaskAttempt>;
  onSelectTask: (taskId: number) => void;
  onSubmitAnswer: (task: MaturaTask, userAnswer: string, isCorrect: boolean) => void;
  onPickRandom: () => void;
  onBackToDashboard: () => void;
}

export const TaskSolverView: React.FC<TaskSolverViewProps> = ({
  tasksQueue,
  currentTaskId,
  contextTitle,
  attempts,
  onSelectTask,
  onSubmitAnswer,
  onPickRandom,
  onBackToDashboard,
}) => {
  const currentIndex = tasksQueue.findIndex((t) => t.id === currentTaskId);
  const task = currentIndex >= 0 ? tasksQueue[currentIndex] : tasksQueue[0];

  const [selectedOption, setSelectedOption] = useState<string>('');
  const [openInput, setOpenInput] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [submittedResult, setSubmittedResult] = useState<{
    userAnswer: string;
    isCorrect: boolean;
  } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solutionUnlockedByRequest, setSolutionUnlockedByRequest] = useState(false);

  const savedAttempt = task ? attempts[task.id] : undefined;

  // Reset local interactive state when switching to a different task
  useEffect(() => {
    if (!task) return;
    const existing = attempts[task.id];
    if (existing) {
      setSelectedOption(task.type === 'closed' ? existing.userAnswer : '');
      setOpenInput(task.type === 'open' ? existing.userAnswer : '');
      setSubmittedResult({
        userAnswer: existing.userAnswer,
        isCorrect: existing.isCorrect,
      });
    } else {
      setSelectedOption('');
      setOpenInput('');
      setSubmittedResult(null);
    }
    setValidationError('');
    setShowHint(false);
    setShowSolution(false);
    setSolutionUnlockedByRequest(false);
  }, [task?.id]);

  if (!task) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-xs space-y-4">
        <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
          Brak zadań w tym zestawie
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Wszystkie błędne zadania zostały już poprawnie rozwiązane lub wybrana lista jest pusta.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Wróć do pulpitu
          </button>
        </div>
      </div>
    );
  }

  const prevTask = currentIndex > 0 ? tasksQueue[currentIndex - 1] : null;
  const nextTask =
    currentIndex >= 0 && currentIndex < tasksQueue.length - 1
      ? tasksQueue[currentIndex + 1]
      : null;

  const isSolutionUnlocked = Boolean(submittedResult) || solutionUnlockedByRequest;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawAnswer = task.type === 'closed' ? selectedOption : openInput;
    if (!rawAnswer.trim()) {
      setValidationError(
        task.type === 'closed'
          ? 'Wybierz jedną z odpowiedzi A, B, C lub D.'
          : 'Wpisz wynik przed sprawdzeniem odpowiedzi.'
      );
      return;
    }

    setValidationError('');
    const isCorrect = checkTaskAnswer(task, rawAnswer);
    const normalizedDisplay = task.type === 'closed' ? rawAnswer : rawAnswer.trim();
    setSubmittedResult({ userAnswer: normalizedDisplay, isCorrect });
    onSubmitAnswer(task, normalizedDisplay, isCorrect);
  };

  const handleRetry = () => {
    setSubmittedResult(null);
    setSelectedOption('');
    setOpenInput('');
    setValidationError('');
  };

  return (
    <div className="space-y-6">
      {/* Top navigation & context bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Pulpit
          </button>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {contextTitle}
          </span>
          <span className="text-sm text-slate-400 dark:text-slate-500 tabular-nums">
            ({currentIndex + 1} / {tasksQueue.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPickRandom}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <Shuffle className="h-4 w-4" />
            Losowe
          </button>
          <button
            type="button"
            disabled={!prevTask}
            onClick={() => prevTask && onSelectTask(prevTask.id)}
            aria-label="Poprzednie zadanie"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Poprzednie
          </button>
          <button
            type="button"
            disabled={!nextTask}
            onClick={() => nextTask && onSelectTask(nextTask.id)}
            aria-label="Następne zadanie"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0"
          >
            Następne
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Task Card */}
      <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Clean unboxed metadata header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
              Zadanie #{task.id}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {task.topicName}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{task.points} pkt</span>
            <span aria-hidden="true">·</span>
            <span>{task.type === 'closed' ? 'Zadanie zamknięte' : 'Zadanie otwarte'}</span>
          </div>

          {savedAttempt && (
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                savedAttempt.isCorrect
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-rose-700 dark:text-rose-400'
              }`}
            >
              {savedAttempt.isCorrect ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Rozwiązane poprawnie
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Wymaga poprawy
                </>
              )}
            </span>
          )}
        </div>

        {/* Problem Statement */}
        <div className="text-base sm:text-lg leading-relaxed text-slate-900 dark:text-slate-100">
          <MathText content={task.question} />
        </div>

        {/* Answer Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {task.type === 'closed' && task.options ? (
            <div role="radiogroup" aria-label="Opcje odpowiedzi" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {task.options.map((opt) => {
                const isSelected = selectedOption === opt.key;
                const isCorrectOpt = task.correctAnswer === opt.key;

                let cardStyle =
                  'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 hover:border-indigo-400 dark:hover:border-indigo-500 text-slate-900 dark:text-slate-100';

                if (submittedResult) {
                  if (isCorrectOpt) {
                    cardStyle =
                      'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100';
                  } else if (isSelected && !submittedResult.isCorrect) {
                    cardStyle =
                      'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-950 dark:text-rose-100';
                  } else {
                    cardStyle =
                      'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400';
                  }
                } else if (isSelected) {
                  cardStyle =
                    'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-50 ring-1 ring-indigo-600 dark:ring-indigo-400';
                }

                return (
                  <button
                    key={opt.key}
                    type="button"
                    disabled={Boolean(submittedResult)}
                    onClick={() => {
                      setSelectedOption(opt.key);
                      setValidationError('');
                    }}
                    aria-pressed={isSelected}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${cardStyle}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg font-mono text-sm font-bold shrink-0 ${
                          submittedResult && isCorrectOpt
                            ? 'bg-emerald-600 text-white'
                            : submittedResult && isSelected && !submittedResult.isCorrect
                              ? 'bg-rose-600 text-white'
                              : isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span className="text-base font-medium">
                        <MathText content={opt.label} />
                      </span>
                    </div>

                    {submittedResult && isCorrectOpt && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                    {submittedResult && isSelected && !submittedResult.isCorrect && (
                      <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2 max-w-md">
              <label
                htmlFor={`open-answer-${task.id}`}
                className="block text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                Twoja odpowiedź (liczba lub ułamek)
              </label>
              <input
                id={`open-answer-${task.id}`}
                type="text"
                value={openInput}
                disabled={Boolean(submittedResult)}
                onChange={(e) => {
                  setOpenInput(e.target.value);
                  setValidationError('');
                }}
                placeholder="Wpisz wynik, np. 3 lub 1,75"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 font-mono text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 disabled:opacity-75"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Możesz użyć kropki lub przecinka dziesiętnego; spacje są automatycznie ignorowane.
              </p>
            </div>
          )}

          {validationError && (
            <p role="alert" className="text-sm font-medium text-rose-600 dark:text-rose-400">
              {validationError}
            </p>
          )}

          {/* Immediate Validation Banner */}
          {submittedResult && (
            <div
              role="status"
              className={`flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3.5 ${
                submittedResult.isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 border border-rose-200 dark:border-rose-800'
              }`}
            >
              <div className="flex items-center gap-2.5 text-sm font-semibold">
                {submittedResult.isCorrect ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Poprawna odpowiedź! Zdobywasz {task.points} pkt.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>
                      Błędna odpowiedź. Poprawny wynik to:{' '}
                      <strong className="font-mono">{task.correctAnswer.replace('.', ',')}</strong>
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {!submittedResult ? (
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sprawdź odpowiedź
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="h-4 w-4" />
                Rozwiąż ponownie
              </button>
            )}
          </div>
        </form>

        {/* Hint & Step-by-step Solution Disclosures */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {/* Hint Disclosure */}
          <div>
            <button
              type="button"
              aria-expanded={showHint}
              onClick={() => setShowHint((prev) => !prev)}
              className="flex w-full items-center justify-between gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 px-4 py-3 text-left text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="inline-flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                Wskazówka
              </span>
              {showHint ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showHint && (
              <div className="mt-2 px-4 py-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl">
                <MathText content={task.hint} />
              </div>
            )}
          </div>

          {/* Step-by-step Solution Disclosure */}
          <div>
            {isSolutionUnlocked ? (
              <>
                <button
                  type="button"
                  aria-expanded={showSolution}
                  onClick={() => setShowSolution((prev) => !prev)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 px-4 py-3 text-left text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    Pokaż pełne rozwiązanie krok po kroku
                  </span>
                  {showSolution ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {showSolution && (
                  <ol className="mt-2 space-y-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 p-4 sm:p-5 text-sm leading-relaxed text-slate-800 dark:text-slate-200 list-decimal list-inside">
                    {task.solutionSteps.map((step, index) => (
                      <li key={index} className="leading-relaxed">
                        <MathText content={step} />
                      </li>
                    ))}
                  </ol>
                )}
              </>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 px-4 py-3">
                <span className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <BookOpen className="h-4 w-4 text-slate-400" />
                  Pełne rozwiązanie odblokuje się po udzieleniu odpowiedzi.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSolutionUnlockedByRequest(true);
                    setShowSolution(true);
                  }}
                  className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap shrink-0"
                >
                  Pokaż pełne rozwiązanie krok po kroku
                </button>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};
