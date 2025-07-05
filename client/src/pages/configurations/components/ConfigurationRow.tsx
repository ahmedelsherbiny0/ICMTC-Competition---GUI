/**
 * @file ConfigurationRow.tsx
 * @description A container component that assembles the various parts of a
 * configuration row into a single, cohesive unit styled like the provided UI.
 */

import ConfigItem from "./ConfigItem";
import LocationSelector from "./LocationSelector";
import Checkbox from "./Checkbox";


// --- Type Definitions for Props ---
interface ConfigurationRowProps {
  label: string;
  /** The enabled state, passed down to the ConfigItem for styling. */
  enabled: boolean;
  /** The callback to fire when the ConfigItem is clicked. */
  onToggleEnabled: () => void;

  locationValue: string;
  locationOptions: string[];
  onLocationChange: (newLocation: string) => void;

  showReversed: boolean;
  reversedValue?: boolean;
  onReversedChange?: (isReversed: boolean) => void;
}

export default function ConfigurationRow({
  label,
  enabled,
  onToggleEnabled,
  locationValue,
  locationOptions,
  onLocationChange,
  showReversed,
  reversedValue,
  onReversedChange,
}: ConfigurationRowProps) {



  return (
    <div className="flex items-stretch gap-3 w-full">
      {/* Left Side: The clickable ConfigItem button */}
        <ConfigItem
          label={label}
          enabled={enabled}
          onClick={onToggleEnabled}
        />

      {/* Right Side: A gray container for the controls */}
<div className="bg-[#3a3a3a] p-3 rounded-xl flex flex-col gap-3 flex-grow">
  {/* ROV Location Selector */}
  <div className="flex flex-col gap-2">
    <LocationSelector
      value={locationValue}
      options={locationOptions}
      onChange={onLocationChange}
    />
  </div>

  {/* Reversed Checkbox (conditionally rendered) */}
  {showReversed && onReversedChange && (
    <div className="flex items-center gap-2">
      <Checkbox
        isChecked={!!reversedValue}
        onChange={onReversedChange}
        label="Reversed"
      />
    </div>
  )}
</div>
    </div>
  );
}
