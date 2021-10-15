import express from "express";
import http from "http";
import { Server } from "socket.io";
import { KukkaClickerController } from "./controllers/KukkaClickerController";

// Create a new express app instance
const app: express.Application = express();
const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 1e5,
  cors: {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
  },
});

const PORT = process.env.PORT || 4000;

app.get("/", function (req, res) {
  res.send("Kukka server");
});

// create new controller
new KukkaClickerController(io);

// start server
server.listen(PORT, () => {
  console.log(`Chat-server running on port ${PORT}`);
});
