/* eslint-disable @typescript-eslint/no-this-alias */
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ISocket } from "../interfaces/socket";
import { logger } from "../utils/logger";
import jwt from "jsonwebtoken";
import config from "../utils/config";

/**
 * Controller for live chat server instance
 */
export class KukkaClickerController {
  io: Server<DefaultEventsMap, DefaultEventsMap>;
  MESSAGE_EXPIRATION_SECONDS: number;
  constructor(io: Server<DefaultEventsMap, DefaultEventsMap>) {
    this.io = io;
    // this.__init();
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
      // authenticate
      const username = await controller.authenticate(socket);
      if (username) {
        // join chat room
        socket.on("join", async ({ room_id }) => {
          // even unauthorized can join a room
          socket.join(room_id);
        });
        // emit connected event after authentication and initialization
        socket.emit("connected");
      }
    });
  }
}
