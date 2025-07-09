/**
 * @file communication.tsx
 * @version 1.0.0
 * @description The main container component for the "Communication Configuration" card.
 * It now manages all state and logic for ROV and Controller connections internally,
 * passing them down as props to child components.
 */

import {useEffect, useState} from "react";
import {socket, events} from "../../../../utils/socket/socket";
import Card from "../../../../components/card";
import Connection from "../../../../components/connection/connection";
import SelectMenu from "../SelectMenu";
import ActionButton from "./ActionButton";
import Logs from "./Logs";
import {useAtom} from "jotai";
import {
  isRovConnectedAtom,
  isControllerConnectedAtom,
} from "../../../../../atoms/atoms"; // Import atoms for connection states

export default function Communication() {
  // --- Local State Management ---
  const [comPorts, setComPorts] = useState<{path: string}[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedPort, setSelectedPort] = useState("");
  const [isRovConnected, setIsRovConnected] = useAtom(
    isRovConnectedAtom
  );
  const [isControllerConnected, setIsControllerConnected] = useAtom(
    isControllerConnectedAtom
  );
  /**
   * This primary effect hook manages all socket event listeners and the
   * Gamepad API polling for this component.
   */
  useEffect(() => {
    // --- Socket Event Handlers ---
    const handleLogMessage = (log: {message: string}) => {
      const formattedLog = `>> ${log.message}`;
      setLogs((prev) => [...prev.slice(-20), formattedLog]);
    };

    const handlePortsList = (ports: {path: string}[]) => {
      setComPorts(ports);
    };

    const handleRovConnectionStatus = (status: {
      status: "connected" | "disconnected";
    }) => {
      setIsRovConnected(status.status === "connected");
    };

    // --- Gamepad Connection Polling ---
    const checkGamepad = () => {
      const gamepads = navigator.getGamepads();
      const isConnected = Array.from(gamepads).some(
        (gp) => gp !== null
      );
      // Only update state if it has changed to prevent unnecessary re-renders.
      setIsControllerConnected((prev) =>
        prev === isConnected ? prev : isConnected
      );
    };
    const gamepadInterval = window.setInterval(checkGamepad, 500); // Check every 500 milliseconds.

    // --- Register Listeners ---
    socket.on("rov:log", handleLogMessage);
    socket.on("rov:error", handleLogMessage);
    socket.on("rov:com-ports-list", handlePortsList);
    socket.on("rov:connection-status", handleRovConnectionStatus);

    events.findComPorts(); // Fetch ports on initial component mount
    events.isRovConnected();

    // --- Cleanup Function ---
    return () => {
      socket.off("rov:log", handleLogMessage);
      socket.off("rov:error", handleLogMessage);
      socket.off("rov:com-ports-list", handlePortsList);
      socket.off("rov:connection-status", handleRovConnectionStatus);
      clearInterval(gamepadInterval); // Stop the gamepad polling
    };
  }, [setIsControllerConnected, setIsRovConnected]); // Empty dependency array ensures this runs only once on mount.

  // --- Action Handlers ---
  const handleRovConnect = () => {
    if (selectedPort) {
      events.connectToRov(selectedPort);
      setIsRovConnected(true); // Optimistically set connection status
    } else {
      setLogs((prev) => [
        ...prev.slice(-20),
        ">> Please select a COM port first.",
      ]);
    }
  };

  const handleRovDisconnect = () => {
    events.isRovConnected();

    events.disconnectFromRov();
  };

  // Prepare options for the SelectMenu component
  const portOptions = comPorts.map((port) => ({
    value: port.path,
    label: port.path,
  }));

  return (
    <Card title="Communication Configuration">
      <Connection
        rovConnected={isRovConnected}
        controllerConnected={isControllerConnected}
        onRovConnect={handleRovConnect}
        onRovDisconnect={handleRovDisconnect}
      />
      <div className="h-4" />
      <div className="flex items-center justify-between w-full">
        <span className="text-white text-m font-bold">COM Port</span>
        <div className="w-48">
          <SelectMenu
            value={selectedPort}
            onChange={(e) => setSelectedPort(e.target.value)}
            options={portOptions}
            placeholder="Select Port..."
          />
        </div>
      </div>
      <div className="h-4" />

      <ActionButton
        label="Find COM Ports"
        onClick={() => events.findComPorts()}
      />
      <div className="h-4" />

      <Logs logMessages={logs} />
    </Card>
  );
}
