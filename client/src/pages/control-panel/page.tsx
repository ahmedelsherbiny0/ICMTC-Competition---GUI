import ClickedButtonsContainer from "./components/clicked-buttons-container";
import AnalogTriggersContainer from "./components/analog-triggers-container";
import CompetitionTimer from "./components/competition-timer";
import Communication from "../configurations/components/communication/communication";
import SensorsDisplay from "./components/sensors-display";
import L2R2Triggers from "./components/L2R2Triggers";
import { useAtom } from "jotai";
import { controlModeAtom } from "../../../atoms/atoms";
import ControlModeToggle from "./components/ControlModeToggle";
import { useEffect } from 'react';
import { events } from "../../utils/socket/socket";

export default function ControlPanel() {
  const [controlMode] = useAtom(controlModeAtom);

  useEffect(()=> {
    // This effect can be used to handle any side effects related to control mode changes
    console.log(`Control mode changed to: ${controlMode}`);
    if (controlMode === 'AUTONOMOUS') {
      // Initialize ROS 2 connection for autonomous mode
      const rosbridge = new WebSocket('ws://localhost:9090');
      
      rosbridge.onopen = () => {
        console.log('Connected to ROS 2 bridge');
        
        // Publish autonomous mode status
        const autonomousModeMsg = {
          op: 'publish',
          topic: '/autonomous_mode',
          msg: {
        data: true
          }
        };
        rosbridge.send(JSON.stringify(autonomousModeMsg));
        
        // Subscribe to autonomous commands
        const subscribeCmd = {
          op: 'subscribe',
          topic: '/autonomous_commands',
          type: 'std_msgs/String'
        };
        rosbridge.send(JSON.stringify(subscribeCmd));
      };
      
      rosbridge.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.topic === '/autonomous_commands') {
          console.log('Received autonomous command:', message.msg.data);
          events.sendRosCommand(message.msg.data);
        }
      };
      
      rosbridge.onerror = (error) => {
        console.error('ROS bridge error:', error);
      };
      
      // Cleanup function
      return () => {
        if (rosbridge.readyState === WebSocket.OPEN) {
          rosbridge.close();
        }
      };
    }

  }, [controlMode]);
  return (
    <div className="flex justify-center mt-20 px-2 gap-5">
      <ClickedButtonsContainer />
      <AnalogTriggersContainer />

      <div className="flex flex-col gap-5">
        <L2R2Triggers />
        <Communication />
        <ControlModeToggle />
      </div>
      <div className="flex flex-col gap-5">
        <SensorsDisplay />
        <CompetitionTimer />
      </div>
    </div>
  );
}
