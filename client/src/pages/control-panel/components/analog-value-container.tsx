import { useState } from "react";
import KeypadButton from "./keypad-button";
import SliderValue from "../../../components/slider-value";
import Slider from "../../../components/slider";

export default function SliderContainer() {
  const [value, setValue] = useState(0);

  return (
    <div className="flex gap-8">
      <KeypadButton isClicked={true} buttonCharacter={"B"} />
      <div className="">
        <SliderValue value={value} />
        <Slider value={value} onChange={setValue} />
      </div>
    </div>
  );
}
