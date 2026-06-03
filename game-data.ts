import clsx from "clsx";
import type { BankId, DropZoneId, Phase, PhaseStatus, Tile } from "../types";
import { useDraggable, useDroppable } from "@dnd-kit/core";

export function GameButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "rounded-lg border-2 border-[#14213d] px-4 py-3 font-black shadow-[4px_4px_0_#14213d] transition active:translate-x-0.5 active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-[#fee440]",
        variant === "secondary" && "bg-[#2a9d8f] text-white",
        variant === "ghost" && "bg-white",
      )}
    >
      {children}
    </button>
  );
}

export function StatPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: "yellow" | "blue" | "red" | "green";
}) {
  return (
    <div
      className={clsx(
        "min-w-0 rounded-lg border-2 border-[#14213d] px-2 py-2 text-center sm:px-3",
        tone === "yellow" && "bg-[#fee440]",
        tone === "blue" && "bg-[#caf0f8]",
        tone === "red" && "bg-[#ffd6d6]",
        tone === "green" && "bg-[#d8f3dc]",
      )}
    >
      <p className="truncate text-[0.65rem] font-black uppercase leading-tight sm:text-xs">{label}</p>
      <p className="text-2xl font-black leading-tight sm:text-xl">{value}</p>
    </div>
  );
}

export function ProgressBar({ phase }: { phase: Phase }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-black uppercase text-[#536471]">
        <span>Identify</span>
        <span>Info</span>
        <span>Formula</span>
        <span>Solve</span>
      </div>
      <div className="mt-2 h-4 overflow-hidden rounded-full border-2 border-[#14213d] bg-white">
        <div
          className="h-full rounded-full bg-[#2a9d8f] transition-all duration-500"
          style={{ width: `${(phase / 4) * 100}%` }}
        />
      </div>
    </div>
  );
}

export function PhaseTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-sm font-black uppercase text-[#e76f51]">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-black leading-tight sm:text-3xl">{title}</h2>
    </div>
  );
}

export function FeedbackPanel({
  status,
  message,
  errors,
}: {
  status: PhaseStatus;
  message: string;
  errors: string[];
}) {
  return (
    <div
      className={clsx(
        "mt-5 rounded-lg border-2 border-[#14213d] p-4",
        status === "correct" && "bg-[#d8f3dc]",
        status === "wrong" && "bg-[#ffe5e8]",
        status === "complete" && "bg-[#fff3d6]",
        status === "idle" && "bg-[#f8f9fa]",
      )}
    >
      <p className="text-sm font-black uppercase text-[#536471]">Feedback</p>
      <p className="mt-1 text-lg font-black">{message}</p>
      {errors.length > 0 && (
        <ul className="mt-3 grid gap-1 text-sm font-bold text-[#d62828]">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function OptionGrid({ children }: { children: React.ReactNode }) {
  return <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export function ChoiceButton({
  label,
  isSelected = false,
  onClick,
}: {
  label: string;
  isSelected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isSelected}
      className={clsx(
        "min-h-16 rounded-lg border-2 border-[#14213d] px-4 py-3 text-lg font-black shadow-[4px_4px_0_#14213d] transition active:translate-x-0.5 active:translate-y-0.5",
        isSelected ? "bg-[#d8f3dc] text-[#1b7f5a]" : "bg-[#caf0f8] hover:bg-[#90e0ef]",
      )}
    >
      {label}
    </button>
  );
}

export function DraggableTile({ tile, disabled = false }: { tile: Tile; disabled?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: tile.id,
    disabled,
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      className={clsx("touch-none", disabled && "cursor-default")}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      }}
      {...listeners}
      {...attributes}
    >
      <TileFace label={tile.label} muted={isDragging} disabled={disabled} />
    </button>
  );
}

export function DropZone({
  id,
  tile,
  placeholder,
  isWrong = false,
}: {
  id: DropZoneId;
  tile: Tile | null;
  placeholder: string;
  isWrong?: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "flex min-h-16 min-w-32 items-center justify-center rounded-lg border-2 border-dashed px-3 transition",
        isOver && "scale-[1.03] border-[#2a9d8f] bg-[#d8f3dc]",
        isWrong && "border-[#e63946] bg-[#ffe5e8]",
        !isWrong && !isOver && "border-[#6c757d] bg-white",
      )}
    >
      {tile ? <DraggableTile tile={tile} /> : <span className="text-sm font-black text-[#7a8790]">{placeholder}</span>}
    </div>
  );
}

export function TileBank({
  id,
  title,
  children,
}: {
  id: BankId;
  title: string;
  children: React.ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <aside
      ref={setNodeRef}
      className={clsx(
        "rounded-lg border-2 border-[#14213d] bg-[#ecfdf3] p-4 transition",
        isOver && "scale-[1.01] bg-[#d8f3dc]",
      )}
    >
      <h3 className="text-lg font-black">{title}</h3>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{children}</div>
    </aside>
  );
}

export function TileFace({
  label,
  isFloating = false,
  muted = false,
  disabled = false,
}: {
  label: string;
  isFloating?: boolean;
  muted?: boolean;
  disabled?: boolean;
}) {
  return (
    <span
      className={clsx(
        "flex w-full select-none items-center justify-center rounded-lg border-2 border-[#14213d] text-center font-black text-[#14213d] shadow-[4px_4px_0_#14213d]",
        disabled ? "bg-[#dfe7ec]" : "bg-[#90e0ef]",
        "min-h-16 px-4 py-3 text-lg",
        isFloating && "min-w-32 rotate-2",
        muted && "opacity-30",
      )}
    >
      {label}
    </span>
  );
}

export function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {Array.from({ length: 24 }).map((_, index) => (
        <span
          key={index}
          className="confetti-piece"
          style={{
            left: `${(index * 43) % 100}%`,
            animationDelay: `${index * 0.07}s`,
            backgroundColor: ["#2a9d8f", "#fee440", "#e76f51", "#90e0ef"][index % 4],
          }}
        />
      ))}
    </div>
  );
}
