/**
 * @file gripper.tsx
 * @version 2.0.0
 * @description The main container component for the "Grippers Configuration" card,
 * updated to match the latest UI design with a display-only slider and toggleable items.
 */

import { useState, useEffect, useCallback } from 'react';
import { socket, events } from '../../../../utils/socket/socket';
import Card from '../../../../components/card';
import ConfigurationRow from '../ConfigurationRow';

// ============================================================================
//                                  TYPES
// ============================================================================

/**
 * Defines the shape of a single gripper's configuration object.
 */
interface Gripper {
  location: string;
  enabled: boolean; 
}

// ============================================================================
//                      GRIPPERS CONFIGURATION COMPONENT
// ============================================================================

export default function GrippersConfiguration() {
  const [grippers, setGrippers] = useState<Gripper[]>([]);

  /**
   * Effect hook to fetch initial configuration from the server.
   */
  useEffect(() => {
    const handleConfigData = (config: { grippers?: Gripper[] }) => {
      if (config.grippers && Array.isArray(config.grippers)) {
        // Ensure incoming data has an 'enabled' property, or add it by default.
        const grippersWithState = config.grippers.map(g => ({
          ...g,
          enabled: g.enabled !== undefined ? g.enabled : true,
        }));
        setGrippers(grippersWithState);
      }
    };
    
    socket.on('config:data', handleConfigData);
    events.getRovConfig(); // Request the full config on mount

    return () => {
      socket.off('config:data', handleConfigData);
    };
  }, []);

  /**
   * Effect hook to send debounced updates when the configuration changes.
   */
  useEffect(() => {
    if (grippers.length === 0) return;
    const debounceTimer = setTimeout(() => {
      events.updateRovConfig({ grippers });
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [grippers]);

  /**
   * A single, unified handler for all changes to a gripper's state.
   * Handles 'location' and the 'enabled' property.
   */
  const handleGripperChange = useCallback((
    index: number,
    key: "location" | "enabled",
    value: string | boolean
  ) => {
    setGrippers(currentGrippers => {
      const newGrippers = [...currentGrippers];
      newGrippers[index] = { ...newGrippers[index], [key]: value };
      return newGrippers;
    });
  }, []);

  
  const gripperLocationOptions = ["front", "back"];

  

  if (grippers.length === 0) {
    return <Card title="Grippers Configuration"><p className="text-center text-gray-400">Loading...</p></Card>;
  }

  return (
    <Card title='Grippers Configuration'>
      

      {/* List of Gripper Configuration Rows */}
      <div className="flex flex-col gap-3">
        {grippers.map((gripper, index) => (
          <ConfigurationRow
            key={index}
            label={`Gripper ${index + 1}`}
            enabled={gripper.enabled}
            onToggleEnabled={() => handleGripperChange(index, "enabled", !gripper.enabled)}
            locationValue={gripper.location}
            locationOptions={gripperLocationOptions}
            onLocationChange={(newLocation) => handleGripperChange(index, "location", newLocation)}
            showReversed={false} // Grippers do not need a "Reversed" checkbox
          />
        ))}
      </div>
    </Card>
  );
}
