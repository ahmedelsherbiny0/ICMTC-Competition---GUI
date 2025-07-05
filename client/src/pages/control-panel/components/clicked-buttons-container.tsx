import Card from "../../../components/card";
import KeypadButton from "./keypad-button";
import { controllerDataAtom } from "../../../atoms/atoms";
import { useAtomValue } from "jotai";

const keyDisplayMap: Record<string, string> = {
  up: "🡹",
  down: "🡻",
  left: "🢀",
  right: "🢂",
};

export default function ClickedButtonsContainer() {
  const controllerData = useAtomValue(controllerDataAtom);

  return (
    <Card>
      <div className="flex gap-8 text-xl font-bold mb-6">
        <h1>Keypad</h1>
        <h1>Keypad</h1>
      </div>
      <div className="grid grid-cols-2 gap-x-12 gap-y-8 w-fit">
        {Object.entries(controllerData.buttons).map(([key, isClicked]) => {
          const displayKey = keyDisplayMap[key] || key.toUpperCase();

          return (
            <KeypadButton
              key={key}
              buttonCharacter={displayKey}
              isClicked={!!isClicked}
            />
          );
        })}
      </div>
    </Card>
  );
}
