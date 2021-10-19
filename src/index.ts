import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { ClickerGame } from "./clicker-game/clickerGame";
import { UPGRADES } from "./clicker-game/constants";
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
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));

app.get("/", (req, res) => {
  res.send("Kukka server");
});

// define season
const season_start = new Date(Date.now() + 1000 * 60 * 5);
const season_end = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

// create clicker game
const game = new ClickerGame({
  interval: 1000,
  acceptable_idle_time: 10000,
  season_start,
  season_end,
});

// controllers
new AuthContorller(app);
new KukkaClickerController(io, game);

// get season
app.get("/api/season", (req, res) => {
  res.send({ season_start, season_end }).status(200);
});

// get upgrades
app.get("/api/upgrades", (req, res) => {
  res.send(UPGRADES).status(200);
});

// start server
server.listen(PORT, () => {
  console.log(`Chat-server running on port ${PORT}`);
  game.start();
});
