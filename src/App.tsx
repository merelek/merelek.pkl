import { useEffect, useMemo, useState } from 'react';
import { MATURA_TASKS, TOPICS } from './data/tasks';
import type {
  ExamResult,
  LevelFilter,
  MaturaTask,
  ProgressState,
  TopicId,
} from './types/matura';
import {
  calculateOverallStats,
  calculateTopicStats,
  filterTasksByLevel,
  getWrongTaskIds,
  pickRandomTaskId,
  validateImportedProgress,
} from './utils/evaluator';
import {
  applyTheme,
  createEmptyProgress,
  exportProgressToJson,
  loadLevelFilter,
  loadProgress,
  loadTheme,
  saveLevelFilter,
  saveProgress,
  type ThemeMode,
} from './utils/storage';
import { TopBar, type ActiveView } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { TaskSolverView } from './components/TaskSolverView';
import { CatalogView } from './components/CatalogView';
import { ExamView } from './components/ExamView';

type PracticeMode =
  | { kind: 'all' }
  | { kind: 'topic'; topicId: TopicId }
  | { kind: 'wrong' };

export default function App() {
  const validTaskIds = useMemo(() => new Set(MATURA_TASKS.map((t) => t.id)), []);

  const [theme, setTheme] = useState<ThemeMode>(() => loadTheme());
  const [levelFilter, setLevelFilter] = useState<LevelFilter>(() => loadLevelFilter());
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress(validTaskIds));
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>({ kind: 'all' });
  const [currentTaskId, setCurrentTaskId] = useState<number>(MATURA_TASKS[0].id);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    saveLevelFilter(levelFilter);
  }, [levelFilter]);

  const levelCounts = useMemo(
    () => ({
      podstawa: MATURA_TASKS.filter((t) => t.level === 'podstawa').length,
      rozszerzenie: MATURA_TASKS.filter((t) => t.level === 'rozszerzenie').length,
      oba: MATURA_TASKS.length,
    }),
    []
  );

  const levelTasks = useMemo(
    () => filterTasksByLevel(MATURA_TASKS, levelFilter),
    [levelFilter]
  );

  const overallStats = useMemo(
    () => calculateOverallStats(MATURA_TASKS, progress.attempts, levelFilter),
    [progress.attempts, levelFilter]
  );

  const topicStats = useMemo(
    () => calculateTopicStats(TOPICS, MATURA_TASKS, progress.attempts, levelFilter),
    [progress.attempts, levelFilter]
  );

  const wrongTaskIds = useMemo(
    () => getWrongTaskIds(levelTasks, progress.attempts),
    [levelTasks, progress.attempts]
  );

  const practiceQueue: MaturaTask[] = useMemo(() => {
    if (practiceMode.kind === 'topic') {
      return levelTasks.filter((t) => t.topicId === practiceMode.topicId);
    }
    if (practiceMode.kind === 'wrong') {
      return levelTasks.filter((t) => wrongTaskIds.includes(t.id));
    }
    return levelTasks;
  }, [practiceMode, levelTasks, wrongTaskIds]);

  const practiceContextTitle = useMemo(() => {
    const levelLabel =
      levelFilter === 'podstawa'
        ? 'Podstawa'
        : levelFilter === 'rozszerzenie'
          ? 'Rozszerzenie'
          : 'Oba poziomy';

    if (practiceMode.kind === 'topic') {
      const topic = TOPICS.find((t) => t.id === practiceMode.topicId);
      return `Dział: ${topic?.name ?? ''} (${levelLabel})`;
    }
    if (practiceMode.kind === 'wrong') {
      return `Powtórka błędnych (${levelLabel})`;
    }
    return `Wszystkie zadania (${levelLabel})`;
  }, [practiceMode, levelFilter]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleStartRandom = () => {
    const id = pickRandomTaskId(levelTasks, currentTaskId) ?? levelTasks[0]?.id ?? 1;
    setPracticeMode({ kind: 'all' });
    setCurrentTaskId(id);
    setActiveView('practice');
  };

  const handleStartWrongReview = () => {
    if (wrongTaskIds.length === 0) return;
    setPracticeMode({ kind: 'wrong' });
    setCurrentTaskId(wrongTaskIds[0]);
    setActiveView('practice');
  };

  const handleStartTopic = (topicId: TopicId) => {
    const topicTasks = levelTasks.filter((t) => t.topicId === topicId);
    if (topicTasks.length === 0) return;
    const firstUnsolved = topicTasks.find((t) => !progress.attempts[t.id]);
    setPracticeMode({ kind: 'topic', topicId });
    setCurrentTaskId((firstUnsolved ?? topicTasks[0]).id);
    setActiveView('practice');
  };

  const handleOpenTaskFromCatalog = (taskId: number, topicFilter: TopicId | 'all') => {
    setPracticeMode(
      topicFilter === 'all' ? { kind: 'all' } : { kind: 'topic', topicId: topicFilter }
    );
    setCurrentTaskId(taskId);
    setActiveView('practice');
  };

  const handlePickRandomInQueue = () => {
    const queueIds = practiceQueue.map((t) => t.id);
    const nextId = pickRandomTaskId(levelTasks, currentTaskId, queueIds);
    if (nextId !== null) {
      setCurrentTaskId(nextId);
    }
  };

  const handleSubmitTaskAnswer = (task: MaturaTask, userAnswer: string, isCorrect: boolean) => {
    setProgress((prev) => {
      const existing = prev.attempts[task.id];
      const now = new Date().toISOString();
      return {
        version: prev.version,
        lastActiveAt: now,
        attempts: {
          ...prev.attempts,
          [task.id]: {
            taskId: task.id,
            userAnswer,
            isCorrect,
            attemptsCount: (existing?.attemptsCount ?? 0) + 1,
            updatedAt: now,
          },
        },
      };
    });
  };

  const handleRecordExamResults = (result: ExamResult) => {
    setProgress((prev) => {
      const now = new Date().toISOString();
      const updatedAttempts = { ...prev.attempts };
      for (const detail of result.details) {
        if (!detail.isAnswered) continue;
        const existing = updatedAttempts[detail.task.id];
        updatedAttempts[detail.task.id] = {
          taskId: detail.task.id,
          userAnswer: detail.userAnswer,
          isCorrect: detail.isCorrect,
          attemptsCount: (existing?.attemptsCount ?? 0) + 1,
          updatedAt: now,
        };
      }
      return {
        version: prev.version,
        lastActiveAt: now,
        attempts: updatedAttempts,
      };
    });
  };

  const handleExportProgress = () => {
    const json = exportProgressToJson(progress);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `maturalab-postepy-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const handleImportProgress = async (
    file: File
  ): Promise<{ ok: boolean; message: string }> => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const validated = validateImportedProgress(parsed, validTaskIds);
      if (!validated) {
        return {
          ok: false,
          message: 'Nieprawidłowy format pliku JSON z postępami.',
        };
      }
      setProgress(validated);
      const importedCount = Object.keys(validated.attempts).length;
      return {
        ok: true,
        message: `Wczytano postępy (${importedCount} zapisanych zadań).`,
      };
    } catch {
      return {
        ok: false,
        message: 'Nie udało się odczytać pliku JSON.',
      };
    }
  };

  const handleResetProgress = () => {
    setProgress(createEmptyProgress());
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <TopBar
        activeView={activeView}
        onNavigate={setActiveView}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 py-8">
        {activeView === 'dashboard' && (
          <DashboardView
            levelFilter={levelFilter}
            levelCounts={levelCounts}
            onChangeLevelFilter={setLevelFilter}
            overallStats={overallStats}
            topicStats={topicStats}
            topics={TOPICS}
            wrongCount={wrongTaskIds.length}
            onStartRandom={handleStartRandom}
            onStartWrongReview={handleStartWrongReview}
            onStartTopic={handleStartTopic}
            onStartExam={() => setActiveView('exam')}
            onExportProgress={handleExportProgress}
            onImportProgress={handleImportProgress}
            onResetProgress={handleResetProgress}
          />
        )}

        {activeView === 'practice' && (
          <TaskSolverView
            tasksQueue={practiceQueue}
            currentTaskId={currentTaskId}
            contextTitle={practiceContextTitle}
            attempts={progress.attempts}
            onSelectTask={setCurrentTaskId}
            onSubmitAnswer={handleSubmitTaskAnswer}
            onPickRandom={handlePickRandomInQueue}
            onBackToDashboard={() => setActiveView('dashboard')}
          />
        )}

        {activeView === 'catalog' && (
          <CatalogView
            tasks={MATURA_TASKS}
            topics={TOPICS}
            attempts={progress.attempts}
            levelFilter={levelFilter}
            levelCounts={levelCounts}
            onChangeLevelFilter={setLevelFilter}
            onOpenTask={handleOpenTaskFromCatalog}
          />
        )}

        {activeView === 'exam' && (
          <ExamView
            allTasks={MATURA_TASKS}
            levelFilter={levelFilter}
            onRecordExamResults={handleRecordExamResults}
            onBackToDashboard={() => setActiveView('dashboard')}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>MaturaLab · Matematyka podstawowa i rozszerzona</span>
          <span>Postęp zapisywany lokalnie w przeglądarce</span>
        </div>
      </footer>
    </div>
  );
}
