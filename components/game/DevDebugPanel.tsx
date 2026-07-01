'use client';

import { useState } from 'react';
import { useGameStore, STAGE_ORDER } from '@/store/gameStore';
import type { GameStage } from '@/store/gameStore';
import { Button } from '@/components/ui/button';
import { playMutedClick } from '@/lib/sound';

export default function DevDebugPanel() {
  const {
    stage,
    isTimerPaused,
    globalTimeRemaining,
    globalTotalTime,
    score,
    jumpToStage,
    pauseTimer,
    resumeTimer,
    resetGame,
    nextStage,
    hasFinishedOnce
  } = useGameStore();
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="max-sm:fixed max-sm:bottom-[calc(env(safe-area-inset-bottom,0px)+3.5rem)] max-sm:right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-950 text-white border border-neutral-850 shadow-sm text-[9px] font-bold uppercase tracking-wider hover:bg-neutral-900 transition-all cursor-pointer font-mono h-6"
      >
        🛠️ TIME MACHINE & STATS
      </button>
    );
  }

  return (
    <div className="max-sm:fixed max-sm:bottom-[calc(env(safe-area-inset-bottom,0px)+3.5rem)] max-sm:right-4 sm:absolute sm:bottom-full sm:left-4 sm:mb-2 z-50 w-72 max-sm:w-[calc(100vw-2rem)] max-sm:max-w-[280px] bg-card border border-neutral-400 rounded-lg shadow-xl p-4 font-mono text-xs origin-bottom-left animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between border-b border-border pb-2 mb-2 font-bold text-neutral-900">
        <span>🛠️ TIME PORTAL & STATS</span>
        <button onClick={() => setIsOpen(false)} className="hover:text-red-500 font-bold cursor-pointer">[X]</button>
      </div>
      <p className="text-[8.5px] text-neutral-500 leading-tight mb-3 italic font-sans">
        💡 Use this Time Machine to jump back to any selection stage to refine your tech, adjust features, or optimize your USP/Business Model to improve your final score!
      </p>

      <div className="space-y-1 text-[11px] mb-3 text-neutral-700">
        <div>STAGE: <span className="font-bold text-neutral-900">{stage}</span></div>
        <div>TIMER: <span className="font-bold text-neutral-900">{formatTime(globalTimeRemaining)} / {formatTime(globalTotalTime)}</span> ({isTimerPaused ? "PAUSED" : "ACTIVE"})</div>
        
        <div className="mt-2 pt-2 border-t border-dashed border-border/80 text-[10px] space-y-0.5">
          <div className="font-bold text-neutral-900 uppercase">HIDDEN_SCORES:</div>
          <div className="flex justify-between"><span>INNOVATION:</span><span>{score.innovation}/100</span></div>
          <div className="flex justify-between"><span>EXECUTION/FEAS:</span><span>{score.execution}/100</span></div>
          <div className="flex justify-between"><span>DESIGN:</span><span>{score.design}/100</span></div>
          <div className="flex justify-between"><span>PITCH_POTENTIAL:</span><span>{score.pitch}/100</span></div>
          <div className="flex justify-between font-bold text-neutral-800 pt-0.5"><span>BONUS_POINTS:</span><span>+{score.bonus} pts</span></div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 pt-2 border-t border-border/60 text-[10px]">
        <span className="font-bold text-neutral-500 uppercase">SYNTH_SOUND:</span>
        <button
          onClick={() => {
            playMutedClick();
            useGameStore.getState().toggleSound();
          }}
          className={`px-2 py-0.5 rounded border font-mono text-[9px] font-bold cursor-pointer ${
            useGameStore.getState().soundEnabled
              ? "bg-neutral-900 text-white border-neutral-900"
              : "bg-neutral-100 text-neutral-400 border-neutral-200"
          }`}
        >
          {useGameStore.getState().soundEnabled ? "ON" : "MUTED"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-3 pt-2 border-t border-border/60">
        <Button
          size="xs"
          variant="outline"
          onClick={() => {
            playMutedClick();
            if (isTimerPaused) resumeTimer(); else pauseTimer();
          }}
          className="text-[10px] h-7 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:outline-none focus:outline-none"
        >
          {isTimerPaused ? "RESUME_TIME" : "PAUSE_TIME"}
        </Button>
        <Button
          size="xs"
          variant="outline"
          onClick={() => {
            playMutedClick();
            nextStage();
          }}
          className="text-[10px] h-7 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:outline-none focus:outline-none"
        >
          SKIP_STAGE
        </Button>
        <Button
          size="xs"
          variant="destructive"
          onClick={() => {
            playMutedClick();
            resetGame();
          }}
          className="text-[10px] col-span-2 h-7 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:outline-none focus:outline-none"
        >
          RESET_SIMULATOR
        </Button>
      </div>

      <div className="border-t border-border pt-2">
        <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">
          JUMP_TO_STAGE:
        </label>
        <select
          value={stage}
          onChange={(e) => jumpToStage(e.target.value as GameStage)}
          className="w-full bg-white border border-border text-[11px] rounded p-1"
        >
          {STAGE_ORDER.filter((s) => {
            const isEvaluationStage = ['judgeSpin', 'judging', 'results'].includes(s);
            if (isEvaluationStage) {
              return hasFinishedOnce || stage === 'results';
            }
            return true;
          }).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
