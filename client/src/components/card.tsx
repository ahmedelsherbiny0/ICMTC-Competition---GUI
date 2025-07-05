import type { ReactNode } from "react";

export default function Card({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {title && <h2 className="text-l text-center">{title}</h2>}
      <div className="flex flex-col justify-center items-center w-full h-fit bg-card-background p-3 rounded-2xl">
        {children}
      </div>
    </div>
  );
}
