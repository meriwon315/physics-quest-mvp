"use client";

import { useEffect, useState } from "react";
import { addQuestionResult, loadProgress, saveProgress, type SavedProgress } from "../lib/progress";
import type { AppScreen, QuestionResult } from "../types";
import { LandingScreen } from "./screens/LandingScreen";
import { TopicScreen } from "./screens/TopicScreen";
import { NewtonGame } from "./screens/NewtonGame";
import { ResultScreen } from "./screens/ResultScreen";

export default function PhysicsQuestApp() {
  const [screen, setScreen] = useState<AppScreen>("landing");
  const [progress, setProgress] = useState<SavedProgress>(() => loadProgress());
  const [latestResult, setLatestResult] = useState<QuestionResult | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  function handleGameComplete(result: QuestionResult) {
    setLatestResult(result);
    setProgress((currentProgress) => {
      const nextProgress = addQuestionResult(currentProgress, result.xpEarned);
      saveProgress(nextProgress);
      return nextProgress;
    });
    setScreen("results");
  }

  function startGame() {
    setLatestResult(null);
    setScreen("game");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#eef8ff] px-4 py-5 text-[#14213d] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        {screen === "landing" && (
          <LandingScreen progress={progress} onStart={() => setScreen("topics")} />
        )}
        {screen === "topics" && (
          <TopicScreen progress={progress} onBack={() => setScreen("landing")} onStart={startGame} />
        )}
        {screen === "game" && (
          <NewtonGame
            progress={progress}
            onExit={() => setScreen("topics")}
            onComplete={handleGameComplete}
          />
        )}
        {screen === "results" && latestResult && (
          <ResultScreen
            progress={progress}
            result={latestResult}
            onReplay={startGame}
            onNext={startGame}
            onTopics={() => setScreen("topics")}
          />
        )}
      </div>
    </main>
  );
}
