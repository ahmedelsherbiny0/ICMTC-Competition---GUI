/**
 * @file events.js
 * @version 1.0.0
 * @description Registers all Socket.IO event handlers for the ROV control server.
 * This file acts as the central hub for all real-time communication between the
 * client GUI and the server, handling everything from hardware connection
 * requests to live controller data streaming.
 */

//=================================================================================
//                                 DEPENDENCIES
//=================================================================================

// DEFERRED REQUIRE: We require the module now but access its 'api' property later
// inside event handlers. This is a crucial pattern to prevent circular dependency
// errors during application startup, where this file might be loaded before
// the connection module is fully initialized.
const arduinoConnection = require("../utils/esp/connection");

//=================================================================================
//                                 MODULE STATE
//=================================================================================

/**
 * @description In-memory store for the ROV's current hardware and operational configuration.
 * This object is updated by the 'Configuration' page on the client GUI and is used
 * by the `mapControllerToCommand` function to translate pilot inputs correctly.
 * It serves as the single source of truth for the vehicle's setup.
 */
let rovConfiguration = {
  thrusters: [
    {location: "top", enabled: true, reversed: false},
    {location: "frontLeft", enabled: true, reversed: false},
    {location: "backLeft", enabled: true, reversed: false},
    {location: "frontRight", enabled: true, reversed: false},
    {location: "backRight", enabled: true, reversed: false},
  ],
  grippers: [
    {location: "front", enabled: true},
    {location: "back", enabled: true},
  ],
  sensors: [
    {type: "depth", enabled: true},
    {type: "temperature", enabled: true},
    {type: "acceleration", enabled: true},
    {type: "rotation", enabled: true},
  ],
  sensitivity: {
    joystick: "High", // Can be 'Low', 'Normal', 'High'
    yaw: "High", // Can be 'Low', 'Normal', 'High'
  },
};

//=================================================================================
//                           CONTROLLER MAPPING LOGIC
//=================================================================================

/**
 * @description Defines the mapping between abstract actions and physical Sony controller inputs.
 * This object allows for easy re-configuration of the control scheme without
 * altering the core processing logic. To change a control, modify the string value.
 * The client-side code must send a JSON object where the button/axis names match
 * the values used in the `mapControllerToCommand` function (e.g., `controllerReadings.axes.L[1]`).
 */
const keymap = {
  // Primary axes for 6-degree-of-freedom movement
  MOVE_FORWARD_BACKWARD: "LeftStickY",
  MOVE_STRAFE_LEFT_RIGHT: "LeftStickX",
  MOVE_YAW_LEFT_RIGHT: "RightStickX",
  MOVE_UP: "R2_Trigger",
  MOVE_DOWN: "L2_Trigger",

  // Gripper controls mapped to specific buttons
  GRIPPER_1_ACTION_A: "L1_Button",
  GRIPPER_1_ACTION_B: "Square_Button",
  GRIPPER_2_ACTION_A: "R1_Button",
  GRIPPER_2_ACTION_B: "Circle_Button",

  // Auxiliary controls
  LIGHTS_TOGGLE: "Triangle_Button",
};

/**
 * Translates raw controller data into a structured command for the ESP32.
 * This "mixer" function is the brain of the ROV, converting high-level pilot
 * intents (like "move forward") into low-level thruster power values based on
 * the vehicle's physical configuration.
 *
 * @param {object} controllerReadings - The raw JSON data from the client's Gamepad API.
 * @param {object} config - The current `rovConfiguration` object.
 * @returns {object} A command object formatted for the ESP32 (e.g., { esc, servo, lights }).
 */
