import { controllerDataAtom } from "../../../../atoms/atoms";
import { useAtomValue } from "jotai";
import SliderContainer from "./slider-container";
import KeypadButton from "./keypad-button";
import Card from "../../../components/card";

type Direction = {
  label: string;
  axis: "x" | "y";
  sign: 1 | -1;
};

const directions: Direction[] = [
  { label: "🡹", axis: "y", sign: -1 },
  { label: "🡻", axis: "y", sign: 1 },
  { label: "🢀", axis: "x", sign: -1 },
  { label: "🢂", axis: "x", sign: 1 },
];

function getDirectionIntensity(x: number, y: number, dir: Direction): number {
  const value = dir.axis === "x" ? x : y;
  const intensity = dir.sign * value;
  return Math.max(0, Math.min(1, intensity));
}

export default function AnalogTriggersContainer() {
  const controllerData = useAtomValue(controllerDataAtom);

  return (
    <Card title="Analog Data">
      <div className="flex flex-col gap-2">
        {(["L", "R"] as const).map((stickKey) => {
          const [x, y] = controllerData.axes[stickKey];

          return (
            <div key={stickKey}>
              <h2 className="text-lg font-semibold mb-2">{stickKey} - Stick</h2>
              <div className="grid grid-cols-1 gap-2">
                {directions.map((dir) => {
                  const intensity = getDirectionIntensity(x, y, dir);
                  return (
                    <div
                      key={`${stickKey}-${dir.label}`}
                      className="flex flex-row items-center gap-4"
                    >
                      <KeypadButton buttonCharacter={dir.label} />
                      <SliderContainer value={Math.round(intensity * 255)} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
