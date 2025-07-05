import Card from "../../../components/card";
import KeypadButton from "./keypad-button";
import { controllerDataAtom } from "../../../../atoms/atoms";
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
    <Card title="Buttons">
      <div className="grid grid-cols-2 gap-x-12 gap-y-4 w-fit">
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
