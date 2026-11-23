export type TaskType = 'closed' | 'open';

export type MaturaLevel = 'podstawa' | 'rozszerzenie';

export type LevelFilter = MaturaLevel | 'oba';

export type CkeSession = 'maj' | 'czerwiec' | 'sierpien' | 'probna';

export type CkeYear = 2023 | 2024 | 2025 | 2026;

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
  source: string;
  sheetId: string;
  year: CkeYear;
  session: CkeSession;
  type: TaskType;
  points: number;
  question: string;
  options?: TaskOption[];
  correctAnswer: string;
  acceptedAnswers?: string[];
  hint: string;
  solutionSteps: string[];
}

export interface CkeSheet {
  id: string;
  title: string;
  dateLabel: string;
  year: CkeYear;
  session: CkeSession;
  level: MaturaLevel;
  formula: 'Formuła 2023';
  examPdfUrl: string;
  keyPdfUrl: string;
}

export interface CkeSheetStats {
  sheet: CkeSheet;
  totalTasks: number;
  solvedTasks: number;
  correctTasks: number;
  completionPercent: number;
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
