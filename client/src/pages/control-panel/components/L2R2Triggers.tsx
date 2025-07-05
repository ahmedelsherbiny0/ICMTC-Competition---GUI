import { controllerDataAtom } from "../../../../atoms/atoms";
import { useAtomValue } from "jotai";
import KeypadButton from "./keypad-button";
import SliderContainer from "./slider-container";
import Card from "../../../components/card";

export default function L2R2Triggers() {
  const controllerData = useAtomValue(controllerDataAtom);
  return (
    <Card title="L2 & R2 Triggers">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-8">
          <KeypadButton buttonCharacter={"L2"} />
          <SliderContainer
            value={Math.round(controllerData.buttons.L2 * 255)}
          />
        </div>
        <div className="flex flex-row items-center gap-8">
          <KeypadButton buttonCharacter={"R2"} />
          <SliderContainer
            value={Math.round(controllerData.buttons.R2 * 255)}
          />
        </div>
      </div>
    </Card>
  );
}
