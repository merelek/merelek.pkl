import type {
  CkeSession,
  CkeSheet,
  CkeSheetStats,
  CkeYear,
  ExamQuestionResult,
  ExamResult,
  LevelFilter,
  MaturaLevel,
  MaturaTask,
  OverallStats,
  ProgressMap,
  ProgressState,
  TopicId,
  TopicMeta,
  TopicStats,
} from '../types/matura';

/**
 * Normalizes open-ended user math input:
 * - trims outer whitespace and removes inner spaces
 * - converts decimal comma to dot (e.g. "1,75" -> "1.75")
 * - strips optional leading '+' sign
 * - normalizes "-0" / "0.0" style numeric representations when purely numeric
 */
export function normalizeOpenAnswer(raw: string): string {
  const cleaned = raw.trim().replace(/\s+/g, '').replace(/,/g, '.').replace(/^\+/, '');
  if (cleaned === '') return '';

  if (/^-?\d+(\.\d+)?$/.test(cleaned)) {
    const num = Number(cleaned);
    if (Number.isFinite(num)) {
      return Object.is(num, -0) ? '0' : String(num);
    }
  }

  return cleaned.toLowerCase();
}

export function checkTaskAnswer(task: MaturaTask, rawUserAnswer: string): boolean {
  if (!rawUserAnswer || rawUserAnswer.trim() === '') return false;

  if (task.type === 'closed') {
    return rawUserAnswer.trim().toUpperCase() === task.correctAnswer.trim().toUpperCase();
  }

  const normalizedUser = normalizeOpenAnswer(rawUserAnswer);
  if (!normalizedUser) return false;

  const validTargets = [task.correctAnswer, ...(task.acceptedAnswers ?? [])].map((ans) =>
    normalizeOpenAnswer(ans)
  );

  return validTargets.includes(normalizedUser);
}

export function filterTasksByLevel(
  tasks: MaturaTask[],
  levelFilter: LevelFilter
): MaturaTask[] {
  if (levelFilter === 'oba') return tasks;
  return tasks.filter((t) => t.level === levelFilter);
}