function mapControllerToCommand(controllerReadings, config) {
  // Apply sensitivity scaling to raw joystick values.
  const sensitivity = {
    joystick:
      config.sensitivity.joystick === "High"
        ? 1.0
        : config.sensitivity.joystick === "Normal"
        ? 0.75
        : 0.5,
    yaw:
      config.sensitivity.yaw === "High"
        ? 1.0
        : config.sensitivity.yaw === "Normal"
        ? 0.7
        : 0.4,
  };

  // Calculate high-level movement "intents" from -1.0 to 1.0.
  // Note: Y-axis is inverted (-1) because gamepads typically report "up" as a negative value.
  const intents = {
    surge:
      (controllerReadings.axes.L[1] || 0) * sensitivity.joystick, // Forward/Backward
    sway: (controllerReadings.axes.L[0] || 0) * sensitivity.joystick, // Strafe Left/Right
    yaw:
      ((controllerReadings.buttons.R2 || 0) -
        (controllerReadings.buttons.L2 || 0)) *
      sensitivity.yaw, // Turn Left/Right
    heave: (controllerReadings.axes.R[1] || 0) * sensitivity.joystick, // Up/Down
  };

  // Initialize a default command object. All values are "off" or "stop".
  const command = {
    esc: [0.0, 0.0, 0.0, 0.0, 0.0],
    servo: [0, 0, 0, 0],
    lights: [0, 0],
  };

  // --- Thruster Mixing Algorithm ---
  // Iterate through each thruster defined in the configuration.
  config.thrusters.forEach((thrusterConfig, index) => {
    let power = 0.0;
    // Apply vectored control logic based on the thruster's configured location.
    switch (thrusterConfig.location) {
      case "top":
        power = intents.heave;
        break;
      case "frontLeft":
        if (intents.surge < 0 && intents.sway >= 0)
          power = -intents.surge + intents.sway + intents.yaw;
        else power = (intents.sway >= 0) ? -intents.sway + intents.yaw : intents.yaw;
        if (intents.yaw < 0) power -= intents.yaw;
        break;
      case "frontRight":
        if (intents.surge < 0)
          power = intents.surge + intents.sway + intents.yaw;
        else power = +intents.sway + intents.yaw;
        break;
      case "backLeft":
        power = -intents.surge - intents.sway + intents.yaw;
        if (intents.sway < 0) power += intents.sway;
        break;
      case "backRight":
        power = intents.surge - intents.sway + intents.yaw;
        break;
      default:
        power = 0.0;
    }

    if (!thrusterConfig.enabled) power = 0.0;
    // Invert power direction if the "reversed" checkbox is ticked in the config.
    if (thrusterConfig.reversed) {
      power = -power;
    }

    power = power === -0 ? 0 : power;

    // Clamp the final power value to the valid range of [-1.0, 1.0].
    power = Math.max(-1.0, Math.min(1.0, power));
    command.esc[index] = power;
  });

  // --- Map Gripper and Light Buttons ---   Need to check
  // First Gripper
  if (rovConfiguration.grippers[0].enabled) {
    if (controllerReadings.buttons.Y) command.servo[0] = 1;
    if (controllerReadings.buttons.A) command.servo[0] = -1;
    if (controllerReadings.buttons.B) command.servo[1] = 1;
    if (controllerReadings.buttons.X) command.servo[1] = -1;
  }

  // Second Gripper
  if (rovConfiguration.grippers[1].enabled) {
    if (controllerReadings.buttons.up) command.servo[2] = 1;
    if (controllerReadings.buttons.down) command.servo[2] = -1;
    if (controllerReadings.buttons.left) command.servo[3] = 1;
    if (controllerReadings.buttons.right) command.servo[3] = -1;
  }

  // Lights
  if (controllerReadings.buttons.R1) {
    command.lights[0] = 1;
    command.lights[1] = 1;
    // I don't know which light is which, so they are both set to 1 and handle it in esp logic.
  }

  return command;
}

//=================================================================================
//                            SOCKET EVENT REGISTRATION
//=================================================================================

/**
 * Registers all event listeners for a newly connected client socket.
 * This function is the entry point for all server-side socket logic.
 *
 * @param {object} io - The main Socket.IO server instance (for broadcasting).
 * @param {object} socket - The specific socket instance for the connected client.
 */
