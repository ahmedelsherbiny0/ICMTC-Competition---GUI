import React from "react";
import SelectMenu from "../SelectMenu";         // Assumed to exist
import Checkbox from "../Checkbox";             // Assumed to exist
import ConfigItem from "../ConfigItem";           // Assumed to exist

// ============================================================================
//                                  TYPES
// ============================================================================

/**
 * Defines the shape of the configuration object for a single sensor.
 */
export interface SensorConfig {
  type: 'depth' | 'temperature' | 'acceleration' | 'rotation';
  /** Corresponds to the "Graph Display" and the ConfigItem's active state. */
  enabled: boolean;
}

/**
 * Defines the props for the SensorConfigurationRow component.
 */
interface SensorConfigurationRowProps {
  /** The index of the sensor, used for the label (e.g., "Sensor 1"). */
  index: number;
  /** The configuration object for this specific sensor. */
  sensorConfig: SensorConfig;
  /** A callback function that fires when any value in the row is changed. */
  onSensorChange: (newConfig: SensorConfig) => void;
  /** A callback to toggle the enabled state of the sensor. */
  onToggleEnabled: () => void;
}

// ============================================================================
//                       SENSOR CONFIGURATION ROW COMPONENT
// ============================================================================

export default function SensorConfigurationRow({
  index,
  sensorConfig,
  onSensorChange,
  onToggleEnabled,
}: SensorConfigurationRowProps) {
  
  // Define the available sensor types for the dropdown menu.
  const sensorTypeOptions = [
    { value: "depth", label: "Depth" },
    { value: "temperature", label: "Temperature" },
    { value: "acceleration", label: "Acceleration" },
    { value: "rotation", label: "Rotation" },
  ];

  return (
    <div className="flex items-center justify-start gap-4 w-full">
      {/* Clickable Label for the item (e.g., "Sensor 1") */}
      <ConfigItem 
        label={`Sensor ${index + 1}`} 
        enabled={sensorConfig.enabled}
        onClick={onToggleEnabled}
      />

      {/* Gray container for the controls */}
      <div className="flex-grow bg-[#3a3a3a] p-3 rounded-xl flex flex-col justify-center gap-3">
        
        {/* Sensor Type Dropdown */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-sm text-white w-12 flex-shrink-0">Type</span>
          <div className="flex-grow">
            <SelectMenu
              value={sensorConfig.type}
              options={sensorTypeOptions}
              // The `onChange` from the SelectMenu component now correctly receives a string.
              onChange={(e) => onSensorChange({ ...sensorConfig, type: (e.target.value as SensorConfig['type']) })}
            />
          </div>
        </div>

        {/* Graph Display Checkbox */}
        <div className="flex items-center gap-2 w-full">
          {/* The empty div with a fixed width ensures the checkbox aligns with the dropdown above. */}
          <div className="w-12 flex-shrink-0" />
          <div className="flex-grow">
            <Checkbox
              label="Graph Display"
              isChecked={sensorConfig.enabled}
              onChange={(isChecked) => onSensorChange({ ...sensorConfig, enabled: isChecked })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}