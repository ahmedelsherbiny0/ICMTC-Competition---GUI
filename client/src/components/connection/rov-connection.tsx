/**
 * @file rov-connection.tsx
 * @description Renders the UI for connecting and disconnecting the ROV.
 * It receives its state and logic via props.
 */

import ConnectionButton from "./connection-button";

interface ROVConnectionProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function ROVConnection({
  isConnected,
  onConnect,
  onDisconnect,
}: ROVConnectionProps) {
  return (
    <div className="flex justify-between items-center w-full">
      <h1 className="font-bold text-lg">ROV</h1>
      <ConnectionButton
        // The label and onClick action now depend on the `isConnected` prop.
        label={isConnected ? "Disconnect" : "Connect"}
        connected={isConnected}
        onClick={isConnected ? onDisconnect : onConnect}
      />
    </div>
  );
}
