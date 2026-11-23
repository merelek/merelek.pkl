export type TaskType = 'closed' | 'open';

export type MaturaLevel = 'podstawa' | 'rozszerzenie';

export type LevelFilter = MaturaLevel | 'oba';

export type TopicId =
  | 'planimetria'
  | 'geometria-analityczna'
  | 'rownania-i-nierownosci'
  | 'ciagi'
  | 'stereometria'
  | 'trygonometria'
  | 'potegi-i-pierwiastki'
  | 'prawdopodobienstwo'
  | 'funkcja-kwadratowa'
  | 'funkcje'
  | 'logarytmy'
  | 'wyrazenia-algebraiczne'
  | 'liczby-rzeczywiste'
  | 'funkcja-liniowa'
  | 'procenty'
  | 'statystyka'
  | 'kombinatoryka'
  | 'rachunek-rozniczkowy'
  | 'rownania-z-parametrem'
  | 'uklady-rownan'
  | 'wartosc-bezwzgledna'
  | 'wielomiany'
  | 'funkcja-wykladnicza'
  | 'optymalizacja'
  | 'inne';

export type OptionKey = 'A' | 'B' | 'C' | 'D';

export interface TaskOption {
  key: OptionKey;
  label: string;
}

export interface MaturaTask {
  id: number;
  topicId: TopicId;
  topicName: string;
  level: MaturaLevel;
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
  extensionOnly?: boolean;
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
  extensionOnly: boolean;
  totalTasks: number;
  basicTasks: number;
  extensionTasks: number;
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
