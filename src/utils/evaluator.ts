import type {
  ExamQuestionResult,
  ExamResult,
  MaturaTask,
  OverallStats,
  ProgressMap,
  ProgressState,
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

  // Canonicalize pure decimal/integer numbers (e.g. "03" -> "3", "3.0" -> "3", "1.750" -> "1.75")
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

export function calculateTopicStats(
  topics: TopicMeta[],
  tasks: MaturaTask[],
  attempts: ProgressMap
): TopicStats[] {
  return topics.map((topic) => {
    const topicTasks = tasks.filter((t) => t.topicId === topic.id);
    const totalTasks = topicTasks.length;
    let solvedTasks = 0;
    let correctTasks = 0;
    let wrongTasks = 0;

    for (const task of topicTasks) {
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

    return {
      topicId: topic.id,
      topicName: topic.name,
      totalTasks,
      solvedTasks,
      correctTasks,
      wrongTasks,
      completionPercent: totalTasks > 0 ? Math.round((solvedTasks / totalTasks) * 100) : 0,
    };
  });
}

export function calculateOverallStats(
  tasks: MaturaTask[],
  attempts: ProgressMap
): OverallStats {
  const totalTasks = tasks.length;
  let solvedTasks = 0;
  let correctTasks = 0;
  let wrongTasks = 0;
  let earnedPoints = 0;
  let totalPoints = 0;

  for (const task of tasks) {
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
