import type { SavedProgress } from "../../lib/progress";
import { GameButton, StatPill } from "../ui";

export function LandingScreen({
  progress,
  onStart,
}: {
  progress: SavedProgress;
  onStart: () => void;
}) {
  return (
    <section className="grid min-h-[calc(100vh-2.5rem)] items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-lg border-2 border-[#14213d] bg-[#fff8df] p-5 shadow-[8px_8px_0_#14213d] sm:p-8">
        <p className="text-sm font-black uppercase text-[#e76f51]">Physics Quest MVP</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight sm:text-6xl">
          Learn physics by building the answer.
        </h1>
        <p className="mt-4 max-w-xl text-lg font-bold text-[#536471]">
          Read a calculation question, identify the physics, drag the correct formula and values,
          then finish the answer like a mini mission.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <GameButton onClick={onStart}>Start Learning</GameButton>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-lg border-2 border-[#14213d] bg-white p-4 shadow-[6px_6px_0_#2a9d8f]">
          <p className="text-sm font-black uppercase text-[#277da1]">Your Progress</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <StatPill label="Total XP" value={progress.totalXp} tone="blue" />
            <StatPill label="Level" value={progress.currentLevel} tone="yellow" />
            <StatPill label="Completed" value={progress.completedQuestions} tone="green" />
            <StatPill label="Streak" value={progress.streak} tone="red" />
          </div>
        </div>
        <div className="rounded-lg border-2 border-[#14213d] bg-[#ecfdf3] p-4 shadow-[6px_6px_0_#f4a261]">
          <p className="text-lg font-black">First quest unlocked</p>
          <p className="mt-2 font-bold text-[#536471]">Forces and Motion: Newton&apos;s Second Law</p>
        </div>
      </div>
    </section>
  );
}
