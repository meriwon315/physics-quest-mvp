"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import clsx from "clsx";
import {
  formulaTiles as baseFormulaTiles,
  maxPhaseMistakes,
  phaseOneOptions as basePhaseOneOptions,
  phaseTwoOptions as basePhaseTwoOptions,
  phaseXp,
  question,
  resetPopupMessage,
  valueTiles as baseValueTiles,
} from "../../lib/game-data";
import type { SavedProgress } from "../../lib/progress";
import { shuffleItems } from "../../lib/shuffle";
import type {
  ChoiceOption,
  DroppableId,
  Phase,
  PhaseStatus,
  QuestionResult,
  Tile,
  ValueLocation,
} from "../../types";
import {
  ChoiceButton,
  Confetti,
  DraggableTile,
  DropZone,
  FeedbackPanel,
  GameButton,
  OptionGrid,
  PhaseTitle,
  ProgressBar,
  StatPill,
  TileBank,
  TileFace,
} from "../ui";

function createValueLocations() {
  return Object.fromEntries(baseValueTiles.map((tile) => [tile.id, "bank"])) as Record<
    string,
    ValueLocation
  >;
}

export function NewtonGame({
  progress,
  onExit,
  onComplete,
}: {
  progress: SavedProgress;
  onExit: () => void;
  onComplete: (result: QuestionResult) => void;
}) {
  const [phase, setPhase] = useState<Phase>(1);
  const [phaseMistakes, setPhaseMistakes] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [runXp, setRunXp] = useState(0);
  const [phaseStatus, setPhaseStatus] = useState<PhaseStatus>("idle");
  const [message, setMessage] = useState(phaseIntroMessage(1));
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [completionSaved, setCompletionSaved] = useState(false);

  const [phaseOneOptions, setPhaseOneOptions] = useState(basePhaseOneOptions);
  const [phaseTwoOptions, setPhaseTwoOptions] = useState(basePhaseTwoOptions);
  const [formulaTiles, setFormulaTiles] = useState(baseFormulaTiles);
  const [valueTiles, setValueTiles] = useState(baseValueTiles);

  const [removedPhaseOneIds, setRemovedPhaseOneIds] = useState<string[]>([]);
  const [removedPhaseTwoIds, setRemovedPhaseTwoIds] = useState<string[]>([]);
  const [selectedPhaseTwoIds, setSelectedPhaseTwoIds] = useState<string[]>([]);
  const [removedFormulaIds, setRemovedFormulaIds] = useState<string[]>([]);
  const [formulaDropId, setFormulaDropId] = useState<string | null>(null);
  const [valueLocations, setValueLocations] = useState(() => createValueLocations());
  const [answer, setAnswer] = useState("");
  const [unit, setUnit] = useState("");
  const [phaseFourErrors, setPhaseFourErrors] = useState<string[]>([]);
  const [completedPhases, setCompletedPhases] = useState<Phase[]>([]);
  const [activeTileId, setActiveTileId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } }),
  );

  const allTiles = useMemo(() => [...baseFormulaTiles, ...baseValueTiles], []);
  const tileById = useMemo(
    () => Object.fromEntries(allTiles.map((tile) => [tile.id, tile])) as Record<string, Tile>,
    [allTiles],
  );
  const activeTile = activeTileId ? tileById[activeTileId] : null;

  useEffect(() => {
    setPhaseOneOptions(shuffleItems(basePhaseOneOptions));
    setPhaseTwoOptions(shuffleItems(basePhaseTwoOptions));
    setFormulaTiles(shuffleItems(baseFormulaTiles));
    setValueTiles(shuffleItems(baseValueTiles));
  }, []);

  function awardPhase(currentPhase: Phase) {
    if (completedPhases.includes(currentPhase)) {
      return;
    }

    setRunXp((current) => Math.min(80, current + phaseXp[currentPhase]));
    setCompletedPhases((current) => [...current, currentPhase]);
  }

  function moveToPhase(nextPhase: Phase) {
    setPhaseStatus("correct");
    window.setTimeout(() => {
      setPhase(nextPhase);
      setPhaseMistakes(0);
      setPhaseStatus("idle");
      setMessage(phaseIntroMessage(nextPhase));
      shufflePhase(nextPhase);
    }, 650);
  }

  function registerMistake(nextMessage: string, afterMistake?: () => void) {
    const nextPhaseMistakes = phaseMistakes + 1;

    setPhaseMistakes(nextPhaseMistakes);
    setTotalMistakes((current) => current + 1);
    setPhaseStatus("wrong");
    setMessage(nextPhaseMistakes > maxPhaseMistakes ? resetPopupMessage : nextMessage);

    window.setTimeout(() => {
      if (nextPhaseMistakes > maxPhaseMistakes) {
        setResetModalOpen(true);
        return;
      }

      afterMistake?.();
      setPhaseStatus("idle");
    }, 550);
  }

  function resetCurrentPhase() {
    setPhaseMistakes(0);
    setPhaseStatus("idle");
    setMessage(phaseIntroMessage(phase));
    setPhaseFourErrors([]);

    if (phase === 1) {
      setRemovedPhaseOneIds([]);
      setPhaseOneOptions(shuffleItems(basePhaseOneOptions));
    }

    if (phase === 2) {
      setRemovedPhaseTwoIds([]);
      setSelectedPhaseTwoIds([]);
      setPhaseTwoOptions(shuffleItems(basePhaseTwoOptions));
    }

    if (phase === 3) {
      setRemovedFormulaIds([]);
      setFormulaDropId(null);
      setFormulaTiles(shuffleItems(baseFormulaTiles));
    }

    if (phase === 4) {
      setValueLocations(createValueLocations());
      setValueTiles(shuffleItems(baseValueTiles));
      setAnswer("");
      setUnit("");
    }
  }

  function shufflePhase(nextPhase: Phase) {
    if (nextPhase === 1) {
      setPhaseOneOptions(shuffleItems(basePhaseOneOptions));
    }

    if (nextPhase === 2) {
      setPhaseTwoOptions(shuffleItems(basePhaseTwoOptions));
    }

    if (nextPhase === 3) {
      setFormulaTiles(shuffleItems(baseFormulaTiles));
    }

    if (nextPhase === 4) {
      setValueTiles(shuffleItems(baseValueTiles));
    }
  }

  function handlePhaseOneSelect(option: ChoiceOption) {
    if (option.id === "force_correct") {
      awardPhase(1);
      setMessage("Correct. The question asks you to find force, F (N).");
      moveToPhase(2);
      return;
    }

    registerMistake(`${option.label} is not what this question is asking for.`, () => {
      setRemovedPhaseOneIds((current) => [...current, option.id]);
    });
  }

  function handlePhaseTwoSelect(option: ChoiceOption) {
    if (option.isCorrect) {
      const nextSelected = selectedPhaseTwoIds.includes(option.id)
        ? selectedPhaseTwoIds
        : [...selectedPhaseTwoIds, option.id];

      setSelectedPhaseTwoIds(nextSelected);
      setPhaseStatus("correct");

      if (nextSelected.includes("mass_correct") && nextSelected.includes("acceleration_correct")) {
        awardPhase(2);
        setMessage("Correct. The question provides mass, m (kg), and acceleration, a (m/s²).");
        moveToPhase(3);
        return;
      }

      setMessage("Correct. Select one more provided value.");
      window.setTimeout(() => setPhaseStatus("idle"), 650);
      return;
    }

    registerMistake(`${option.label} is not provided in the question.`, () => {
      setRemovedPhaseTwoIds((current) => [...current, option.id]);
    });
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveTileId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTileId(null);

    const tileId = String(event.active.id);
    const overId = event.over?.id as DroppableId | undefined;

    if (!overId) {
      return;
    }

    if (phase === 3 && tileId.startsWith("formula-")) {
      handleFormulaDrag(tileId, overId);
      return;
    }

    if (phase === 4 && tileId.startsWith("value-")) {
      handleValueDrag(tileId, overId);
    }
  }

  function handleFormulaDrag(tileId: string, overId: DroppableId) {
    if (overId === "formulaBank") {
      if (formulaDropId === tileId) {
        setFormulaDropId(null);
      }
      return;
    }

    if (overId !== "formula") {
      return;
    }

    if (tileId === "formula-ma") {
      setFormulaDropId(tileId);
      awardPhase(3);
      setMessage("Correct. F (N) = ma is the right formula.");
      moveToPhase(4);
      return;
    }

    setFormulaDropId(null);
    registerMistake("That formula does not match force, F (N).", () => {
      setRemovedFormulaIds((current) => [...current, tileId]);
    });
  }

  function handleValueDrag(tileId: string, overId: DroppableId) {
    if (overId === "valueBank") {
      setValueLocations((current) => ({ ...current, [tileId]: "bank" }));
      setPhaseFourErrors([]);
      setPhaseStatus("idle");
      setMessage("Tiles can move between the bank and the formula slots.");
      return;
    }

    if (overId !== "massValue" && overId !== "accelerationValue") {
      return;
    }

    setValueLocations((current) => {
      const next = { ...current };
      const tileInTarget = Object.entries(next).find(([, location]) => location === overId)?.[0];

      if (tileInTarget && tileInTarget !== tileId) {
        next[tileInTarget] = "bank";
      }

      next[tileId] = overId;
      return next;
    });
    setPhaseFourErrors([]);
    setPhaseStatus("idle");
    setMessage("You can correct your tile choices before checking.");
  }

  function handlePhaseFourCheck() {
    const errors: string[] = [];

    if (valueLocations["value-2kg"] !== "massValue") {
      errors.push("m (kg) should contain 2 kg.");
    }

    if (valueLocations["value-4ms2"] !== "accelerationValue") {
      errors.push("a (m/s²) should contain 4 m/s².");
    }

    if (answer.trim() !== "8") {
      errors.push("The typed answer should be 8.");
    }

    if (unit.trim().toLowerCase() !== "n") {
      errors.push("The typed unit should be N.");
    }

    setPhaseFourErrors(errors);

    if (errors.length === 0) {
      awardPhase(4);
      setUnit("N");
      setPhaseStatus("complete");
      setMessage("Complete! F (N) = 2 kg × 4 m/s² = 8 N.");
      window.setTimeout(() => {
        if (completionSaved) {
          return;
        }

        setCompletionSaved(true);
        onComplete({
          xpEarned: Math.min(80, runXp + (completedPhases.includes(4) ? 0 : phaseXp[4])),
          mistakesMade: totalMistakes,
          answerSummary: question.answerSummary,
        });
      }, 900);
      return;
    }

    registerMistake("Check the parts listed below and try again.");
  }

  const shownValueTiles = valueTiles.filter((tile) => valueLocations[tile.id] === "bank");

  return (
    <section className="grid gap-5">
      {phaseStatus === "complete" && <Confetti />}

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <header className="rounded-lg border-2 border-[#14213d] bg-[#fff8df] p-4 shadow-[6px_6px_0_#14213d]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase text-[#e76f51]">{question.lesson}</p>
              <h1 className="text-3xl font-black sm:text-5xl">Physics Phase Quest</h1>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <StatPill label="Phase" value={`${phase}/4`} tone="yellow" />
              <StatPill label="Quest XP" value={runXp} tone="blue" />
              <StatPill label="Mistakes" value={`${phaseMistakes}/${maxPhaseMistakes + 1}`} tone="red" />
              <StatPill label="Level" value={progress.currentLevel} tone="green" />
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar phase={phase} />
          </div>
        </header>

        <QuestionCard />

        {phase === 4 && (
          <TileBank id="valueBank" title="Value Tiles From The Question">
            {shownValueTiles.map((tile) => (
              <DraggableTile key={tile.id} tile={tile} />
            ))}
          </TileBank>
        )}

        <section
          className={clsx(
            "rounded-lg border-2 border-[#14213d] bg-white p-4 shadow-[6px_6px_0_#2a9d8f] sm:p-6",
            phaseStatus === "correct" && "animate-correct",
            phaseStatus === "wrong" && "animate-shake",
            phaseStatus === "complete" && "animate-correct",
          )}
        >
          {phase === 1 && (
            <PhaseOne
              options={phaseOneOptions}
              removedOptionIds={removedPhaseOneIds}
              onSelect={handlePhaseOneSelect}
            />
          )}
          {phase === 2 && (
            <PhaseTwo
              options={phaseTwoOptions}
              removedOptionIds={removedPhaseTwoIds}
              selectedOptionIds={selectedPhaseTwoIds}
              onSelect={handlePhaseTwoSelect}
            />
          )}
          {phase === 3 && (
            <PhaseThree
              formulaTiles={formulaTiles}
              removedFormulaIds={removedFormulaIds}
              formulaDropTile={formulaDropId ? tileById[formulaDropId] : null}
            />
          )}
          {phase === 4 && (
            <PhaseFour
              valueLocations={valueLocations}
              tileById={tileById}
              answer={answer}
              unit={unit}
              errors={phaseFourErrors}
              isComplete={phaseStatus === "complete"}
              onAnswerChange={setAnswer}
              onUnitChange={setUnit}
              onCheck={handlePhaseFourCheck}
            />
          )}

          <FeedbackPanel status={phaseStatus} message={message} errors={phaseFourErrors} />
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <GameButton onClick={onExit} variant="ghost">
            Exit to Topics
          </GameButton>
        </div>

        <DragOverlay>{activeTile ? <TileFace label={activeTile.label} isFloating /> : null}</DragOverlay>
      </DndContext>

      {resetModalOpen && (
        <PhaseResetModal
          onClose={() => {
            resetCurrentPhase();
            setResetModalOpen(false);
          }}
        />
      )}
    </section>
  );
}

