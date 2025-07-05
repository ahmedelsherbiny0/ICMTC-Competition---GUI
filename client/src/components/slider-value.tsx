export default function SliderValue({ value }: { value: number }) {
  return (
    <div className="mt-1 mb-3 text-center bg-component-background py-1 px-3 rounded-md text-sm text-white w-12">
      {value}
    </div>
  );
}
