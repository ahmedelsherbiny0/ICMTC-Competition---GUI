/**
 * @file connection-button.tsx
 * @description A reusable, styled button that visually changes based on a 'connected' state.
 */

interface ConnectionButtonProps {
  label: string;
  onClick: () => void;
  connected: boolean;
  className?: string;
  disabled?: boolean;
}

export default function ConnectionButton({
  label,
  onClick,
  connected,
  className = "",
  disabled = false,
}: ConnectionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      // The button's background color and cursor style change based on its state.
      className={`
        ${connected ? "bg-active" : "bg-component-background"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}
        h-fit w-36 py-3 text-center rounded-full transition-all
        ${className}
      `}
    >
      {label}
    </button>
  );
}