const registerEventHandlers = (io, socket) => {
  /**
   * LAZY GETTER: This function safely retrieves the arduino API object. It's called
   * inside event handlers to ensure the `connection` module has been fully
   * initialized before any of its methods are accessed, preventing race conditions :).
   * @returns {object|null} The Arduino API object or null if not ready.
   */
  const getArduinoApi = () => arduinoConnection.api;

  // --- ROV Hardware Connection Events ---

  socket.on("rov:connection-status", () => {
    const arduino = getArduinoApi();
    console.log(arduino.isArduinoReady());
    io.emit("rov:connection-status", {
      status: arduino.isArduinoReady() ? "connected" : "disconnected",
      message: arduino.isArduinoReady()
        ? "ROV is connected."
        : "ROV is disconnected.",
    });
  });

  socket.on("rov:find-com-ports", async () => {
    try {
      const arduino = getArduinoApi();
      if (!arduino)
        return socket.emit("rov:error", {
          message: "Arduino module not ready.",
        });
      const ports = await arduino.listPorts();
      socket.emit("rov:com-ports-list", ports);
    } catch (error) {
      socket.emit("rov:error", {
        message: "Failed to find COM ports.",
        error: error.message,
      });
    }
  });

  socket.on("rov:connect", (comPort) => {
    console.log(`Hello From Here ${comPort}`);
    const arduino = getArduinoApi();
    if (!arduino)
      return socket.emit("rov:error", {
        message: "Arduino module not ready.",
      });
    if (!comPort)
      return socket.emit("rov:error", {
        message: "No COM Port was provided.",
      });
    arduino.connectToArduino(comPort);
  });

  socket.on("rov:disconnect", () => {
    const arduino = getArduinoApi();
    if (arduino) arduino.disconnectFromArduino();
  });

  // --- Core Data Streaming Event ---
  /*
   * Data Format Expected:
   * {
   *   "axes": {
   *     "L": [0, 0], // Left stick X and Y  -> doubles
   *     "R": [0, 0]  // Right stick X and Y -> doubles
   *   },
   *   "buttons": {
   *     "L1":  false,
   *     "R1":  false,
   *     "A":   false,
   *     "X":   false,
   *     "B":   false,
   *     "Y":   false,
   *     "L2": 0, // 0-1 range for triggers
   *     "R2": 0,
   *     "DPad": {
   *      "up":    false,
   *      "down":  false,
   *      "left":  false,
   *      "right": false
   *     }
   *   }
   * }
   */

  socket.on("controller:data", (controllerReadings) => {
    const arduino = getArduinoApi();
    console.log(controllerReadings)
    // Do nothing if the ROV is not physically connected.
    // console.log(controllerReadings); // Test
    // console.log(controllerReadings.axis.R[1]); / Test
    if (!arduino || !arduino.isArduinoReady()) {
      return;
    }
    // Map the raw data and send the resulting command to the ESP32.
    const command = mapControllerToCommand(
      controllerReadings,
      rovConfiguration
    );
    console.log(command); // Test
    arduino.sendDataToArduino(command);
  });

  // --- Configuration Page Events ---

  socket.on("config:get", () => {
    socket.emit("config:data", rovConfiguration);
  });

  /*
   *Expected Payload Format:
   *{
   *  "thrusters": [
   *    { "location": "frontLeft"  ,   "enabled": true  , "reversed": false , "speedRatio": 1.0 },
   *    { "location": "frontRight" ,   "enabled": true  , "reversed": false , "speedRatio": 1.0 },
   *    { "location": "backLeft"   ,   "enabled": true  , "reversed": false , "speedRatio": 1.0 },
   *    { "location": "backRight"  ,   "enabled": true  , "reversed": false , "speedRatio": 1.0 },
   *    { "location": "bottomLeft" ,   "enabled": true  , "reversed": false , "speedRatio": 1.0 },
   *    { "location": "bottomRight",   "enabled": true  , "reversed": false , "speedRatio": 1.0 },
   *  ],
   *  "grippers": [
   *    { "location": "front" , "enabled": true  , speedRatio: 1.0 },
   *    { "location": "back"  , "enabled": true  , speedRatio: 1.0 }
   *  ],
   *  "sensors": [
   *    { "type": "depth"       , "enabled": true  },
   *    { "type": "temperature" , "enabled": true  },
   *    { "type": "acceleration", "enabled": true  },
   *    { "type": "rotation"    , "enabled": true  }
   *  ]
   */
  socket.on("config:update", (newConfig) => {
    rovConfiguration = {...rovConfiguration, ...newConfig};
    console.log(newConfig); // Test
    socket.emit("config:updated", {
      success: true,
      newConfig: rovConfiguration,
    });
  });

  socket.on("config:thruster-test", ({thrusterIndex, value}) => {
    const arduino = getArduinoApi();
    if (!arduino || !arduino.isArduinoReady()) return;
    const escCommand = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]; // Default to all stopped
    if (thrusterIndex >= 0 && thrusterIndex < 6) {
      // The value from the GUI slider is 0-100, convert to 0.0-1.0 for the ESC.
      escCommand[thrusterIndex] = value / 100.0;
    }
    arduino.sendDataToArduino({
      esc: escCommand,
      servo: [0, 0, 0, 0],
      lights: [0, 0],
    });
  });

  socket.on("config:gripper-test", ({gripperIndex, value}) => {
    const arduino = getArduinoApi();
    if (!arduino || !arduino.isArduinoReady()) return;
    const servoCommand = [0, 0, 0, 0];
    if (gripperIndex === 1) {
      // Gripper 1 uses servos 0 and 1
      servoCommand[0] = value;
      servoCommand[1] = value;
    } else if (gripperIndex === 2) {
      // Gripper 2 uses servos 2 and 3
      servoCommand[2] = value;
      servoCommand[3] = value;
    }
    arduino.sendDataToArduino({
      esc: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
      servo: servoCommand,
      lights: [0, 0],
    });
  });
};

module.exports = registerEventHandlers;
