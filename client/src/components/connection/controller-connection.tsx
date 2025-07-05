import { useEffect, useState } from "react";
import {
  controllerConnectionAtom,
  controllerDataAtom,
} from "../../atoms/atoms";
import ConnectionButton from "./connection-button";
import { useAtom, useSetAtom } from "jotai";

const threshold = 0.1;

export default function ControllerConnection() {
  const [isConnected, setIsConnected] = useAtom(controllerConnectionAtom);
  const setControllerData = useSetAtom(controllerDataAtom);
  const [gamepadIndex, setGamepadIndex] = useState<number | null>(null);

  useEffect(() => {
    const connectHandler = (e: GamepadEvent) => {
      console.log("Gamepad connected:", e.gamepad);
      setGamepadIndex(e.gamepad.index);
    };

    const disconnectHandler = (e: GamepadEvent) => {
      console.log("Gamepad disconnected:", e.gamepad);
      setGamepadIndex(null);
    };

    window.addEventListener("gamepadconnected", connectHandler);
    window.addEventListener("gamepaddisconnected", disconnectHandler);

    return () => {
      window.removeEventListener("gamepadconnected", connectHandler);
      window.removeEventListener("gamepaddisconnected", disconnectHandler);
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const pollGamepad = () => {
      const gamepads = navigator.getGamepads();
      const gp = gamepads[gamepadIndex ?? 0];
      if (gp) {
        const newControllerData = {
          axes: {
            L: [
              parseFloat(gp.axes[0].toFixed(2)) > threshold ||
              parseFloat(gp.axes[0].toFixed(2)) < -threshold
                ? parseFloat(gp.axes[0].toFixed(2))
                : 0,
              parseFloat(gp.axes[1].toFixed(2)) > threshold ||
              parseFloat(gp.axes[1].toFixed(2)) < -threshold
                ? parseFloat(gp.axes[1].toFixed(2))
                : 0,
            ],
            R: [
              parseFloat(gp.axes[2].toFixed(2)) > threshold ||
              parseFloat(gp.axes[2].toFixed(2)) < -threshold
                ? parseFloat(gp.axes[2].toFixed(2))
                : 0,
              parseFloat(gp.axes[3].toFixed(2)) > threshold ||
              parseFloat(gp.axes[3].toFixed(2)) < -threshold
                ? parseFloat(gp.axes[3].toFixed(2))
                : 0,
            ],
          },
          buttons: {
            A: gp.buttons[0].pressed,
            B: gp.buttons[1].pressed,
            X: gp.buttons[2].pressed,
            Y: gp.buttons[3].pressed,
            L1: gp.buttons[4].pressed,
            R1: gp.buttons[5].pressed,
            L2: parseFloat(gp.buttons[6].value.toFixed(2)),
            R2: parseFloat(gp.buttons[7].value.toFixed(2)),
            Sh: gp.buttons[8].pressed,
            Op: gp.buttons[9].pressed,
            L3: gp.buttons[10].pressed,
            R3: gp.buttons[11].pressed,
            up: gp.buttons[12].pressed,
            down: gp.buttons[13].pressed,
            left: gp.buttons[14].pressed,
            right: gp.buttons[15].pressed,
          },
        };

        setControllerData(newControllerData);

        // console.clear();
        console.log(
          "Controller Data:",
          JSON.stringify(newControllerData, null, 3)
        );
      }

      animationFrameId = requestAnimationFrame(pollGamepad);
    };

    if (isConnected && gamepadIndex !== null) {
      pollGamepad();
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isConnected, gamepadIndex, setControllerData]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center w-full">
        <h1 className="font-bold">Controller</h1>
        <ConnectionButton
          label={isConnected ? "Disconnect" : "Connect"}
          connected={isConnected}
          onClick={() => setIsConnected(!isConnected)}
        />
      </div>
    </div>
  );
}
