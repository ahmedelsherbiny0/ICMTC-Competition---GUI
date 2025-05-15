import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  const gamepadIndex = useRef<number | null>(null);
  const [gamepadData, setGamepadData] = useState<any>(null);

  useEffect(() => {
    const handleGamepadConnected = (e: GamepadEvent) => {
      console.log("Gamepad connected:", e.gamepad);
      gamepadIndex.current = e.gamepad.index;
      requestAnimationFrame(updateGamepad);
    };

    window.addEventListener("gamepadconnected", handleGamepadConnected);

    return () => {
      window.removeEventListener("gamepadconnected", handleGamepadConnected);
    };
  }, []);

  const updateGamepad = () => {
    const gp = navigator.getGamepads()[gamepadIndex.current!];
    if (gp) {
      const buttonStates = gp.buttons.map((btn, index) => ({
        button: index,
        pressed: btn.pressed,
        value: btn.value,
      }));

      const dpadUp = gp.buttons[12];
      const dpadDown = gp.buttons[13];
      const dpadLeft = gp.buttons[14];
      const dpadRight = gp.buttons[15];

      const axisStates = gp.axes.map((axis, index) => ({
        axis: index,
        value: axis,
      }));

      const l1 = gp.buttons[4].pressed;
      const r1 = gp.buttons[5].pressed;
      const ledState = l1 || r1 ? "on" : "off";
      socket.emit("led-control", ledState);

      setGamepadData({
        buttons: buttonStates,
        axes: axisStates,
        dpad: { up: dpadUp, down: dpadDown, left: dpadLeft, right: dpadRight },
      });
    }
    requestAnimationFrame(updateGamepad);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <p className="text-xl">Press L1 or R1 to turn LED on!</p>
      {gamepadData ? (
        <div>
          <h3>Button States:</h3>
          <ul>
            {gamepadData.buttons.map((btn: any) => (
              <li key={btn.button}>
                Button {btn.button}: {btn.pressed ? "Pressed" : "Released"} -
                Value: {btn.value}
              </li>
            ))}
          </ul>

          <h3>Axis States:</h3>
          <ul>
            {gamepadData.axes.map((axis: any) => (
              <li key={axis.axis}>
                Axis {axis.axis}:{" "}
                {Math.abs(axis.value.toFixed(4)) > 0.2
                  ? axis.value.toFixed(4)
                  : 0}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Connecting to the gamepad...</p>
      )}
    </div>
  );
}

export default App;
