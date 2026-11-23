import test from 'node:test';
import assert from 'node:assert/strict';
import { MATURA_TASKS, TOPICS } from '../data/tasks';
import {
  calculateOverallStats,
  calculateTopicStats,
  checkTaskAnswer,
  createExamQuestions,
  filterTasksByLevel,
  formatPolishTasksCount,
  formatTimer,
  getWrongTaskIds,
  normalizeOpenAnswer,
  pickRandomTaskId,
  scoreExam,
  validateImportedProgress,
} from './evaluator';

test('dataset covers all 25 topics with non-empty tasks and valid level tags', () => {
  assert.equal(TOPICS.length, 25);
  for (const topic of TOPICS) {
    const topicTasks = MATURA_TASKS.filter((t) => t.topicId === topic.id);
    assert.ok(topicTasks.length >= 1, `Topic ${topic.name} must have at least 1 task`);
    if (topic.extensionOnly) {
      assert.ok(
        topicTasks.every((t) => t.level === 'rozszerzenie'),
        `Extension-only topic ${topic.name} must contain only rozszerzenie tasks`
      );
    }
  }
});

test('level filter hides extension-only topics in podstawa and basic-only topics in rozszerzenie', () => {
  const podstawaTopics = calculateTopicStats(TOPICS, MATURA_TASKS, {}, 'podstawa');
  const rozszerzenieTopics = calculateTopicStats(TOPICS, MATURA_TASKS, {}, 'rozszerzenie');
  const obaTopics = calculateTopicStats(TOPICS, MATURA_TASKS, {}, 'oba');

  assert.equal(obaTopics.length, 25);
  assert.equal(podstawaTopics.some((t) => t.topicId === 'rachunek-rozniczkowy'), false);
  assert.equal(podstawaTopics.some((t) => t.topicId === 'rownania-z-parametrem'), false);
  assert.equal(podstawaTopics.some((t) => t.topicId === 'wartosc-bezwzgledna'), false);
  assert.equal(podstawaTopics.some((t) => t.topicId === 'funkcja-liniowa'), true);

  assert.equal(rozszerzenieTopics.some((t) => t.topicId === 'rachunek-rozniczkowy'), true);
  assert.equal(rozszerzenieTopics.some((t) => t.topicId === 'funkcja-liniowa'), false);
  assert.equal(rozszerzenieTopics.some((t) => t.topicId === 'procenty'), false);
  assert.equal(rozszerzenieTopics.some((t) => t.topicId === 'statystyka'), false);

  assert.equal(
    filterTasksByLevel(MATURA_TASKS, 'podstawa').length +
      filterTasksByLevel(MATURA_TASKS, 'rozszerzenie').length,
    MATURA_TASKS.length
  );
});

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

  const openDecimalTask = MATURA_TASKS.find((t) => t.id === 12)!;
  assert.equal(checkTaskAnswer(openDecimalTask, ' 1,75 '), true);
  assert.equal(checkTaskAnswer(openDecimalTask, '7/4'), true);
  assert.equal(checkTaskAnswer(openDecimalTask, '1.5'), false);

  const negativeOpenTask = MATURA_TASKS.find((t) => t.id === 44)!;
  assert.equal(checkTaskAnswer(negativeOpenTask, '-20'), true);
});

test('calculateOverallStats and calculateTopicStats compute dynamic level-filtered counts', () => {
  const attempts = {
    1: { taskId: 1, userAnswer: 'B', isCorrect: true, attemptsCount: 1, updatedAt: '2026-01-01' },
    32: { taskId: 32, userAnswer: '7', isCorrect: true, attemptsCount: 1, updatedAt: '2026-01-01' },
  };

  const basicOverall = calculateOverallStats(MATURA_TASKS, attempts, 'podstawa');
  const extOverall = calculateOverallStats(MATURA_TASKS, attempts, 'rozszerzenie');
  const allOverall = calculateOverallStats(MATURA_TASKS, attempts, 'oba');

  assert.equal(basicOverall.solvedTasks, 1);
  assert.equal(extOverall.solvedTasks, 1);
  assert.equal(allOverall.solvedTasks, 2);

  const logOba = calculateTopicStats(TOPICS, MATURA_TASKS, attempts, 'oba').find(
    (s) => s.topicId === 'logarytmy'
  )!;
  assert.equal(logOba.basicTasks, 1);
  assert.equal(logOba.extensionTasks, 1);
  assert.equal(logOba.totalTasks, 2);
  assert.equal(logOba.solvedTasks, 2);
  assert.equal(logOba.completionPercent, 100);

  const logPodstawa = calculateTopicStats(TOPICS, MATURA_TASKS, attempts, 'podstawa').find(
    (s) => s.topicId === 'logarytmy'
  )!;
  assert.equal(logPodstawa.totalTasks, 1);
  assert.equal(logPodstawa.solvedTasks, 1);
});

test('formatPolishTasksCount formats Polish grammar properly', () => {
  assert.equal(formatPolishTasksCount(1), '1 zadanie');
  assert.equal(formatPolishTasksCount(2), '2 zadania');
  assert.equal(formatPolishTasksCount(5), '5 zadań');
  assert.equal(formatPolishTasksCount(12), '12 zadań');
});

test('getWrongTaskIds, pickRandomTaskId, createExamQuestions, scoreExam, and validateImportedProgress', () => {
  const attempts = {
    1: { taskId: 1, userAnswer: 'B', isCorrect: true, attemptsCount: 1, updatedAt: '2026-01-01' },
    4: { taskId: 4, userAnswer: 'C', isCorrect: false, attemptsCount: 1, updatedAt: '2026-01-01' },
  };

  assert.deepEqual(getWrongTaskIds(MATURA_TASKS, attempts), [4]);
  assert.equal(pickRandomTaskId(MATURA_TASKS, 4, [4], () => 0), 4);

  const questions = createExamQuestions(MATURA_TASKS, 10, () => 0.42);
  assert.equal(questions.length, 10);
  const answers: Record<number, string> = {};
  for (const q of questions) answers[q.id] = q.correctAnswer;
  const result = scoreExam(questions, answers, 625);
  assert.equal(result.percentage, 100);
  assert.equal(formatTimer(625), '10:25');

  const validIds = new Set(MATURA_TASKS.map((t) => t.id));
  const parsed = validateImportedProgress(
    { version: 1, attempts: { 1: { taskId: 1, userAnswer: 'B', isCorrect: true } } },
    validIds
  );
  assert.ok(parsed);
  assert.equal(Object.keys(parsed.attempts).length, 1);
});
