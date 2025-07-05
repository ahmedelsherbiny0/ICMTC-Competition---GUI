/**
 * @file connection.tsx
 * @description A layout component that arranges the ROV and Controller connection UI.
 * It passes down state and handlers from its parent to the child components.
 */

import ROVConnection from "./rov-connection";
import ControllerConnection from "./controller-connection";

interface ConnectionProps {
  rovConnected: boolean;
  controllerConnected: boolean;
  onRovConnect: () => void;
  onRovDisconnect: () => void;
  gap?: number;
}

export default function Connection({
  rovConnected,
  controllerConnected,
  onRovConnect,
  onRovDisconnect,
  gap = 5,
}: ConnectionProps) {
  return (
    <div className={`flex flex-col gap-${gap} w-full`}>
      <ROVConnection
        isConnected={rovConnected}
        onConnect={onRovConnect}
        onDisconnect={onRovDisconnect}
      />
      <ControllerConnection isConnected={controllerConnected} />
    </div>
  );
}
