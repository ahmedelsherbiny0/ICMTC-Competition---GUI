/**
 * @file LocationSelector.tsx
 * @description A component containing a label and a dropdown select menu
 * for choosing an item's physical location on the ROV.
 */

interface LocationSelectorProps {
  /** The currently selected value for the dropdown. */
  value: string;
  /** An array of strings representing the available location options. */
  options: string[];
  /** A callback function that is fired when the dropdown value changes. */
  onChange: (newLocation: string) => void;
}

export default function LocationSelector({ value, options, onChange }: LocationSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white">ROV Location</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#4f4f4f] border-none p-1 rounded-md text-xs w-28 focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
      >
        <option value="None">None</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
        {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
