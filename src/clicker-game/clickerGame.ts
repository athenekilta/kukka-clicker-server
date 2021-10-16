import { Sequelize } from "sequelize";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { IClickerGameState, IClickerUpgrade, UserModel } from "../models/user";
import { logger } from "../utils/logger";
import { IClickerGameUpgradeDefinition, UPGRADES } from "./constants";

export interface IClickerGameOptions {
  interval: number;
  acceptable_idle_time: number;
}

export class ClickerGame {
  io: Server<DefaultEventsMap, DefaultEventsMap>;
  options: IClickerGameOptions;
  activeTimes: { [key: string]: number };
  terminated: boolean;

  constructor(options: IClickerGameOptions) {
    this.io = null;
    this.options = options;
    this.activeTimes = {};
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
    const now = Date.now();
    const upgrades = state.upgrades.map((upgrade) => {
      const upgradeDefinition = UPGRADES.find((up) => up.type === upgrade.type);
      if (upgrade.previous_time + upgradeDefinition.time_interval < now) {
        const howManyRewards = Math.floor(
          (now - upgrade.previous_time) / upgradeDefinition.time_interval
        );
        const reward =
          upgradeDefinition.score *
          Math.pow(upgradeDefinition.ratio, upgrade.level);
        // score
        score += howManyRewards * reward;
        // update the upgrade
        upgrade.previous_time =
          upgrade.previous_time +
          howManyRewards * upgradeDefinition.time_interval;
      }
      return upgrade;
    });
    return {
      score: Math.max(0, score), // over 0
      upgrades,
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
      Object.keys(this.activeTimes)
        .filter((key) => {
          const time = this.activeTimes[key];
          return start - time < this.options.acceptable_idle_time;
        })
        .map(async (username) => {
          const user = await UserModel.findOne({ where: { username } });
          if (user) {
            const prevState: IClickerGameState = JSON.parse(
              user.state as string
            );
            prevState.score = user.score; // ensure the right score

            // calculate
            const newState = game.calculate(prevState);
            const diff = newState.score - prevState.score;
            await UserModel.update(
              {
                state: JSON.stringify(newState),
                score: Sequelize.literal(`score + ${diff}`),
                time_played: Sequelize.literal(`time_played + ${1}`),
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

    // update leaderboard
    if (this.io) {
      try {
        const users = await UserModel.findAll({
          order: [["score", "DESC"]],
          limit: 10,
        });
        this.io.emit(
          "leaderboard",
          users.map((u) => ({ username: u.username, score: u.score }))
        );
      } catch (error) {
        console.log(error);
      }
    }

    const timeDiff = Date.now() - start;

    // call back the loop
    if (!this.terminated) {
      setTimeout(() => {
        game.loop();
      }, Math.max(0, this.options.interval - timeDiff));
    }
  };

  public userHeartbeat = (username: string) => {
    this.activeTimes[username] = Date.now();
  };

  public userJoin = async (username: string) => {
    const user = await UserModel.findOne({ where: { username } });
    if (user) {
      const prevState: IClickerGameState = JSON.parse(user.state as string);
      const now = Date.now();
      const newUpgrades = prevState.upgrades.map((upgrade) => {
        return { ...upgrade, previous_time: now };
      });
      const newState = { score: prevState.score, upgrades: newUpgrades };
      await UserModel.update(
        {
          state: JSON.stringify(newState),
        },
        { where: { username } }
      );
      this.userHeartbeat(username);
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
   * Upgrades one of users upgrades
   */
  public upgrade = async (username: string, type: string) => {
    try {
      const user = await UserModel.findOne({ where: { username } });
      const upgrade: IClickerGameUpgradeDefinition = UPGRADES.find(
        (up) => up.type === type
      );
      if (user && upgrade) {
        const state: IClickerGameState = JSON.parse(user.state as string);
        const existingUpgrade = state.upgrades.find((up) => up.type === type);
        // calculate the cost
        let actualCost = upgrade.cost;
        if (existingUpgrade) {
          actualCost = upgrade.cost * Math.pow(2, existingUpgrade.level);
        }
        // if there is enough score?
        if (user.score >= actualCost) {
          if (existingUpgrade) {
            existingUpgrade.level += 1;
          } else {
            const newUpgrade: IClickerUpgrade = {
              type,
              previous_time: Date.now(),
              level: 1,
            };
            state.upgrades.push(newUpgrade);
          }
          state.score = user.score; // ensure the right score
          await UserModel.update(
            {
              state: JSON.stringify(state),
              score: Sequelize.literal(`score - ${actualCost}`),
            },
            { where: { username } }
          );
        }
      }
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
