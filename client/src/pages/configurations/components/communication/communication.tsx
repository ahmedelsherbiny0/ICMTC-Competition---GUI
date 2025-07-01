import React, {useEffect, useState} from "react";
import {socket, events} from "../../../../utils/socket/socket";
import Card from "../../../../components/card";
import Connection from "../../../../components/connection/connection";
import SelectMenu from "../SelectMenu";
import ActionButton from "./ActionButton";
import Logs from "./Logs";

export default function Communication() {
  const [comPorts, setComPorts] = useState<{path: string}[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedPort, setSelectedPort] = useState("");

  useEffect(() => {
    const handleLogMessage = (log: {message: string}) => {
      const formattedLog = `>> ${log.message}`;
      setLogs((prev) => [...prev.slice(-20), formattedLog]);
    };

    const handlePortsList = (ports: {path: string}[]) => {
      setComPorts(ports);
    };

    socket.on("rov:log", handleLogMessage);
    socket.on("rov:com-ports-list", handlePortsList);

    events.findComPorts(); // Fetch ports on mount

    return () => {
      socket.off("rov:log", handleLogMessage);
      socket.off("rov:com-ports-list", handlePortsList);
    };
  }, []);

  // Prepare options for the SelectMenu
  const portOptions = comPorts.map((port) => ({
    value: port.path,
    label: port.path,
  }));

  return (
    <Card title="Communication Configuration">
      <Connection />
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

      {/* Action button to find ports */}
      <ActionButton
        label="Find COM Ports"
        onClick={() => events.findComPorts()}
      />
      <div className="h-4" />

      {/* Log display */}
      <Logs logMessages={logs} />
    </Card>
  );
}
