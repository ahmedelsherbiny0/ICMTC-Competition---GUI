interface ConnectionButtonProps {
  label: string;
  onClick: () => void;
  connected: boolean;
  className?: string;
}

export default function ConnectionButton({
  label,
  onClick,
  connected,
  className = "",
}: ConnectionButtonProps) {
  return (
    <div
      onClick={onClick}
      className={`${
        connected ? "bg-active" : "bg-component-background"
      } h-fit w-36 py-3 text-center rounded-4xl cursor-pointer ${className} transition-all`}
    >
      {label}
    </div>
  );
}
