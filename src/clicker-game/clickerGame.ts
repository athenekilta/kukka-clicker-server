import { Sequelize } from "sequelize";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { IClickerGameState, IClickerUpgrade, UserModel } from "../models/user";
import { logger } from "../utils/logger";
import { IClickerGameUpgradeDefinition, UPGRADES } from "./constants";

export interface IClickerGameOptions {
  interval: number;
  acceptable_idle_time: number;
  season_start: Date;
  season_end: Date;
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
   * Updates in place and returns score addition
   */
  private calculate = (state: IClickerGameState): number => {
    let score = 0;
    const now = Date.now();
    state.upgrades.forEach((upgrade) => {
      const upgradeDefinition = UPGRADES.find((up) => up.type === upgrade.type);
      if (upgrade.previous_time + upgradeDefinition.time_interval < now) {
        const howManyRewards = Math.floor(
          (now - upgrade.previous_time) / upgradeDefinition.time_interval
        );
        const reward =
          upgradeDefinition.score +
          upgradeDefinition.score *
            Math.pow(upgradeDefinition.ratio, upgrade.level - 1);
        // score
        score += howManyRewards * reward;
        // update the upgrade
        upgrade.previous_time =
          upgrade.previous_time +
          howManyRewards * upgradeDefinition.time_interval;
      }
    });
    return Math.max(0, score);
  };

  /**
   * Loop
   */
  private loop = async () => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const game = this;
    const start = Date.now();

    // check season
    const seasonIsOn = this.seasonIsOn();

    const activePlayers = Object.keys(this.activeTimes).filter((key) => {
      const time = this.activeTimes[key];
      return start - time < this.options.acceptable_idle_time;
    });

    const users = await UserModel.findAll({
      where: { username: activePlayers },
    });

    // calculate new states
    await Promise.all(
      users?.map(async (user) => {
        if (user) {
          const gameState = {
            upgrades: null,
            score: user.score,
            clicks: user.clicks,
          };
          const state: IClickerGameState = JSON.parse(user.state as string);
          if (seasonIsOn) {
            // calculate
            const addition = game.calculate(state);
            await UserModel.update(
              {
                state: JSON.stringify(state),
                score: Sequelize.literal(`score + ${addition}`),
                time_played: Sequelize.literal(`time_played + ${1}`),
              },
              { where: { username: user.username } }
            );
            gameState.upgrades = state.upgrades;
            gameState.score += addition;
          } else {
            gameState.upgrades = state.upgrades;
          }
          // emit to user
          if (this.io) {
            this.io.to(user.username).emit("set_state", gameState);
          }
        }
      })
    );

    // update leaderboard
    if (this.io) {
      try {
        const biggest = await UserModel.findAll({
          order: [["score", "DESC"]],
          limit: 10,
        });
        const clicks = await UserModel.findAll({
          order: [["clicks", "DESC"]],
          limit: 10,
        });
        const level = await UserModel.findAll({
          order: [["level", "DESC"]],
          limit: 10,
        });
        this.io.emit("leaderboard", {
          biggest: biggest.map((u) => ({
            username: u.username,
            score: u.score,
          })),
          clicks: clicks.map((u) => ({
            username: u.username,
            clicks: u.clicks,
          })),
          level: level.map((u) => ({
            username: u.username,
            level: u.level,
          })),
        });
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

  public seasonIsOn = () => {
    const now = Date.now();
    return (
      this.options.season_start.getTime() <= now &&
      this.options.season_end.getTime() > now
    );
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
    // check season
    const seasonIsOn = this.seasonIsOn();
    if (!seasonIsOn) return;

    try {
      const user = await UserModel.findOne({ where: { username } });
      const clickScore =
        0.001 * (user.level + 1) + Math.pow(user.level, 3) / 100000;
      await UserModel.increment(
        { score: clickScore, clicks: 1 },
        { where: { username } }
      );
    } catch (error) {
      logger({ error });
    }
  };

  /**
   * Upgrades one of users upgrades
   */
  public upgrade = async (username: string, type: string) => {
    // check season
    const seasonIsOn = this.seasonIsOn();
    if (!seasonIsOn) return;

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
          actualCost = ClickerGame.costOfUpgrade(
            upgrade.cost,
            existingUpgrade.level
          );
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
              level: Sequelize.literal(`level + 1`),
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

  // STATIC FUNCTIONS

  static costOfUpgrade = (initialCost: number, level: number) => {
    return level === 0 ? initialCost : initialCost * Math.pow(4.2, level);
  };

  static clickScore = (level: number) => {
    let score = 0;
    if (level <= 116) {
      score = 0.001 * (Math.pow(level, 2) + Math.pow(1.2, level));
    } else {
      score = Math.pow(level, 3);
    }
    return Math.min(Math.max(0, score), 1e20);
  };
}
