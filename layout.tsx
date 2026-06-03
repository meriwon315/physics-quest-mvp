import { lockedTopics, unlockedTopic } from "../../lib/game-data";
import type { SavedProgress } from "../../lib/progress";
import { GameButton, StatPill } from "../ui";

export function TopicScreen({
  progress,
  onBack,
  onStart,
}: {
  progress: SavedProgress;
  onBack: () => void;
  onStart: () => void;
}) {
  return (
    <section className="grid gap-5">
      <header className="rounded-lg border-2 border-[#14213d] bg-[#fff8df] p-4 shadow-[6px_6px_0_#14213d]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-[#e76f51]">Choose a topic</p>
            <h1 className="text-3xl font-black sm:text-5xl">Physics Map</h1>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <StatPill label="XP" value={progress.totalXp} tone="blue" />
            <StatPill label="Level" value={progress.currentLevel} tone="yellow" />
            <StatPill label="Done" value={progress.completedQuestions} tone="green" />
            <StatPill label="Streak" value={progress.streak} tone="red" />
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-lg border-2 border-[#14213d] bg-white p-5 shadow-[6px_6px_0_#2a9d8f]">
          <p className="text-sm font-black uppercase text-[#277da1]">{unlockedTopic.group}</p>
          <h2 className="mt-2 text-3xl font-black">{unlockedTopic.title}</h2>
          <p className="mt-3 font-bold text-[#536471]">{unlockedTopic.description}</p>
          <div className="mt-5">
            <GameButton onClick={onStart}>Play This Quest</GameButton>
          </div>
        </article>

        <aside className="rounded-lg border-2 border-[#14213d] bg-[#f8f9fa] p-5 shadow-[6px_6px_0_#e76f51]">
          <h2 className="text-xl font-black">Coming Soon</h2>
          <div className="mt-4 grid gap-3">
            {lockedTopics.map((topic) => (
              <div
                key={topic}
                className="flex items-center justify-between rounded-lg border-2 border-[#14213d] bg-[#dfe7ec] px-4 py-3 font-black text-[#536471]"
              >
                <span>{topic}</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs uppercase">Locked</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div>
        <GameButton onClick={onBack} variant="ghost">
          Back
        </GameButton>
      </div>
    </section>
  );
}
