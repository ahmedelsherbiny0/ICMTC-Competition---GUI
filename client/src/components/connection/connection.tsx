import ROVConnection from "../rov-connection";
import ControllerConnection from "./controller-connection";

export default function Connection({ gap = 5 }: { gap?: number }) {
  return (
    <div className={`flex flex-col gap-${gap} w-full`}>
      <ROVConnection />
      <ControllerConnection />
    </div>
  );
}
