/**
 * @file sensor.tsx
 * @version 1.0.0
 * @description The main container component for the "Sensor Configuration" card.
 * It reuses the generic ConfigurationRow component to display and manage settings
 * for a dynamic number of sensors.
 */

import {useState, useEffect, useCallback} from "react";
import {socket, events} from "../../../../utils/socket/socket";
import Card from "../../../../components/card";
import NumberInput from "./NumberInput";
import ConfigurationRow from "../ConfigurationRow"; // Reusing the generic row component

// ============================================================================
//                                  TYPES
// ============================================================================

/**
 * Defines the shape of a single sensor's configuration object.
 * Note: We call the location 'type' to match the server-side model,
 * but pass it to the 'locationValue' prop of the generic row component.
 */
interface SensorConfig {
  type: "depth" | "temperature" | "acceleration" | "rotation";
  enabled: boolean;
}

// ============================================================================
//                      SENSORS CONFIGURATION COMPONENT
// ============================================================================

export default function SensorsConfiguration() {
  const [sensors, setSensors] = useState<SensorConfig[]>([]);

  /**
   * Effect hook to fetch the initial sensor configuration from the server.
   */
  useEffect(() => {
    const handleConfigData = (config: {sensors?: SensorConfig[]}) => {
      if (config.sensors && Array.isArray(config.sensors)) {
        setSensors(config.sensors);
      }
    };

    socket.on("config:data", handleConfigData);
    events.getRovConfig();

    return () => {
      socket.off("config:data", handleConfigData);
    };
  }, []);

  /**
   * Effect hook to send debounced updates to the server when the sensor config changes.
   */
  useEffect(() => {
    if (!sensors || sensors.length === 0) return;

    const debounceTimer = setTimeout(() => {
      events.updateRovConfig({sensors});
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [sensors]);

  /**
   * Handles changes to the number of sensors from the NumberInput component.
   */
  const handleQuantityChange = (newQuantity: number) => {
    setSensors((currentSensors) => {
      const currentLength = currentSensors.length;
      if (newQuantity > currentLength) {
        const newItems = Array(newQuantity - currentLength).fill({
          type: "depth", // Default type, can be changed later
          enabled: true,
        });
        return [...currentSensors, ...newItems];
      } else {
        return currentSensors.slice(0, newQuantity);
      }
    });
  };

  /**
   * A unified handler for any change within a sensor row.
   */
  const handleSensorChange = useCallback(
    (
      index: number,
      key: "type" | "enabled",
      value: string | boolean
    ) => {
      setSensors((currentSensors) => {
        const newSensors = [...currentSensors];
        if (key === "type") {
          newSensors[index] = {
            ...newSensors[index],
            type: value as SensorConfig["type"],
          };
        } else if (key === "enabled") {
          newSensors[index] = {
            ...newSensors[index],
            enabled: value as boolean,
          };
        }
        return newSensors;
      });
    },
    []
  );

  // Define the options for the sensor type dropdown.
  const sensorTypeOptions = [
    "depth",
    "temperature",
    "acceleration",
    "rotation",
  ];

  return (
    <Card title="Sensor Configuration">
      {/* Quantity Control Section */}
      <div className="flex items-center justify-between text-sm px-2 text-gray-300">
        <span className="font-semibold text-lg">Quantity</span>
        <div className="w-15" />
        <NumberInput
          value={sensors.length}
          onChange={handleQuantityChange}
          min={0}
          max={6} // Set a reasonable maximum.
        />
      </div>
      {/* Divider Line */}
      <div className="border-t border-gray-600 my-2" />

      {/* Divider Line */}
      <div className="border-t border-gray-700 my-2" />

      {/* List of dynamically rendered Sensor Configuration Rows */}
      <div className="flex flex-col gap-3">
        {sensors.map((sensor, index) => (
          <ConfigurationRow
            key={index}
            label={`Sensor ${index + 1}`}
            enabled={sensor.enabled}
            onToggleEnabled={() =>
              handleSensorChange(index, "enabled", !sensor.enabled)
            }
            // Map the sensor 'type' to the generic 'location' props
            locationValue={sensor.type}
            locationOptions={sensorTypeOptions}
            onLocationChange={(newType) =>
              handleSensorChange(index, "type", newType)
            }
            // Hide the 'Reversed' checkbox as it's not needed for sensors
            showReversed={false}
          />
        ))}
      </div>
    </Card>
  );
}
