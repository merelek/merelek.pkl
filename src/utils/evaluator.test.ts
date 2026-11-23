import test from 'node:test';
import assert from 'node:assert/strict';
import { MATURA_TASKS, TOPICS } from '../data/tasks';
import {
  calculateOverallStats,
  calculateTopicStats,
  checkTaskAnswer,
  createExamQuestions,
  formatTimer,
  getWrongTaskIds,
  normalizeOpenAnswer,
  pickRandomTaskId,
  scoreExam,
  validateImportedProgress,
} from './evaluator';

test('normalizeOpenAnswer handles spaces, commas, dots, and leading pluses', () => {
  assert.equal(normalizeOpenAnswer(' 1,75 '), '1.75');
  assert.equal(normalizeOpenAnswer('1.750'), '1.75');
  assert.equal(normalizeOpenAnswer(' +3 '), '3');
  assert.equal(normalizeOpenAnswer('7 / 4'), '7/4');
  assert.equal(normalizeOpenAnswer('   '), '');
});

test('checkTaskAnswer validates closed and open tasks accurately', () => {
  const closedTask = MATURA_TASKS.find((t) => t.id === 1)!;
  assert.equal(checkTaskAnswer(closedTask, 'B'), true);
  assert.equal(checkTaskAnswer(closedTask, 'b'), true);
  assert.equal(checkTaskAnswer(closedTask, 'A'), false);
  assert.equal(checkTaskAnswer(closedTask, ''), false);

  const openDecimalTask = MATURA_TASKS.find((t) => t.id === 12)!;
  assert.equal(checkTaskAnswer(openDecimalTask, ' 1,75 '), true);
  assert.equal(checkTaskAnswer(openDecimalTask, '1.75'), true);
  assert.equal(checkTaskAnswer(openDecimalTask, '7/4'), true);
  assert.equal(checkTaskAnswer(openDecimalTask, '1.5'), false);
});

test('calculateOverallStats and calculateTopicStats compute accurate counts', () => {
  const attempts = {
    1: { taskId: 1, userAnswer: 'B', isCorrect: true, attemptsCount: 1, updatedAt: '2026-01-01' },
    2: { taskId: 2, userAnswer: 'A', isCorrect: false, attemptsCount: 1, updatedAt: '2026-01-01' },
    6: { taskId: 6, userAnswer: '9', isCorrect: true, attemptsCount: 1, updatedAt: '2026-01-01' },
  };

  const overall = calculateOverallStats(MATURA_TASKS, attempts);
  assert.equal(overall.totalTasks, 15);
  assert.equal(overall.solvedTasks, 3);
  assert.equal(overall.correctTasks, 2);
  assert.equal(overall.wrongTasks, 1);
  assert.equal(overall.completionPercent, 20);
  assert.equal(overall.accuracyPercent, 67);
  assert.equal(overall.earnedPoints, 3); // task 1 (1 pkt) + task 6 (2 pkt)
  assert.equal(overall.totalPoints, 20);

  const topicStats = calculateTopicStats(TOPICS, MATURA_TASKS, attempts);
  const liczby = topicStats.find((s) => s.topicId === 'liczby-rzeczywiste')!;
  assert.equal(liczby.totalTasks, 3);
  assert.equal(liczby.solvedTasks, 2);
  assert.equal(liczby.correctTasks, 1);
  assert.equal(liczby.wrongTasks, 1);
  assert.equal(liczby.completionPercent, 67);
});

test('getWrongTaskIds and pickRandomTaskId filter properly', () => {
  const attempts = {
    1: { taskId: 1, userAnswer: 'B', isCorrect: true, attemptsCount: 1, updatedAt: '2026-01-01' },
    4: { taskId: 4, userAnswer: 'C', isCorrect: false, attemptsCount: 1, updatedAt: '2026-01-01' },
    9: { taskId: 9, userAnswer: '1', isCorrect: false, attemptsCount: 1, updatedAt: '2026-01-01' },
  };

  assert.deepEqual(getWrongTaskIds(MATURA_TASKS, attempts), [4, 9]);
  assert.equal(pickRandomTaskId(MATURA_TASKS, 4, [4, 9], () => 0), 9);
  assert.equal(pickRandomTaskId(MATURA_TASKS, undefined, [], () => 0), null);
});

test('createExamQuestions and scoreExam handle timed mock exam', () => {
  const questions = createExamQuestions(MATURA_TASKS, 10, () => 0.42);
  assert.equal(questions.length, 10);
  const uniqueIds = new Set(questions.map((q) => q.id));
  assert.equal(uniqueIds.size, 10);

  const answers: Record<number, string> = {};
  for (const q of questions) {
    answers[q.id] = q.correctAnswer;
  }
  const result = scoreExam(questions, answers, 625);
  assert.equal(result.correctCount, 10);
  assert.equal(result.percentage, 100);
  assert.equal(result.earnedPoints, result.totalPoints);
  assert.equal(formatTimer(625), '10:25');
  assert.equal(formatTimer(-5), '00:00');
});

test('validateImportedProgress strips invalid IDs and rejects malformed objects', () => {
  const validIds = new Set(MATURA_TASKS.map((t) => t.id));
  assert.equal(validateImportedProgress(null, validIds), null);
  assert.equal(validateImportedProgress({ foo: 'bar' }, validIds), null);

  const parsed = validateImportedProgress(
    {
      version: 1,
      attempts: {
        1: { taskId: 1, userAnswer: 'B', isCorrect: true, attemptsCount: 2 },
        999: { taskId: 999, userAnswer: 'A', isCorrect: false },
      },
    },
    validIds
  );

  assert.ok(parsed);
  assert.equal(Object.keys(parsed.attempts).length, 1);
  assert.equal(parsed.attempts[1].userAnswer, 'B');
  assert.equal(parsed.attempts[1].attemptsCount, 2);
});
