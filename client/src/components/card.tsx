import type { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col justify-center items-center w-full h-fit bg-card-background p-3 rounded-2xl">
      {children}
    </div>
  );
}
