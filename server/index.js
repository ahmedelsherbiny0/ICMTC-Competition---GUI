const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { SerialPort } = require("serialport");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

const serial = new SerialPort({ path: "COM8", baudRate: 9600 });

serial.on("data", (data) => {
  console.log("Arduino:", data.toString());
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("🟢 Client connected");

  socket.on("led-control", (state) => {
    if (state === "on" || state === "off") {
      serial.write(state + "\n", (err) => {
        if (err) {
          console.error("Serial write error:", err);
        } else {
          console.log(`Sent to Arduino: ${state}`);
        }
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected");
  });
});

server.listen(4000, () => {
  console.log("🚀 Server running on http://localhost:4000");
});