export function extractTaskNumberFromSource(source: string): number {
  const match = source.match(/Zad\.\s*(\d+)/i);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

export function sortTasksBySheetOrder(tasks: MaturaTask[]): MaturaTask[] {
  return [...tasks].sort((a, b) => {
    const numA = extractTaskNumberFromSource(a.source);
    const numB = extractTaskNumberFromSource(b.source);
    if (numA !== numB) return numA - numB;
    return a.id - b.id;
  });
}

export interface CatalogFilterOptions {
  levelFilter: LevelFilter;
  topicFilter: TopicId | 'all';
  statusFilter: 'all' | 'unsolved' | 'correct' | 'wrong';
  yearFilter: CkeYear | 'all';
  sessionFilter?: CkeSession | 'all';
  searchQuery: string;
}

export function filterCatalogTasks(
  tasks: MaturaTask[],
  attempts: ProgressMap,
  options: CatalogFilterOptions
): MaturaTask[] {
  const query = options.searchQuery.trim().toLowerCase();
  return filterTasksByLevel(tasks, options.levelFilter).filter((task) => {
    if (options.topicFilter !== 'all' && task.topicId !== options.topicFilter) {
      return false;
    }
    if (options.yearFilter !== 'all' && task.year !== options.yearFilter) {
      return false;
    }
    if (
      options.sessionFilter &&
      options.sessionFilter !== 'all' &&
      task.session !== options.sessionFilter
    ) {
      return false;
    }

    const attempt = attempts[task.id];
    if (options.statusFilter === 'unsolved' && attempt) return false;
    if (options.statusFilter === 'correct' && !(attempt && attempt.isCorrect)) return false;
    if (options.statusFilter === 'wrong' && !(attempt && !attempt.isCorrect)) return false;

    if (query) {
      const haystack = `${task.question} ${task.topicName} ${task.source} zadanie #${task.id}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });
}

export function calculateCkeSheetStats(
  sheets: CkeSheet[],
  tasks: MaturaTask[],
  attempts: ProgressMap,
  level: MaturaLevel
): CkeSheetStats[] {
  return sheets
    .filter((sheet) => sheet.level === level)
    .map((sheet) => {
      const sheetTasks = tasks.filter((t) => t.sheetId === sheet.id);
      let solvedTasks = 0;
      let correctTasks = 0;
      for (const task of sheetTasks) {
        const attempt = attempts[task.id];
        if (attempt) {
          solvedTasks += 1;
          if (attempt.isCorrect) correctTasks += 1;
        }
      }
      const totalTasks = sheetTasks.length;
      return {
        sheet,
        totalTasks,
        solvedTasks,
        correctTasks,
        completionPercent: totalTasks > 0 ? Math.round((solvedTasks / totalTasks) * 100) : 0,
      };
    });
}

export function formatPolishTasksCount(count: number, nounForm: 'zadanie' = 'zadanie'): string {
  if (nounForm !== 'zadanie') return `${count}`;
  if (count === 1) return '1 zadanie';
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} zadania`;
  }
  return `${count} zadań`;
}

export function calculateTopicStats(
  topics: TopicMeta[],
  tasks: MaturaTask[],
  attempts: ProgressMap,
  levelFilter: LevelFilter = 'oba'
): TopicStats[] {
  const stats: TopicStats[] = [];

  for (const topic of topics) {
    const allTopicTasks = tasks.filter((t) => t.topicId === topic.id);
    const basicTasks = allTopicTasks.filter((t) => t.level === 'podstawa').length;
    const extensionTasks = allTopicTasks.filter((t) => t.level === 'rozszerzenie').length;
    const visibleTasks = filterTasksByLevel(allTopicTasks, levelFilter);

    // Hide topics with 0 tasks matching the selected level filter
    if (visibleTasks.length === 0) continue;

    let solvedTasks = 0;
    let correctTasks = 0;
    let wrongTasks = 0;

    for (const task of visibleTasks) {
      const attempt = attempts[task.id];
      if (attempt) {
        solvedTasks += 1;
        if (attempt.isCorrect) {
          correctTasks += 1;
        } else {
          wrongTasks += 1;
        }
      }
    }

    stats.push({
      topicId: topic.id,
      topicName: topic.name,
      extensionOnly: Boolean(topic.extensionOnly) || (basicTasks === 0 && extensionTasks > 0),
      totalTasks: visibleTasks.length,
      basicTasks,
      extensionTasks,
      solvedTasks,
      correctTasks,
      wrongTasks,
      completionPercent:
        visibleTasks.length > 0 ? Math.round((solvedTasks / visibleTasks.length) * 100) : 0,
    });
  }

  return stats;
}

export function calculateOverallStats(
  tasks: MaturaTask[],
  attempts: ProgressMap,
  levelFilter: LevelFilter = 'oba'
): OverallStats {
  const filteredTasks = filterTasksByLevel(tasks, levelFilter);
  const totalTasks = filteredTasks.length;
  let solvedTasks = 0;
  let correctTasks = 0;
  let wrongTasks = 0;
  let earnedPoints = 0;
  let totalPoints = 0;

  for (const task of filteredTasks) {
    totalPoints += task.points;
    const attempt = attempts[task.id];
    if (attempt) {
      solvedTasks += 1;
      if (attempt.isCorrect) {
        correctTasks += 1;
        earnedPoints += task.points;
      } else {
        wrongTasks += 1;
      }
    }
  }

  return {
    totalTasks,
    solvedTasks,
    correctTasks,
    wrongTasks,
    completionPercent: totalTasks > 0 ? Math.round((solvedTasks / totalTasks) * 100) : 0,
    accuracyPercent: solvedTasks > 0 ? Math.round((correctTasks / solvedTasks) * 100) : 0,
    earnedPoints,
    totalPoints,
  };
}

export function getWrongTaskIds(tasks: MaturaTask[], attempts: ProgressMap): number[] {
  return tasks
    .filter((task) => {
      const attempt = attempts[task.id];
      return Boolean(attempt && !attempt.isCorrect);
    })
    .map((task) => task.id);
}

export function pickRandomTaskId(
  tasks: MaturaTask[],
  excludeId?: number,
  onlyIds?: number[],
  randomFn: () => number = Math.random
): number | null {
  const pool = onlyIds ? tasks.filter((t) => onlyIds.includes(t.id)) : tasks;
  if (pool.length === 0) return null;
  if (pool.length === 1) return pool[0].id;

  const candidates = excludeId !== undefined ? pool.filter((t) => t.id !== excludeId) : pool;
  const activePool = candidates.length > 0 ? candidates : pool;
  const index = Math.floor(randomFn() * activePool.length);
  return activePool[index]?.id ?? activePool[0].id;
}

export function createExamQuestions(
  tasks: MaturaTask[],
  count: number = 10,
  randomFn: () => number = Math.random
): MaturaTask[] {
  const copy = [...tasks];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(randomFn() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

export function scoreExam(
  questions: MaturaTask[],
  answers: Record<number, string>,
  elapsedSeconds: number
): ExamResult {
  let answeredCount = 0;
  let correctCount = 0;
  let earnedPoints = 0;
  let totalPoints = 0;

  const details: ExamQuestionResult[] = questions.map((task) => {
    totalPoints += task.points;
    const rawAnswer = answers[task.id] ?? '';
    const isAnswered = rawAnswer.trim().length > 0;
    if (isAnswered) answeredCount += 1;

    const isCorrect = isAnswered && checkTaskAnswer(task, rawAnswer);
    if (isCorrect) {
      correctCount += 1;
      earnedPoints += task.points;
    }

    return {
      task,
      userAnswer: rawAnswer,
      isAnswered,
      isCorrect,
      earnedPoints: isCorrect ? task.points : 0,
    };
  });

  return {
    totalQuestions: questions.length,
    answeredCount,
    correctCount,
    earnedPoints,
    totalPoints,
    percentage: totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0,
    elapsedSeconds,
    details,
  };
}

export function formatTimer(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function validateImportedProgress(
  raw: unknown,
  validTaskIds: Set<number>
): ProgressState | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  if (!record.attempts || typeof record.attempts !== 'object') return null;

  const sanitizedAttempts: ProgressMap = {};
  const entries = Object.entries(record.attempts as Record<string, unknown>);

  for (const [key, value] of entries) {
    const taskId = Number(key);
    if (!Number.isInteger(taskId) || !validTaskIds.has(taskId)) continue;
    if (!value || typeof value !== 'object') continue;

    const attempt = value as Record<string, unknown>;
    if (typeof attempt.userAnswer !== 'string' || typeof attempt.isCorrect !== 'boolean') {
      continue;
    }

    sanitizedAttempts[taskId] = {
      taskId,
      userAnswer: attempt.userAnswer,
      isCorrect: attempt.isCorrect,
      attemptsCount:
        typeof attempt.attemptsCount === 'number' && attempt.attemptsCount > 0
          ? Math.floor(attempt.attemptsCount)
          : 1,
      updatedAt:
        typeof attempt.updatedAt === 'string'
          ? attempt.updatedAt
          : new Date().toISOString(),
    };
  }

  return {
    version: typeof record.version === 'number' ? record.version : 1,
    attempts: sanitizedAttempts,
    lastActiveAt:
      typeof record.lastActiveAt === 'string'
        ? record.lastActiveAt
        : new Date().toISOString(),
  };
}
