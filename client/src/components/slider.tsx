interface SliderProps {
  value: number;
  min?: number;
  max?: number;
}

export default function Slider({
  value,
  min = 0,
  max = 255,
}: SliderProps) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      className="w-44 h-2 rounded-lg appearance-none bg-[#2f2f2f] accent-slider-dot cursor-pointer"
      style={{
        backgroundImage: `linear-gradient(to right, #006699 ${(
          (value / max) *
          100
        ).toFixed(2)}%, #00669922 0%)`,
      }}
      readOnly
    />
  );
}
