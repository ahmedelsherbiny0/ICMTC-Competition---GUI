import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const rovConnectionAtom = atomWithStorage<boolean>(
  "rov-connection",
  false
);
export const controllerConnectionAtom = atomWithStorage<boolean>(
  "controller-connection",
  false
);

export const controlModeAtom = atom<'PILOT' | 'AUTONOMOUS'>('PILOT');

export const controllerDataAtom = atomWithStorage<{
  axes: {
    L: number[];
    R: number[];
  };
  buttons: {
    L1: boolean;
    R1: boolean;
    A: boolean;
    X: boolean;
    B: boolean;
    Y: boolean;
    L2: number;
    R2: number;
    Sh: boolean;
    Op: boolean;
    L3: boolean;
    R3: boolean;
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  };
}>("controller-data", {
  axes: { L: [0, 0], R: [0, 0] },
  buttons: {
    L1: false,
    R1: false,
    A: false,
    B: false,
    X: false,
    Y: false,
    L2: 0,
    R2: 0,
    Sh: false,
    Op: false,
    L3: false,
    R3: false,
    up: false,
    down: false,
    left: false,
    right: false,
  },
});

const savedTime = localStorage.getItem("competition-time");
const initialTime = savedTime ? JSON.parse(savedTime) : 0;

export const timeAtom = atom(initialTime);

export const persistedTimeAtom = atom(
  (get) => get(timeAtom),
  (get, set, update: number | ((prev: number) => number)) => {
    const newValue =
      typeof update === "function" ? update(get(timeAtom)) : update;
    set(timeAtom, newValue);
    localStorage.setItem("competition-time", JSON.stringify(newValue));
  }
);

export const isRovConnectedAtom = atom(false);
export const isControllerConnectedAtom = atom(false);

export interface ROVSensorData {
  depth: number;
  mpu: {
    acc: [number, number, number];
    gyro: [number, number, number];
    angle: [number, number];
    temp_in: number;
  };
}

export const rovSensorDataAtom = atomWithStorage<ROVSensorData | null>(
  "rov-sensor-data",
  null
);
