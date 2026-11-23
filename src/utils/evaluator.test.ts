import test from 'node:test';
import assert from 'node:assert/strict';
import { CKE_SHEETS } from '../data/ckeSheets';
import { MATURA_TASKS, TOPICS } from '../data/tasks';
import {
  calculateCkeSheetStats,
  calculateOverallStats,
  calculateTopicStats,
  checkTaskAnswer,
  createExamQuestions,
  extractTaskNumberFromSource,
  filterCatalogTasks,
  filterTasksByLevel,
  formatPolishTasksCount,
  formatTimer,
  getWrongTaskIds,
  normalizeOpenAnswer,
  pickRandomTaskId,
  scoreExam,
  sortTasksBySheetOrder,
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

  const expectedBasicLog = MATURA_TASKS.filter(
    (t) => t.topicId === 'logarytmy' && t.level === 'podstawa'
  ).length;
  const expectedExtLog = MATURA_TASKS.filter(
    (t) => t.topicId === 'logarytmy' && t.level === 'rozszerzenie'
  ).length;
  const expectedTotalLog = expectedBasicLog + expectedExtLog;

  const logOba = calculateTopicStats(TOPICS, MATURA_TASKS, attempts, 'oba').find(
    (s) => s.topicId === 'logarytmy'
  )!;
  assert.equal(logOba.basicTasks, expectedBasicLog);
  assert.equal(logOba.extensionTasks, expectedExtLog);
  assert.equal(logOba.totalTasks, expectedTotalLog);
  assert.equal(logOba.solvedTasks, 2);
  assert.equal(logOba.completionPercent, Math.round((2 / expectedTotalLog) * 100));

  const logPodstawa = calculateTopicStats(TOPICS, MATURA_TASKS, attempts, 'podstawa').find(
    (s) => s.topicId === 'logarytmy'
  )!;
  assert.equal(logPodstawa.totalTasks, expectedBasicLog);
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

test('all tasks link to valid CKE Formula 2023 sheets and every sheet has >= 2 tasks', () => {
  assert.equal(MATURA_TASKS.length, 158);
  const sheetById = new Map(CKE_SHEETS.map((s) => [s.id, s]));
  const seenIds = new Set<number>();

  for (const task of MATURA_TASKS) {
    assert.equal(seenIds.has(task.id), false, `Duplicate task id #${task.id}`);
    seenIds.add(task.id);
    assert.ok(task.source.length > 0, `Task #${task.id} must have a source label`);
    const sheet = sheetById.get(task.sheetId);
    assert.ok(sheet, `Task #${task.id} references unknown sheetId "${task.sheetId}"`);
    assert.equal(task.level, sheet.level, `Task #${task.id} level mismatch with ${sheet.id}`);
    assert.equal(task.year, sheet.year, `Task #${task.id} year mismatch with ${sheet.id}`);
    assert.equal(task.session, sheet.session, `Task #${task.id} session mismatch with ${sheet.id}`);

    if (task.type === 'closed') {
      assert.equal(task.options?.length, 4, `Closed task #${task.id} must have 4 options`);
      assert.ok(
        ['A', 'B', 'C', 'D'].includes(task.correctAnswer),
        `Closed task #${task.id} has invalid correctAnswer "${task.correctAnswer}"`
      );
    } else {
      assert.ok(
        task.correctAnswer.trim().length > 0,
        `Open task #${task.id} must have non-empty correctAnswer`
      );
    }
  }

  for (const sheet of CKE_SHEETS) {
    const count = MATURA_TASKS.filter((t) => t.sheetId === sheet.id).length;
    assert.ok(count >= 2, `CKE sheet ${sheet.id} must have at least 2 tasks, found ${count}`);
  }
});

test('the 4 complete CKE sheets contain exact sequential tasks without gaps or duplicates', () => {
  const expectedCounts: Array<[string, number]> = [
    ['maj-2024-pp', 32],
    ['czerwiec-2024-pp', 32],
    ['maj-2023-pp', 32],
    ['maj-2024-pr', 13],
  ];

  for (const [sheetId, expectedCount] of expectedCounts) {
    const sorted = sortTasksBySheetOrder(MATURA_TASKS.filter((t) => t.sheetId === sheetId));
    assert.equal(sorted.length, expectedCount, `Sheet ${sheetId} count mismatch`);
    const numbers = sorted.map((t) => extractTaskNumberFromSource(t.source));
    const expectedSequence = Array.from({ length: expectedCount }, (_, idx) => idx + 1);
    assert.deepEqual(numbers, expectedSequence, `Sheet ${sheetId} task numbers mismatch`);
  }
});

test('filterCatalogTasks and calculateCkeSheetStats work accurately', () => {
  const tasks2024Maj = filterCatalogTasks(MATURA_TASKS, {}, {
    levelFilter: 'podstawa',
    topicFilter: 'all',
    statusFilter: 'all',
    yearFilter: 2024,
    sessionFilter: 'maj',
    searchQuery: 'Maj 2024',
  });
  assert.equal(tasks2024Maj.length, 32);
  assert.ok(tasks2024Maj.every((t) => t.sheetId === 'maj-2024-pp'));

  const attempts = {
    1: { taskId: 1, userAnswer: 'B', isCorrect: true, attemptsCount: 1, updatedAt: '2026-01-01' },
    2: { taskId: 2, userAnswer: 'A', isCorrect: false, attemptsCount: 1, updatedAt: '2026-01-01' },
  };
  const ppStats = calculateCkeSheetStats(CKE_SHEETS, MATURA_TASKS, attempts, 'podstawa');
  const maj2025pp = ppStats.find((s) => s.sheet.id === 'maj-2025-pp')!;
  assert.equal(maj2025pp.totalTasks, 4);
  assert.equal(maj2025pp.solvedTasks, 2);
  assert.equal(maj2025pp.correctTasks, 1);
  assert.equal(maj2025pp.completionPercent, 50);

  const prStats = calculateCkeSheetStats(CKE_SHEETS, MATURA_TASKS, attempts, 'rozszerzenie');
  assert.equal(prStats.some((s) => s.sheet.session === 'sierpien'), false);
});
