/**
 * @file ReversedCheckbox.tsx
 * @description A component for the "Reversed" label and its associated checkbox.
 */


interface CheckboxProps {
  /** The label text to display next to the checkbox. */
  label: string;
  /** The current checked state of the checkbox. */
  isChecked: boolean;
  /** A callback function that is fired when the checkbox is toggled. */
  onChange: (isReversed: boolean) => void;
}

export default function Checkbox({ label,isChecked, onChange }: CheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white">{label}</span>
      <input
        type="checkbox"
        className="w-4 h-4 accent-[#006699] cursor-pointer rounded-xl"
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  );
}
