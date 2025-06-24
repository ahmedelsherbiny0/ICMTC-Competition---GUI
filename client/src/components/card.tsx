import type { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-fit bg-card-background p-3 rounded-2xl">
      {children}
    </div>
  );
}
