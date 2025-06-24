import Card from "../../components/card";
import SliderContainer from "./components/analog-value-container";
import ConnectionContainer from "../../components/connection/connection-container";

export default function ControlPanel() {
  return (
    <div className="flex flex-col mt-20 gap-5 w-full">
      <h1 className="text-4xl text-center">Control Panel</h1>
      <div className="flex justify-center gap-5">
        <Card>heh</Card>
        <Card>
          <SliderContainer />
        </Card>
        <ConnectionContainer />
      </div>
    </div>
  );
}