function QuestionCard() {
  return (
    <section className="rounded-lg border-2 border-[#14213d] bg-[#e9f8ff] p-4 shadow-[6px_6px_0_#f4a261] sm:p-5">
      <p className="text-sm font-black uppercase text-[#277da1]">Question</p>
      <p className="mt-2 text-xl font-extrabold leading-snug sm:text-2xl">{question.text}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-[#516371]">
        <span className="rounded-full bg-white px-3 py-1">Target formula: {question.formula}</span>
        <span className="rounded-full bg-white px-3 py-1">Question values: 2 kg, 4 m/s²</span>
      </div>
    </section>
  );
}

function PhaseOne({
  options,
  removedOptionIds,
  onSelect,
}: {
  options: ChoiceOption[];
  removedOptionIds: string[];
  onSelect: (option: ChoiceOption) => void;
}) {
  return (
    <div>
      <PhaseTitle eyebrow="Phase 1" title="What is the question asking you to find?" />
      <OptionGrid>
        {options
          .filter((option) => !removedOptionIds.includes(option.id))
          .map((option) => (
            <ChoiceButton key={option.id} label={option.label} onClick={() => onSelect(option)} />
          ))}
      </OptionGrid>
    </div>
  );
}

function PhaseTwo({
  options,
  removedOptionIds,
  selectedOptionIds,
  onSelect,
}: {
  options: ChoiceOption[];
  removedOptionIds: string[];
  selectedOptionIds: string[];
  onSelect: (option: ChoiceOption) => void;
}) {
  return (
    <div>
      <PhaseTitle eyebrow="Phase 2" title="What information is provided in the question?" />
      <OptionGrid>
        {options
          .filter((option) => !removedOptionIds.includes(option.id))
          .map((option) => (
            <ChoiceButton
              key={option.id}
              label={option.label}
              isSelected={selectedOptionIds.includes(option.id)}
              onClick={() => onSelect(option)}
            />
          ))}
      </OptionGrid>
    </div>
  );
}

function PhaseThree({
  formulaTiles,
  removedFormulaIds,
  formulaDropTile,
}: {
  formulaTiles: Tile[];
  removedFormulaIds: string[];
  formulaDropTile: Tile | null;
}) {
  const availableTiles = formulaTiles.filter(
    (tile) => !removedFormulaIds.includes(tile.id) && tile.id !== formulaDropTile?.id,
  );

  return (
    <div>
      <PhaseTitle
        eyebrow="Phase 3"
        title="The question is looking for force, F (N). Which formula should be used?"
      />
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-lg bg-[#fff3d6] p-4">
          <div className="flex flex-wrap items-center gap-3 text-2xl font-black sm:text-3xl">
            <span>F (N) =</span>
            <DropZone id="formula" tile={formulaDropTile} placeholder="formula" />
          </div>
        </div>
        <TileBank id="formulaBank" title="Formula Tiles">
          {availableTiles.map((tile) => (
            <DraggableTile key={tile.id} tile={tile} />
          ))}
        </TileBank>
      </div>
    </div>
  );
}

function PhaseFour({
  valueLocations,
  tileById,
  answer,
  unit,
  errors,
  isComplete,
  onAnswerChange,
  onUnitChange,
  onCheck,
}: {
  valueLocations: Record<string, ValueLocation>;
  tileById: Record<string, Tile>;
  answer: string;
  unit: string;
  errors: string[];
  isComplete: boolean;
  onAnswerChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  onCheck: () => void;
}) {
  const massTileId = Object.entries(valueLocations).find(([, location]) => location === "massValue")?.[0];
  const accelerationTileId = Object.entries(valueLocations).find(
    ([, location]) => location === "accelerationValue",
  )?.[0];
  const massWrong = errors.some((error) => error.includes("m (kg)"));
  const accelerationWrong = errors.some((error) => error.includes("a (m/s²)"));
  const answerWrong = errors.some((error) => error.includes("typed answer"));
  const unitWrong = errors.some((error) => error.includes("typed unit"));

  return (
    <div>
      <PhaseTitle
        eyebrow="Phase 4"
        title="Substitute the correct values from the question, then type the final answer and unit."
      />
      <div className="mt-5 rounded-lg bg-[#f3fff6] p-4">
        <div className="grid gap-4 text-2xl font-black sm:text-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span>F (N) =</span>
            <DropZone
              id="massValue"
              tile={massTileId ? tileById[massTileId] : null}
              placeholder="m (kg)"
              isWrong={massWrong}
            />
            <DropZone
              id="accelerationValue"
              tile={accelerationTileId ? tileById[accelerationTileId] : null}
              placeholder="a (m/s²)"
              isWrong={accelerationWrong}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span>=</span>
            <input
              value={answer}
              onChange={(event) => onAnswerChange(event.target.value)}
              inputMode="numeric"
              disabled={isComplete}
              className={clsx(
                "h-14 w-28 rounded-lg border-2 border-[#14213d] bg-white px-3 text-center font-black outline-none focus:ring-4 focus:ring-[#90e0ef]",
                answerWrong && "border-[#e63946] bg-[#ffe5e8]",
              )}
              aria-label="typed answer"
            />
            <input
              value={unit}
              onChange={(event) => onUnitChange(event.target.value)}
              disabled={isComplete}
              className={clsx(
                "h-14 w-24 rounded-lg border-2 border-[#14213d] bg-white px-3 text-center font-black uppercase outline-none focus:ring-4 focus:ring-[#90e0ef]",
                unitWrong && "border-[#e63946] bg-[#ffe5e8]",
              )}
              aria-label="typed unit"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={onCheck}
          disabled={isComplete}
          className="mt-5 w-full rounded-lg border-2 border-[#14213d] bg-[#2a9d8f] px-4 py-3 font-black text-white shadow-[4px_4px_0_#14213d] disabled:cursor-not-allowed disabled:bg-[#8bdccf] sm:w-auto"
        >
          Check Final Answer
        </button>
      </div>
    </div>
  );
}

function PhaseResetModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-[#14213d]/60 px-4">
      <div className="w-full max-w-md rounded-lg border-2 border-[#14213d] bg-white p-5 text-center shadow-[8px_8px_0_#14213d]">
        <p className="text-2xl font-black">Oops!</p>
        <p className="mt-3 text-lg font-bold">{resetPopupMessage}</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 rounded-lg border-2 border-[#14213d] bg-[#fee440] px-5 py-3 font-black shadow-[3px_3px_0_#14213d] active:translate-x-0.5 active:translate-y-0.5"
        >
          Try This Step Again
        </button>
      </div>
    </div>
  );
}

function phaseIntroMessage(phase: Phase) {
  if (phase === 2) {
    return "Select both pieces of information provided in the question.";
  }

  if (phase === 3) {
    return "Drag the correct formula tile into the formula drop zone.";
  }

  if (phase === 4) {
    return "Drag 2 kg and 4 m/s² into the correct slots, then type the answer and unit.";
  }

  return "Choose the answer that matches what the question is asking for.";
}
