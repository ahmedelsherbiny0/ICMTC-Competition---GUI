import ClickedButtonsContainer from "./components/clicked-buttons-container";
import AnalogTriggersContainer from "./components/analog-triggers-container";
import CompetitionTimer from "./components/competition-timer";
import Communication from "../configurations/components/communication/communication";

export default function ControlPanel() {
  return (
    <div className="flex flex-col mt-20 px-10 gap-5 w-full">
      <h1 className="text-4xl text-center">Control Panel</h1>
      <div className="flex justify-center gap-5">
        <ClickedButtonsContainer />
        <AnalogTriggersContainer />
        <Communication />
        <CompetitionTimer />
      </div>
    </div>
  );
}
