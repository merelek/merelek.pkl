export type TaskType = 'closed' | 'open';

export type TopicId =
  | 'liczby-rzeczywiste'
  | 'funkcje'
  | 'ciagi'
  | 'trygonometria'
  | 'planimetria';

export type OptionKey = 'A' | 'B' | 'C' | 'D';

export interface TaskOption {
  key: OptionKey;
  label: string;
}

export interface MaturaTask {
  id: number;
  topicId: TopicId;
  topicName: string;
  type: TaskType;
  points: number;
  question: string;
  options?: TaskOption[];
  correctAnswer: string;
  acceptedAnswers?: string[];
  hint: string;
  solutionSteps: string[];
}

export interface TopicMeta {
  id: TopicId;
  name: string;
  shortDescription: string;
}

export interface TaskAttempt {
  taskId: number;
  userAnswer: string;
  isCorrect: boolean;
  attemptsCount: number;
  updatedAt: string;
}

export type ProgressMap = Record<number, TaskAttempt>;

export interface ProgressState {
  version: number;
  attempts: ProgressMap;
  lastActiveAt: string;
}

export interface TopicStats {
  topicId: TopicId;
  topicName: string;
  totalTasks: number;
  solvedTasks: number;
  correctTasks: number;
  wrongTasks: number;
  completionPercent: number;
}

export interface OverallStats {
  totalTasks: number;
  solvedTasks: number;
  correctTasks: number;
  wrongTasks: number;
  completionPercent: number;
  accuracyPercent: number;
  earnedPoints: number;
  totalPoints: number;
}

export interface ExamQuestionResult {
  task: MaturaTask;
  userAnswer: string;
  isAnswered: boolean;
  isCorrect: boolean;
  earnedPoints: number;
}

export interface ExamResult {
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  earnedPoints: number;
  totalPoints: number;
  percentage: number;
  elapsedSeconds: number;
  details: ExamQuestionResult[];
}
