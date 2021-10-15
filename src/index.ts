import express from "express";
import http from "http";
import { Server } from "socket.io";
import { ClickerGame } from "./clicker-game/clickerGame";
import { AuthContorller } from "./controllers/AuthController";
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

// middleware
app.use(express.json({ limit: "100mb" }));

app.get("/", (req, res) => {
  res.send("Kukka server");
});

// create clicker game
const game = new ClickerGame({ interval: 1000 });

// controllers
new AuthContorller(app);
new KukkaClickerController(io, game);

// start server
server.listen(PORT, () => {
  console.log(`Chat-server running on port ${PORT}`);
  game.start();
});
