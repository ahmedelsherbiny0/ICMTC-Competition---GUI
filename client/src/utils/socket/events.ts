import { Socket } from "socket.io-client";

export const initializeEvents = (socket: Socket) => ({
  findComPorts: () => {
    socket.emit("rov:find-com-ports");
  },
  connectToRov: (comPort: string) => {
    if (!comPort) {
      console.error("connectToROV:No COM port selected");
      return;
    }
    socket.emit("rov:connect", comPort);
  },
  disconnectFromRov: () => {
    socket.emit("rov:disconnect");
  },
  getRovConfig: () => {
    socket.emit("config:get");
  },
  updateRovConfig: (config: object) => {
    socket.emit("config:update", config);
  },
  // Not Implemented yet in the server
  emitThrusterTest: (thrusterIndex: number, value: number) => {
    socket.emit("config:thruster-test", { thrusterIndex, value });
  },
  // Not Implemented yet in the server
  emitGripperTest: (gripperIndex: number, value: number) => {
    socket.emit("config:gripper-test", { gripperIndex, value });
  },
  emitControllerData: (controllerData: object) => {
    socket.emit("controller:data", controllerData);
  },
  isRovConnected: () => {
    socket.emit("rov:connection-status");
  },
});
