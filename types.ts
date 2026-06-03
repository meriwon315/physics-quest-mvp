import type { Phase, ChoiceOption, Tile } from "../types";

export const maxPhaseMistakes = 2;
export const resetPopupMessage =
  "Oops, too many mistakes in this phase. Let's try this step again.";

export const question = {
  id: "newtons-second-law-1",
  topic: "Forces and Motion",
  lesson: "Newton's Second Law",
  text: "A 2 kg object accelerates at 4 m/s². Calculate the resultant force.",
  formula: "F = ma",
  answerSummary: "F = ma = 2 kg × 4 m/s² = 8 N",
};

export const phaseXp: Record<Phase, number> = {
  1: 10,
  2: 20,
  3: 20,
  4: 30,
};

export const phaseOneOptions: ChoiceOption[] = [
  { id: "force_correct", label: "Force, F (N)", isCorrect: true },
  { id: "speed_regular", label: "Speed, v (m/s)", isCorrect: false },
  { id: "acceleration_regular", label: "Acceleration, a (m/s²)", isCorrect: false },
  { id: "mass_regular", label: "Mass, m (kg)", isCorrect: false },
  { id: "force_confusing", label: "Force, F (kg)", isCorrect: false },
  { id: "distance_regular", label: "Distance, s (m)", isCorrect: false },
];

export const phaseTwoOptions: ChoiceOption[] = [
  { id: "mass_correct", label: "Mass, m (kg)", isCorrect: true },
  { id: "acceleration_correct", label: "Acceleration, a (m/s²)", isCorrect: true },
  { id: "force_regular", label: "Force, F (N)", isCorrect: false },
  { id: "velocity_regular", label: "Velocity, v (m/s)", isCorrect: false },
  { id: "force_confusing", label: "Force, F (kg)", isCorrect: false },
  { id: "speed_confusing", label: "Speed, v (N)", isCorrect: false },
];

export const formulaTiles: Tile[] = [
  { id: "formula-ma", label: "ma", isCorrect: true },
  { id: "formula-ma2", label: "ma²" },
  { id: "formula-m-over-a", label: "m/a" },
  { id: "formula-a-over-m", label: "a/m" },
  { id: "formula-mv", label: "mv" },
  { id: "formula-m-plus-a", label: "m + a" },
];

export const valueTiles: Tile[] = [
  { id: "value-2kg", label: "2 kg", isCorrect: true },
  { id: "value-4ms2", label: "4 m/s²", isCorrect: true },
  { id: "value-2n", label: "2 N" },
  { id: "value-4kg", label: "4 kg" },
  { id: "value-8n", label: "8 N" },
  { id: "value-05ms2", label: "0.5 m/s²" },
];

export const unlockedTopic = {
  id: "newtons-second-law",
  group: "Forces and Motion",
  title: "Newton's Second Law",
  description: "Build F = ma step by step using drag-and-drop values.",
};

export const lockedTopics = [
  "Speed, Distance, Time",
  "Density",
  "Pressure",
  "Energy",
  "Electricity",
];
