import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Circle, XCircle } from 'lucide-react';
import type {
  LevelFilter,
  MaturaTask,
  ProgressMap,
  TopicId,
  TopicMeta,
} from '../types/matura';
import { filterTasksByLevel } from '../utils/evaluator';
import { LevelSegmentedControl } from './LevelSegmentedControl';
import { MathText } from './MathText';

interface CatalogViewProps {
  tasks: MaturaTask[];
  topics: TopicMeta[];
  attempts: ProgressMap;
  levelFilter: LevelFilter;
  levelCounts: {
    podstawa: number;
    rozszerzenie: number;
    oba: number;
  };
  onChangeLevelFilter: (level: LevelFilter) => void;
  onOpenTask: (taskId: number, topicFilter: TopicId | 'all') => void;
}

type StatusFilter = 'all' | 'unsolved' | 'correct' | 'wrong';

export const CatalogView: React.FC<CatalogViewProps> = ({
  tasks,
  topics,
  attempts,
  levelFilter,
  levelCounts,
  onChangeLevelFilter,
  onOpenTask,
}) => {
  const [topicFilter, setTopicFilter] = useState<TopicId | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const levelTasks = useMemo(
    () => filterTasksByLevel(tasks, levelFilter),
    [tasks, levelFilter]
  );

  const availableTopics = useMemo(() => {
    const presentIds = new Set(levelTasks.map((t) => t.topicId));
    return topics.filter((topic) => presentIds.has(topic.id));
  }, [topics, levelTasks]);

  useEffect(() => {
    if (
      topicFilter !== 'all' &&
      !availableTopics.some((t) => t.id === topicFilter)
    ) {
      setTopicFilter('all');
    }
  }, [availableTopics, topicFilter]);

  const filteredTasks = useMemo(() => {
    return levelTasks.filter((task) => {
      if (topicFilter !== 'all' && task.topicId !== topicFilter) return false;
      const attempt = attempts[task.id];
      if (statusFilter === 'unsolved') return !attempt;
      if (statusFilter === 'correct') return Boolean(attempt && attempt.isCorrect);
      if (statusFilter === 'wrong') return Boolean(attempt && !attempt.isCorrect);
      return true;
    });
  }, [levelTasks, attempts, topicFilter, statusFilter]);

  const statusTabs: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: 'Wszystkie' },
    { id: 'unsolved', label: 'Nierozwiązane' },
    { id: 'correct', label: 'Poprawne' },
    { id: 'wrong', label: 'Błędne' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Baza zadań maturalnych
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Przeglądaj wszystkie {levelTasks.length} zadań dla wybranego poziomu i filtruj według działu lub statusu.
          </p>
        </div>

        <LevelSegmentedControl
          value={levelFilter}
          onChange={onChangeLevelFilter}
          counts={levelCounts}
        />
      </div>

      {/* Filters bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="topic-select" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Dział:
            </label>
            <select
              id="topic-select"
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value as TopicId | 'all')}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-medium text-slate-800 dark:text-slate-100 focus:border-indigo-600 focus:outline-none"
            >
              <option value="all">Wszystkie działy ({availableTopics.length})</option>
              {availableTopics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                  {topic.extensionOnly ? ' (Rozszerzenie)' : ''}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
            Wyświetlono: {filteredTasks.length} z {levelTasks.length}
          </span>
        </div>

        <div
          role="group"
          aria-label="Filtruj według statusu"
          className="inline-flex flex-wrap items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1"
        >
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center shadow-xs">
          <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Brak zadań spełniających wybrane kryteria
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Zmień filtr poziomu, działu lub statusu, aby zobaczyć zadania.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const attempt = attempts[task.id];
            return (
              <button
                key={task.id}
                type="button"
                onClick={() => onOpenTask(task.id, topicFilter)}
                className="group w-full text-left rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                      Zadanie #{task.id}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {task.topicName}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        task.level === 'rozszerzenie'
                          ? 'font-semibold text-violet-700 dark:text-violet-400'
                          : 'text-slate-600 dark:text-slate-400'
                      }
                    >
                      {task.level === 'rozszerzenie' ? 'Rozszerzenie' : 'Podstawa'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{task.points} pkt</span>
                    <span aria-hidden="true">·</span>
                    <span>{task.type === 'closed' ? 'Zamknięte' : 'Otwarte'}</span>
                  </div>

                  <div className="text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed">
                    <MathText content={task.question} />
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {attempt ? (
                    attempt.isCorrect ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                        <CheckCircle2 className="h-4 w-4" />
                        Poprawne
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 whitespace-nowrap">
                        <XCircle className="h-4 w-4" />
                        Błędne
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      <Circle className="h-4 w-4" />
                      Nierozwiązane
                    </span>
                  )}

                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
