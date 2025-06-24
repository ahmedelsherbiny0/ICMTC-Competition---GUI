import { atomWithStorage } from "jotai/utils";

export const rovConnectionAtom = atomWithStorage<boolean>("rov-connection", false);
export const controllerConnectionAtom = atomWithStorage<boolean>("controller-connection", false);
