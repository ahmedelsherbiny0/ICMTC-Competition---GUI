import { controllerConnectionAtom } from "../../atoms/atoms";
import ConnectionButton from "./connection-button";
import { useAtom } from "jotai";

export default function ControllerConnection() {
  const [isConnected, setIsConnected] = useAtom(controllerConnectionAtom);

  return (
    <div className="flex justify-between items-center w-full">
      <h1 className="font-bold">Controller</h1>
      <ConnectionButton
        label={isConnected ? "Disconnect" : "Connect"}
        connected={isConnected}
        onClick={() => setIsConnected(!isConnected)}
      />
    </div>
  );
}
