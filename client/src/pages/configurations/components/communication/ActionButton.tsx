/**
 * @file ActionButton.tsx
 * @description A reusable button for general actions, styled to match the UI.
 */

import React from 'react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export default function ActionButton({ label, ...props }: ActionButtonProps) {
  return (
    <button
      {...props}
      className="bg-[#444444] w-full py-2 rounded-4xl text-white hover:bg-[#333333] transition-colors focus:outline-none focus:ring-2 focus:ring-[#006699] hover:cursor-pointer"
    >
      {label}
    </button>
  );
}
