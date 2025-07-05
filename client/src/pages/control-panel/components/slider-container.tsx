import SliderValue from "../../../components/slider-value";
import Slider from "../../../components/slider";

export default function SliderContainer({ value }: { value: number }) {
  return (
    <div className="flex gap-4 justify-center items-center">
      <SliderValue value={value} />
      <Slider value={value} />
    </div>
  );
}
