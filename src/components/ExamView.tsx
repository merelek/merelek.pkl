import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Flag,
  Play,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import type { ExamResult, MaturaTask } from '../types/matura';
import { createExamQuestions, formatTimer, scoreExam } from '../utils/evaluator';
import { MathText } from './MathText';

interface ExamViewProps {
  allTasks: MaturaTask[];
  onRecordExamResults: (result: ExamResult) => void;
  onBackToDashboard: () => void;
}

const EXAM_QUESTION_COUNT = 10;
const EXAM_DURATION_SECONDS = 30 * 60; // 30 minut

export const ExamView: React.FC<ExamViewProps> = ({
  allTasks,
  onRecordExamResults,
  onBackToDashboard,
}) => {
  const [phase, setPhase] = useState<'intro' | 'running' | 'summary'>('intro');
  const [questions, setQuestions] = useState<MaturaTask[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(EXAM_DURATION_SECONDS);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [expandedSolutions, setExpandedSolutions] = useState<Record<number, boolean>>({});

  const startNewExam = () => {
    const picked = createExamQuestions(allTasks, EXAM_QUESTION_COUNT);
    setQuestions(picked);
    setCurrentIdx(0);
    setAnswers({});
    setRemainingSeconds(EXAM_DURATION_SECONDS);
    setConfirmFinish(false);
    setResult(null);
    setExpandedSolutions({});
    setPhase('running');
  };

  const finishExam = (secondsLeft: number) => {
    const elapsed = Math.max(1, EXAM_DURATION_SECONDS - secondsLeft);
    const computed = scoreExam(questions, answers, elapsed);
    setResult(computed);
    setPhase('summary');
    setConfirmFinish(false);
    onRecordExamResults(computed);
  };

  useEffect(() => {
    if (phase !== 'running') return;
    const interval = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [phase]);

  // Auto-submit when timer hits zero
  useEffect(() => {
    if (phase === 'running' && remainingSeconds === 0 && questions.length > 0) {
      finishExam(0);
    }
  }, [phase, remainingSeconds]);

  if (phase === 'intro') {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            Symulacja maturalna
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Tryb mini-arkusza maturalnego
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Sprawdź swoją gotowość w warunkach zbliżonych do egzaminu. Wylosujesz zestaw 10 zadań z różnych działów, bez podpowiedzi w trakcie rozwiązywania.
          </p>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-slate-200 dark:border-slate-800 py-5">
          <div>
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Liczba zadań</dt>
            <dd className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {Math.min(EXAM_QUESTION_COUNT, allTasks.length)} zadań
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Limit czasu</dt>
            <dd className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              30:00 min
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Podsumowanie</dt>
            <dd className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">
              Wynik % i rozwiązania
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={startNewExam}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors whitespace-nowrap shrink-0"
          >
            <Play className="h-4 w-4" />
            Rozpocznij arkusz
          </button>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Wróć do pulpitu
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'summary' && result) {
    const passed = result.percentage >= 30;
    return (
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p
                className={`text-sm font-semibold ${
                  passed
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {passed ? 'Próg zdawalności (30%) osiągnięty' : 'Poniżej progu zdawalności (30%)'}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                Wynik arkusza: <span className="font-mono tabular-nums">{result.percentage}%</span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={startNewExam}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="h-4 w-4" />
                Nowy arkusz
              </button>
              <button
                type="button"
                onClick={onBackToDashboard}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
                Pulpit
              </button>
            </div>
          </div>

          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Zdobyte punkty</dt>
              <dd className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {result.earnedPoints} / {result.totalPoints}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Poprawne zadania</dt>
              <dd className="mt-1 font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {result.correctCount} / {result.totalQuestions}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Udzielone odpowiedzi</dt>
              <dd className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {result.answeredCount} / {result.totalQuestions}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Czas pracy</dt>
              <dd className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {formatTimer(result.elapsedSeconds)}
              </dd>
            </div>
          </dl>
        </section>

        {/* Detailed Question Review */}
        <section aria-labelledby="exam-review-heading" className="space-y-4">
          <h2 id="exam-review-heading" className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Przegląd zadań i rozwiązań
          </h2>

          <div className="space-y-4">
            {result.details.map((item, idx) => {
              const isExpanded = Boolean(expandedSolutions[item.task.id]);
              return (
                <article
                  key={item.task.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        Zadanie {idx + 1} (#{item.task.id})
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.task.topicName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {item.earnedPoints}/{item.task.points} pkt
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        item.isCorrect
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {item.isCorrect ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Poprawna odpowiedź
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          {item.isAnswered ? 'Błędna odpowiedź' : 'Brak odpowiedzi'}
                        </>
                      )}
                    </span>
                  </div>

                  <div className="text-sm sm:text-base text-slate-900 dark:text-slate-100">
                    <MathText content={item.task.question} />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <span>
                      Twoja odpowiedź:{' '}
                      <strong className="font-mono text-slate-900 dark:text-slate-100">
                        {item.isAnswered ? item.userAnswer : '—'}
                      </strong>
                    </span>
                    <span>
                      Poprawna odpowiedź:{' '}
                      <strong className="font-mono text-emerald-700 dark:text-emerald-400">
                        {item.task.correctAnswer.replace('.', ',')}
                      </strong>
                    </span>
                  </div>

                  <div>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() =>
                        setExpandedSolutions((prev) => ({
                          ...prev,
                          [item.task.id]: !prev[item.task.id],
                        }))
                      }
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {isExpanded ? 'Ukryj rozwiązanie' : 'Zobacz rozwiązanie krok po kroku'}
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    {isExpanded && (
                      <ol className="mt-3 space-y-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 text-sm text-slate-800 dark:text-slate-200 list-decimal list-inside">
                        {item.task.solutionSteps.map((step, sIdx) => (
                          <li key={sIdx} className="leading-relaxed">
                            <MathText content={step} />
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  // Active running exam state
  const currentTask = questions[currentIdx];
  const answeredCount = questions.filter((q) => (answers[q.id] ?? '').trim().length > 0).length;
  const isLowTime = remainingSeconds <= 180;

  return (
    <div className="space-y-6">
      {/* Exam Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 shadow-xs">
        <div className="flex items-center gap-4">
          <span
            data-testid="exam-timer"
            className={`inline-flex items-center gap-2 font-mono text-lg font-bold tabular-nums ${
              isLowTime
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            <Clock className="h-5 w-5" />
            {formatTimer(remainingSeconds)}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
            Odpowiedziano: {answeredCount} / {questions.length}
          </span>
        </div>

        {!confirmFinish ? (
          <button
            type="button"
            onClick={() => setConfirmFinish(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition-colors whitespace-nowrap shrink-0"
          >
            <Flag className="h-4 w-4" />
            Zakończ arkusz
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {answeredCount < questions.length
                ? `Brakuje ${questions.length - answeredCount} odp. Zakończyć?`
                : 'Zatwierdzić arkusz?'}
            </span>
            <button
              type="button"
              onClick={() => finishExam(remainingSeconds)}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0"
            >
              Tak, sprawdź wynik
            </button>
            <button
              type="button"
              onClick={() => setConfirmFinish(false)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              Kontynuuj
            </button>
          </div>
        )}
      </div>

      {/* Question Number Stepper */}
      <nav aria-label="Nawigacja po zadaniach arkusza" className="flex flex-wrap gap-2">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIdx;
          const hasAnswer = (answers[q.id] ?? '').trim().length > 0;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentIdx(idx)}
              aria-label={`Zadanie ${idx + 1}${hasAnswer ? ' (odpowiedziano)' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
              className={`h-10 w-10 rounded-xl font-mono text-sm font-bold tabular-nums transition-colors ${
                isCurrent
                  ? 'bg-indigo-600 text-white'
                  : hasAnswer
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </nav>

      {/* Active Question Card */}
      {currentTask && (
        <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300 pb-4 border-b border-slate-200 dark:border-slate-800">
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
              Zadanie {currentIdx + 1} z {questions.length}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {currentTask.topicName}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{currentTask.points} pkt</span>
          </div>

          <div className="text-base sm:text-lg leading-relaxed text-slate-900 dark:text-slate-100">
            <MathText content={currentTask.question} />
          </div>

          {currentTask.type === 'closed' && currentTask.options ? (
            <div role="radiogroup" aria-label="Odpowiedzi" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentTask.options.map((opt) => {
                const isSelected = answers[currentTask.id] === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [currentTask.id]: opt.key,
                      }))
                    }
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-50 ring-1 ring-indigo-600 dark:ring-indigo-400'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 hover:border-indigo-400 dark:hover:border-indigo-500 text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg font-mono text-sm font-bold shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span className="text-base font-medium">
                      <MathText content={opt.label} />
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2 max-w-md">
              <label
                htmlFor={`exam-open-${currentTask.id}`}
                className="block text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                Twoja odpowiedź
              </label>
              <input
                id={`exam-open-${currentTask.id}`}
                type="text"
                value={answers[currentTask.id] ?? ''}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [currentTask.id]: e.target.value,
                  }))
                }
                placeholder="Wpisz wynik, np. 3 lub 1,75"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 font-mono text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Poprzednie
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 px-4 py-2 text-sm font-semibold transition-colors"
              >
                Następne
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => finishExam(remainingSeconds)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition-colors"
              >
                <Flag className="h-4 w-4" />
                Sprawdź arkusz
              </button>
            )}
          </div>
        </article>
      )}
    </div>
  );
};
