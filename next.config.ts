export type SavedProgress = {
  totalXp: number;
  completedQuestions: number;
  streak: number;
  currentLevel: number;
};

export const PROGRESS_STORAGE_KEY = "physics-quest-progress-v1";

export const defaultProgress: SavedProgress = {
  totalXp: 0,
  completedQuestions: 0,
  streak: 0,
  currentLevel: 1,
};

export function calculateLevel(totalXp: number) {
  return Math.max(1, Math.floor(totalXp / 100) + 1);
}

export function loadProgress() {
  if (typeof window === "undefined") {
    return defaultProgress;
  }

  try {
    const rawProgress = window.localStorage.getItem(PROGRESS_STORAGE_KEY);

    if (!rawProgress) {
      return defaultProgress;
    }

    const parsedProgress = JSON.parse(rawProgress) as Partial<SavedProgress>;
    const totalXp = Number(parsedProgress.totalXp) || 0;

    return {
      totalXp,
      completedQuestions: Number(parsedProgress.completedQuestions) || 0,
      streak: Number(parsedProgress.streak) || 0,
      currentLevel: calculateLevel(totalXp),
    };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: SavedProgress) {
  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}

export function addQuestionResult(progress: SavedProgress, xpEarned: number) {
  const totalXp = progress.totalXp + xpEarned;

  return {
    totalXp,
    completedQuestions: progress.completedQuestions + 1,
    streak: progress.streak + 1,
    currentLevel: calculateLevel(totalXp),
  };
}
