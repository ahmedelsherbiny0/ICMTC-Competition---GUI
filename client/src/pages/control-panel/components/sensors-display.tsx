import Card from "../../../components/card";
import { rovSensorDataAtom } from "../../../../atoms/atoms";
import { useAtom } from "jotai";
import type { ReactNode } from "react";

export default function SensorsDisplay() {
  const [sensorsData, setSensorData] = useAtom(rovSensorDataAtom);

  setSensorData (sensorsData || ({
    mpu: {
      acc: [0, 0, 0],
      gyro: [0, 0, 0],
      angle:[0.0,0.0],
      temp_in: 0,
    },
    depth: 0,
  }));
  const labels = ["X", "Y", "Z"];
  // console.log(sensorsData);

  return (
    <Card title="Sensors Data">
      <div className="flex flex-col w-full gap-5">
        <Container>
          <Name name={"Depth Sensor (cm)"} />
          <Value value={sensorsData?.depth} />
        </Container>
        <Container>
          <Name name={"MPU (Acceleration)"} />
          <div className="flex gap-2">
            {sensorsData?.mpu.acc.map((value, index) => (
              <Value key={index} value={value || 0.0} label={labels[index] || "?"} />
            ))}
          </div>
        </Container>
        <Container>
          <Name name={"MPU (Rotation)"} />
          <div className="flex gap-2">
            {sensorsData?.mpu.gyro.map((value, index) => (
              <Value key={index} value={value || 0.0} label={labels[index] || "?"} />
            ))}
          </div>
        </Container>
        <Container>
          <Name name={"MPU (Angle)"} />
          <div className="flex gap-2">
            {sensorsData?.mpu.angle?.map((value, index) => (
              <Value key={index} value={value || 0.0} label={labels[index] || "?"} />
            ))}
          </div>
        </Container>
        <Container>
          <Name name={"MPU (Temperature)"} />
          <Value value={sensorsData?.depth} />
        </Container>
      </div>
    </Card>
  );
}

function Name({ name }: { name: string }) {
  return <div>{name}:</div>;
}

function Value({
  value,
  label,
}: {
  value: number | undefined;
  label?: string;
}) {
  return (
    <div className="flex flex-col justify-center items-center">
      {label && <h2>{label}</h2>}
      <div className="bg-[var(--color-component-background)] p-2 rounded-lg w-16 text-center">
        {value?.toFixed(2)}
      </div>
    </div>
  );
}

function Container({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-between items-center w-full">{children}</div>
  );
}
