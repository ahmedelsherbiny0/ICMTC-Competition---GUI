/**
 * @file Logs.tsx
 * @description A component to display a scrolling list of log messages.
 */

import { useRef, useEffect } from 'react';

interface LogsProps {
  logMessages: string[];
}

export default function Logs({ logMessages }: LogsProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  // This effect automatically scrolls the log view to the bottom when new messages arrive.
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logMessages]);

  return (
    <div className="bg-[#444] p-2 rounded-md h-32 w-full overflow-y-auto text-xs font-mono">
      {logMessages.map((log, i) => (
        <p key={i} className="text-green-400 whitespace-pre-wrap">
          {log}
        </p>
      ))}
      {/* This empty div is the target for the auto-scrolling */}
      <div ref={logsEndRef} />
    </div>
  );
}
