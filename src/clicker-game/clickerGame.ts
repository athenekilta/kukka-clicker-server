import { UserModel } from "../models/user";

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
  options: IClickerGameOptions;
  activeUsers: string[];
  terminated: boolean;

  constructor(options: IClickerGameOptions) {
    this.options = options;
    this.activeUsers = [];
    this.terminated = false;
  }

  /**
   * Updates
   */
  calculate = (state: IClickerGameState): IClickerGameState => {
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

  /**
   * Starts looping
   */
  start = () => {
    this.loop();
  };

  /**
   * Destroys the instance
   */
  destroy = () => {
    this.terminated = true;
  };
}
