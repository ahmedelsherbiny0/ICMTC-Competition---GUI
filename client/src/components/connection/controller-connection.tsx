/**
 * @file controller-connection.tsx
 * @description Renders the UI for displaying the controller's connection status.
 */

import ConnectionButton from "./connection-button";

interface ControllerConnectionProps {
  isConnected: boolean;
}

export default function ControllerConnection({ isConnected }: ControllerConnectionProps) {
  return (
    <div className="flex justify-between items-center w-full">
      <h1 className="font-bold text-lg">Controller</h1>
      <ConnectionButton
        label={isConnected ? "Connected" : "Disconnected"}
        connected={isConnected}
        // The button is for display only; connection is automatic.
        onClick={() => {}}
        disabled={true}
      />
    </div>
  );
}
