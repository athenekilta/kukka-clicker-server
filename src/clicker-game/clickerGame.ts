import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { UserModel } from "../models/user";
import { logger } from "../utils/logger";

export interface IClickerGameOptions {
  interval: number;
}

export interface IClickerUpgrade {
  type: string;
  level: number;
  ratio: number;
  score: number;
  time_interval: number;
  previous_time: number;
}

export interface IClickerGameState {
  score: number;
  upgrades: IClickerUpgrade[];
}

export class ClickerGame {
  io: Server<DefaultEventsMap, DefaultEventsMap>;
  options: IClickerGameOptions;
  activeUsers: string[];
  terminated: boolean;

  constructor(options: IClickerGameOptions) {
    this.io = null;
    this.options = options;
    this.activeUsers = [];
    this.terminated = false;
  }

  bindSocketServer = (io: Server<DefaultEventsMap, DefaultEventsMap>) => {
    this.io = io;
  };

  /**
   * Updates
   */
  private calculate = (state: IClickerGameState): IClickerGameState => {
    let score = state.score;
    return {
      score: Math.max(0, score), // over 0
      upgrades: state.upgrades.map((upgrade) => {
        const newTime = upgrade.previous_time + upgrade.time_interval;
        if (newTime >= Date.now()) {
          // score
          score += upgrade.score * Math.pow(upgrade.ratio, upgrade.level);
          // update the upgrade
          upgrade.previous_time = newTime;
        }
        return upgrade;
      }),
    };
  };

  /**
   * Loop
   */
  private loop = async () => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const game = this;
    const start = Date.now();

    // calculate new states
    await Promise.all(
      this.activeUsers.map(async (username) => {
        const user = await UserModel.findOne({ where: { username } });
        if (user) {
          const prevState: IClickerGameState = JSON.parse(user.state as string);
          prevState.score = user.score; // ensure the right score
          const newState = game.calculate(prevState);
          await UserModel.update(
            {
              state: JSON.stringify(newState),
              score: newState.score,
            },
            { where: { username } }
          );

          // emit to user
          if (this.io) {
            this.io.to(username).emit("set_state", newState);
          }
        } else {
          // maybe delete user from the loop?
        }
      })
    );

    const timeDiff = Date.now() - start;

    // call back the loop
    if (!this.terminated) {
      setTimeout(() => {
        game.loop();
      }, Math.max(0, this.options.interval - timeDiff));
    }
  };

  public addUser = (username: string) => {
    if (!this.activeUsers.includes(username)) {
      this.activeUsers.push(username);
    }
  };

  public deleteUser = (username: string) => {
    if (this.activeUsers.includes(username)) {
      this.activeUsers = this.activeUsers.filter((name) => name !== username);
    }
  };

  public click = async (username: string) => {
    try {
      const clickScore = 1;
      await UserModel.increment({ score: clickScore }, { where: { username } });
    } catch (error) {
      logger({ error });
    }
  };

  /**
   * Starts looping
   */
  public start = () => {
    this.loop();
  };

  /**
   * Destroys the instance
   */
  public destroy = () => {
    this.terminated = true;
  };
}
