/* eslint-disable @typescript-eslint/no-this-alias */
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ISocket } from "../interfaces/socket";

/**
 * Controller for live chat server instance
 */
export class KukkaClickerController {
  io: Server<DefaultEventsMap, DefaultEventsMap>;
  MESSAGE_EXPIRATION_SECONDS: number;
  constructor(io: Server<DefaultEventsMap, DefaultEventsMap>) {
    this.io = io;
    this.__init();
  }

  /**
   * Tries to get user
   */
  async authenticate(socket: ISocket): Promise<string> {
    // const user: IUser = await getUserFromServer(socket);
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
      const user = await controller.authenticate(socket);
      if (user) {
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
