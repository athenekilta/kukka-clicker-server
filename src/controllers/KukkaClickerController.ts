/* eslint-disable @typescript-eslint/no-this-alias */
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ISocket } from "../interfaces/socket";
import { logger } from "../utils/logger";
import jwt from "jsonwebtoken";
import config from "../utils/config";
import { ClickerGame } from "../clicker-game/clickerGame";

/**
 * Controller for live chat server instance
 */
export class KukkaClickerController {
  io: Server<DefaultEventsMap, DefaultEventsMap>;
  game: ClickerGame;

  constructor(
    io: Server<DefaultEventsMap, DefaultEventsMap>,
    game: ClickerGame
  ) {
    this.io = io;
    this.game = game;
    this.__init();
  }

  /**
   * Tries to get user
   */
  async authenticate(socket: ISocket): Promise<string> {
    try {
      // get token
      let accessToken = null;
      if (
        socket.request.headers.authorization &&
        socket.request.headers.authorization.startsWith("Bearer ")
      ) {
        accessToken = socket.request.headers.authorization.replace(
          "Bearer ",
          ""
        );
      }

      if (accessToken) {
        // has access token
        // validate access token, throws error if expired
        const decodedToken = jwt.verify(
          accessToken,
          config.ACCESS_TOKEN_SECRET_KEY
        ) as {
          username: string;
          exp: number;
        };

        const username = decodedToken?.username || null;
        // const user = await UserModel.findOne({ where: { username } });
        socket.username = username;
        return username;
      }
    } catch (error) {
      logger({ error });
      return null;
    }
    return null;
  }

  /**
   * Initial function
   */
  __init() {
    const controller = this;
    const io = this.io;
    // main method
    io.on("connection", async (socket: ISocket) => {
      // AUTHENTICATE

      const username = await controller.authenticate(socket);
      if (username) {
        // join game
        controller.game.addUser(username);

        // GAME

        socket.on("click", async () => {
          await controller.game.click(username);
        });
      }

      // CONNECTION

      socket.on("disconnect", () => {
        controller.game.deleteUser(username);
      });

      // emit connected event after authentication and initialization
      socket.emit("connected");
    });
  }
}
