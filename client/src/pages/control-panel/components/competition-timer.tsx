// src/components/CompetitionTimer.tsx
import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { persistedTimeAtom } from "../../../../atoms/atoms";
import Card from "../../../components/card";

function formatTime(ms: number) {
  const centiseconds = Math.floor((ms % 1000) / 10);
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  return `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(
    2,
    "0"
  )} : ${String(seconds).padStart(2, "0")} : ${String(centiseconds).padStart(
    2,
    "0"
  )}`;
}

export default function CompetitionTimer() {
  const [storedTime, setStoredTime] = useAtom(persistedTimeAtom);
  const [running, setRunning] = useState(false);
  const [displayTime, setDisplayTime] = useState(storedTime);
  const startTimestampRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      startTimestampRef.current = Date.now() - storedTime;

      const update = () => {
        const now = Date.now();
        const elapsed = now - (startTimestampRef.current || now);
        setDisplayTime(elapsed);
        animationFrameRef.current = requestAnimationFrame(update);
      };

      animationFrameRef.current = requestAnimationFrame(update);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setStoredTime(displayTime);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [running]);

  const handleReset = () => {
    setRunning(false);
    setStoredTime(0);
    setDisplayTime(0);
    localStorage.removeItem("competition-time");
  };

  return (
    <Card title="Competition Timer">
      <div className="text-3xl text-center mb-4 w-96">
        {formatTime(displayTime)}
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setRunning(true)}
          className="bg-active px-8 py-2 rounded-full font-semibold hover:opacity-80 transition-all"
        >
          Start
        </button>
        <button
          onClick={() => setRunning(false)}
          className="bg-[#009520] px-8 py-2 rounded-full font-semibold hover:opacity-80 transition-all"
        >
          Pause
        </button>
        <button
          onClick={handleReset}
          className="bg-[#9E0000] px-8 py-2 rounded-full font-semibold hover:opacity-80 transition-all"
        >
          Reset
        </button>
      </div>
    </Card>
  );
}
