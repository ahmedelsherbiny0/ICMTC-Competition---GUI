import { useAtom } from 'jotai';
import { controlModeAtom } from '../../../../atoms/atoms';

export default function ControlModeToggle() {
  const [controlMode, setControlMode] = useAtom(controlModeAtom);

  const ToggleButton = ({ mode }: { mode: 'PILOT' | 'AUTONOMOUS' }) => (
    <button
      onClick={() => setControlMode(mode)}
      className={`
        px-8 py-2 rounded-full text-lg font-bold transition-colors
        ${controlMode === mode ? 'bg-active text-white' : 'bg-component-background text-gray-400'}
      `}
    >
      {mode}
    </button>
  );

  return (
    <div className="bg-card-background p-2 rounded-full flex items-center gap-2">
      <ToggleButton mode="PILOT" />
      <ToggleButton mode="AUTONOMOUS" />
    </div>
  );
}