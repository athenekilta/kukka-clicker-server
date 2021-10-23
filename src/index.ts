import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { ClickerGame } from "./clicker-game/clickerGame";
import { UPGRADES } from "./clicker-game/constants";
import { AuthContorller } from "./controllers/AuthController";
import { KukkaClickerController } from "./controllers/KukkaClickerController";
import config from "./gameConfig";

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
const season_start = config.seasonStart;
const season_end = config.seasonEnd;

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
  console.log(`
If you want to define season start and end manually, define the following environmental variables in ISO-8601 format like this: "2021-10-22T18:48:31+03:00" before starting the server (try running date --iso-8601=seconds)

    export KUKKACLICKER_SEASON_START="2021-10-22T18:30:00+03:00"
    export KUKKACLICKER_SEASON_END="2021-11-05T12:30:00+03:00"
  `);
  console.log(`Season start: ${season_start}`);
  console.log(`Season end:   ${season_end}`);
  console.log(`Chat-server running on port ${PORT}`);
  game.start();
});
