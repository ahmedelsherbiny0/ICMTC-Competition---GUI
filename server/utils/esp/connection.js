/**
 * @file connection.js
 * @version 1.0.0
 * @description Manages all aspects of serial port communication with the ESP32/Arduino.
 * This module is responsible for discovering available ports, establishing and closing
 * connections, parsing incoming sensor data, and sending outgoing commands. It acts
 * as the sole interface between the Node.js application and the physical ROV hardware.
 */

//=================================================================================
//                                 DEPENDENCIES
//=================================================================================

const {SerialPort} = require("serialport");
const {ReadlineParser} = require("@serialport/parser-readline");

//=================================================================================
//                                 MODULE STATE
//=================================================================================

let port = null; // Holds the active serial port instance when connected.
let parser = null; // Holds the ReadlineParser instance to read data line-by-line. ->
// From the serial port because ESP32 sends data line-by-line in serial communication.
let isArduinoReady = false; // A boolean flag to track the connection status.
let arduinoPath = null; // Stores the path of the connected port (e.g., 'COM5').
let io = null; // Caches the main Socket.IO server instance for broadcasting events.

//=================================================================================
//                                CORE FUNCTIONS
//=================================================================================

/**
 * Logs a message to the server console and broadcasts it to all connected clients
 * via the 'rov:log' socket event for display in the GUI's terminal.
 * @param {string} message - The log message to be processed.
 */
const log = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[Arduino] ${message}`);
  if (io) {
    io.emit("rov:log", {timestamp, message});
  }
};

/**
 * Handles raw data received from the Arduino's serial port. It attempts to parse
 * the data as a JSON string and, on success, broadcasts the sensor data to all
 * clients. On failure, it logs the error and the malformed data.
 * @param {string} data - A line of data received from the serial port.
 */
const handleArduinoData = (data) => {
  try {
    const jsonData = JSON.parse(data);
    // Broadcast the parsed sensor data to all connected clients.
    io.emit("rov:sensor-data", jsonData);
  } catch (error) {
    // This catch block is crucial for handling non-JSON boot messages from the ESP32.
    log(`Error parsing JSON from Arduino: ${error.message}`);
    log(`Received malformed data: ${data}`);
  }
};

/**
 * Sends a command object to the connected Arduino. The object is stringified
 * into JSON format and a newline character is appended, which the ReadlineParser
 * on the ESP32 uses as a delimiter.
 * @param {object} data - The command object to send (e.g., {esc: [...], servo: [...]}).
 */
const sendDataToArduino = (data) => {
  // Prevent writing to a port that isn't open or ready.
  if (!isArduinoReady || !port || !port.isOpen) {
    return;
  }

  const dataString = JSON.stringify(data) + "\n";
  port.write(dataString, (err) => {
    if (err) {
      log(`Error writing to serial port: ${err.message}`);
    }
  });
};

/**
 * Scans the host system for all available serial ports.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of
 * port objects, each containing a `path` and `manufacturer`.
 */
const listPorts = async () => {
  try {
    const ports = await SerialPort.list();
    log(`Found ${ports.length} available ports.`);
    return ports.map((p) => ({
      path: p.path,
      manufacturer: p.manufacturer,
    }));
  } catch (error) {
    log(`Error listing serial ports: ${error.message}`);
    throw error;
  }
};

/**
 * Disconnects from the currently active serial port, if one exists.
 * It resets the module's state variables and notifies clients of the status change.
 */
const disconnectFromArduino = () => {
  if (!port || !port.isOpen) {
    log("Already disconnected.");
    return;
  }
  port.close((err) => {
    if (err) {
      log(`Error closing port: ${err.message}`);
    } else {
      // Reset state on successful disconnection.
      isArduinoReady = false;
      port = null;
      parser = null;
      arduinoPath = null;
      // Notify client that the ROV is now disconnected.
      io.emit("rov:connection-status", {
        status: "disconnected",
        message: "ROV has been disconnected.",
      });
    }
  });
};

/**
 * Establishes a connection to the Arduino on a specified COM port.
 * It configures the serial port and attaches event listeners for 'open',
 * 'data', 'error', and 'close' events to manage the connection lifecycle.
 * @param {string} path - The system path of the COM port to connect to (e.g., 'COM5').
 */
const connectToArduino = (path) => {
  if (isArduinoReady) {
    // If already connected, do nothing or disconnect first from the old one for a fresh connection.
    if (path === arduinoPath) {
      log(`Already connected to ${path}.`);
      return;
    }
    disconnectFromArduino();
  }

  log(`Attempting to connect to ${path}...`);
  arduinoPath = path;

  // Instantiate the serial port with the path and a standard baud rate for ESP32.
  port = new SerialPort({path, baudRate: 115200});
  // Pipe the port's output through a ReadlineParser to receive data line-by-line.
  parser = port.pipe(new ReadlineParser({delimiter: "\n"}));

  // --- Serial Port Event Listeners ---

  port.on("open", () => {
    isArduinoReady = true;
    log(`Successfully connected to ROV at ${path}.`);
    io.emit("rov:connection-status", {
      status: "connected",
      path,
      message: `ROV connected successfully on ${path}.`,
    });
  });

  parser.on("data", handleArduinoData);

  port.on("error", (err) => {
    log(`Serial Port Error: ${err.message}`);
    isArduinoReady = false;
    io.emit("rov:connection-status", {
      status: "error",
      message: `Error with ROV connection: ${err.message}`,
    });
  });

  port.on("close", () => {
    isArduinoReady = false;
    if (arduinoPath) {
      // Only log/emit if it was a previously active connection.
      log(`Connection to ${arduinoPath} closed.`);
      io.emit("rov:connection-status", {
        status: "disconnected",
        message: "ROV connection lost.",
      });
      arduinoPath = null;
    }
  });
};

//=================================================================================
//                              MODULE INITIALIZATION
//=================================================================================

/**
 * Initializes the Arduino connection manager. This function is called once at
 * server startup. It caches the Socket.IO instance and exposes the public API
 * methods so other modules (like events.js) can use them.
 * @param {object} socketIoInstance - The main Socket.IO server instance from `index.js`.
 */
const initializeArduino = (socketIoInstance) => {
  io = socketIoInstance;
  log("Arduino Connection Manager Initialized.");
  listPorts(); // Automatically scan for ports on startup.

  // This `api` object is exported so that other files can access the functions
  // in this module without creating circular dependency issues.
  module.exports.api = {
    connectToArduino,
    disconnectFromArduino,
    listPorts,
    sendDataToArduino,
    isArduinoReady: () => isArduinoReady,
  };
};

// Export the initializer function to be called by index.js.
module.exports.initializeArduino = initializeArduino;
