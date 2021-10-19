import { Sequelize } from "sequelize";
import { UPGRADES } from "../src/clicker-game/constants";
import { UserModel } from "../src/models/user";

const AMOUNT_OF_CONCURRENT_USERS = 250;

test("performance", async () => {
  await UserModel.destroy({ where: {}, truncate: true });

  // create
  const chars = "abcdefghijklmnopgrstuvwxyz0987654321";
  const randomNames = new Array(AMOUNT_OF_CONCURRENT_USERS).fill(0).map(() => {
    let name = "";
    for (let i = 0; i < 20; i++) {
      name += chars[Math.floor(Math.random() * chars.length)];
    }
    return name;
  });

  await Promise.all(
    randomNames.map(async (name) => {
      const newUser = await UserModel.create({
        username: name,
        password: "safe_password",
        state: JSON.stringify({
          score: 10000,
          upgrades: UPGRADES.map((u) => ({
            type: u.type,
            previous_time: Date.now(),
            level: 3,
          })),
        }),
      });
      return newUser;
    })
  );

  const calculate = (state) => {
    let score = state.score;
    const now = Date.now();
    const upgrades = state.upgrades.map((upgrade) => {
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
      return upgrade;
    });
    return {
      score: Math.max(0, score), // over 0
      upgrades,
    };
  };

  // loop
  const loop = async () => {
    const start = Date.now();

    const users = await UserModel.findAll();

    // calculate new states
    await Promise.all(
      users.map(async (user) => {
        if (user) {
          const prevState = JSON.parse(user.state as string);
          prevState.score = user.score; // ensure the right score

          // calculate
          const newState = calculate(prevState);
          const diff = newState.score - prevState.score;
          await UserModel.update(
            {
              state: JSON.stringify(newState),
              score: Sequelize.literal(`score + ${diff}`),
              time_played: Sequelize.literal(`time_played + ${1}`),
            },
            { where: { username: user.username } }
          );
        }
      })
    );

    const lb = await UserModel.findAll({
      order: [["score", "DESC"]],
      limit: 10,
    });

    return Date.now() - start;
  };

  const duration = await loop();

  expect(duration).toBeLessThan(1000);
}, 10000);
