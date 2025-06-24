import { useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  const gamepadIndex = useRef<number | null>(null);

  useEffect(() => {
    const handleGamepadConnected = (e: GamepadEvent) => {
      console.log("Gamepad connected:", e.gamepad);
      console.log("s");
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
      const l1 = gp.buttons[4].pressed; // L1 button index
      const r1 = gp.buttons[5].pressed; // R1 button index
      setInterval(() => {
      console.log("Gamepad state:", gp);
      console.log("L1:", l1, "R1:", r1);
      
      const ledState = l1 || r1 ? "on" : "off";
      socket.emit("led-control", ledState);
      }, 1000);
    }
    requestAnimationFrame(updateGamepad);
  };

  return (
    <div>
      <h1>🎮 PS5 Controller GUI</h1>
      <p>Press L1 or R1 to turn LED on!</p>
    </div>
  );
}

export default App;
