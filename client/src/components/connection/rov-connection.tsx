import { rovConnectionAtom } from "../../atoms/atoms";
import ConnectionButton from "./connection-button";
import { useAtom } from "jotai";

export default function ROVConnection() {
  const [isConnected, setIsConnected] = useAtom(rovConnectionAtom);

  return (
    <div className="flex justify-between items-center w-full">
      <h1 className="font-bold">ROV</h1>
      <ConnectionButton
        label={isConnected ? "Disconnect" : "Connect"}
        connected={isConnected}
        onClick={() => setIsConnected(!isConnected)}
      />
    </div>
  );
}
