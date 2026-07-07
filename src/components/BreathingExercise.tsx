"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import type { Language } from "@/lib/types";

interface BreathingExerciseProps {
  language: Language;
  onClose: () => void;
}

type Phase = "ready" | "inhale" | "hold" | "exhale" | "pause" | "done";

const phases: Phase[] = ["inhale", "hold", "exhale", "pause"];
const phaseDurations: Record<string, Record<Phase, number>> = {
  "4-7-8": { ready: 0, inhale: 4, hold: 7, exhale: 8, pause: 0, done: 0 },
  box: { ready: 0, inhale: 4, hold: 4, exhale: 4, pause: 4, done: 0 },
};

const phaseLabels: Record<Language, Record<Phase, string>> = {
  ur: {
    ready: "تیار ہو جائیں",
    inhale: "سانس لیں",
    hold: "روکیں",
    exhale: "چھوڑیں",
    pause: "رکیں",
    done: "شاباش!",
  },
  en: {
    ready: "Get Ready",
    inhale: "Breathe In",
    hold: "Hold",
    exhale: "Breathe Out",
    pause: "Pause",
    done: "Well Done!",
  },
  pa: {
    ready: "تیار ہو جاؤ",
    inhale: "سانس لؤ",
    hold: "روکو",
    exhale: "چھڈو",
    pause: "رکو",
    done: "شاباش!",
  },
  sd: {
    ready: "تيار ٿيو",
    inhale: "سانهن وٺو",
    hold: "روڪيو",
    exhale: "ڇڏيو",
    pause: "رڪيو",
    done: "شاباش!",
  },
};

const phaseColors: Record<Phase, string> = {
  ready: "from-teal-400 to-emerald-400",
  inhale: "from-blue-400 to-teal-400",
  hold: "from-teal-400 to-teal-600",
  exhale: "from-emerald-400 to-teal-400",
  pause: "from-slate-300 to-teal-300",
  done: "from-emerald-400 to-green-400",
};

export default function BreathingExercise({ language, onClose }: BreathingExerciseProps) {
  const [exerciseType, setExerciseType] = useState<"4-7-8" | "box">("4-7-8");
  const [phase, setPhase] = useState<Phase>("ready");
  const [timeLeft, setTimeLeft] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const totalCycles = 4;

  const nextPhase = useCallback(() => {
    const durations = phaseDurations[exerciseType];
    const activePhasesFiltered = phases.filter(
      (p) => durations[p] > 0
    );

    setPhaseIndex((prev) => {
      const nextIdx = (prev + 1) % activePhasesFiltered.length;
      const nextPhaseVal = activePhasesFiltered[nextIdx];

      if (nextIdx === 0) {
        setCycles((c) => {
          const newCycles = c + 1;
          if (newCycles >= totalCycles) {
            setPhase("done");
            setIsRunning(false);
            return newCycles;
          }
          return newCycles;
        });
      }

      setPhase(nextPhaseVal);
      setTimeLeft(durations[nextPhaseVal]);
      return nextIdx;
    });
  }, [exerciseType]);

  useEffect(() => {
    if (!isRunning || phase === "done") return;

    if (timeLeft <= 0) {
      nextPhase();
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [isRunning, timeLeft, phase, nextPhase]);

  const startExercise = () => {
    const durations = phaseDurations[exerciseType];
    const firstPhase = phases.find((p) => durations[p] > 0) || "inhale";
    setPhase(firstPhase);
    setTimeLeft(durations[firstPhase]);
    setCycles(0);
    setPhaseIndex(0);
    setIsRunning(true);
  };

  const resetExercise = () => {
    setPhase("ready");
    setIsRunning(false);
    setCycles(0);
    setPhaseIndex(0);
    setTimeLeft(3);
  };

  const circleSize = phase === "inhale" ? "scale-150" : phase === "exhale" ? "scale-75" : "scale-100";
  const isRTL = language !== "en";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
        {/* Header */}
        <div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
          <h2 className={`text-xl font-bold text-teal-700 ${isRTL ? "font-urdu" : ""}`}>
            {language === "ur" ? "سانس لینے کی مشق" : language === "pa" ? "سانس دی مشق" : language === "sd" ? "سانهن جي مشق" : "Breathing Exercise"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Exercise type selector */}
        {!isRunning && phase === "ready" && (
          <div className="flex gap-2 mb-6 bg-teal-50 p-1 rounded-xl">
            {(["4-7-8", "box"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setExerciseType(type)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                  exerciseType === type
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-teal-700 hover:bg-teal-100"
                }`}
              >
                {type === "4-7-8"
                  ? language === "ur" ? "4-7-8 سانس" : "4-7-8 Breath"
                  : language === "ur" ? "باکس سانس" : "Box Breath"}
              </button>
            ))}
          </div>
        )}

        {/* Breathing circle */}
        <div className="flex flex-col items-center my-8">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Outer pulse rings */}
            {isRunning && phase === "inhale" && (
              <>
                <div className="absolute w-48 h-48 rounded-full bg-teal-200 opacity-40 pulse-ring" />
                <div className="absolute w-48 h-48 rounded-full bg-teal-100 opacity-30" style={{ animationDelay: "0.5s" }} />
              </>
            )}

            {/* Main circle */}
            <div
              className={`w-36 h-36 rounded-full bg-gradient-to-br ${phaseColors[phase]} shadow-lg flex items-center justify-center transition-transform duration-1000 ease-in-out ${circleSize}`}
            >
              <div className="text-center text-white">
                {phase !== "ready" && phase !== "done" && (
                  <div className="text-4xl font-bold">{timeLeft}</div>
                )}
                {phase === "done" && <div className="text-3xl">✨</div>}
                {phase === "ready" && <div className="text-3xl">🌿</div>}
              </div>
            </div>
          </div>

          {/* Phase label */}
          <div className={`mt-4 text-2xl font-bold text-teal-700 ${isRTL ? "font-urdu" : ""}`}>
            {phaseLabels[language][phase]}
          </div>

          {/* Cycle counter */}
          {isRunning && (
            <div className="flex gap-2 mt-3">
              {Array.from({ length: totalCycles }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i < cycles ? "bg-teal-600" : i === cycles ? "bg-teal-300" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        {!isRunning && phase === "ready" && (
          <p className={`text-slate-500 text-sm text-center mb-6 ${isRTL ? "font-urdu" : ""}`}>
            {exerciseType === "4-7-8"
              ? language === "ur"
                ? "4 سیکنڈ سانس لیں، 7 سیکنڈ روکیں، 8 سیکنڈ چھوڑیں"
                : "Inhale 4s · Hold 7s · Exhale 8s"
              : language === "ur"
              ? "4 سیکنڈ سانس، 4 روکیں، 4 چھوڑیں، 4 رکیں"
              : "Inhale 4s · Hold 4s · Exhale 4s · Pause 4s"}
          </p>
        )}

        {/* Controls */}
        <div className="flex gap-3">
          {phase === "done" ? (
            <button onClick={resetExercise} className="btn-primary w-full">
              {language === "ur" ? "دوبارہ کریں" : "Try Again"}
            </button>
          ) : !isRunning ? (
            <button onClick={startExercise} className="btn-primary w-full">
              {language === "ur" ? "شروع کریں" : language === "pa" ? "شروع کرو" : language === "sd" ? "شروع ڪريو" : "Start"}
            </button>
          ) : (
            <button
              onClick={resetExercise}
              className="btn-secondary w-full"
            >
              {language === "ur" ? "روکیں" : "Stop"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
