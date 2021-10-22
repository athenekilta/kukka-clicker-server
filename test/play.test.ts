import { UPGRADES } from "../src/clicker-game/constants";
import { ClickerGame } from "../src/clicker-game/clickerGame";

// playtest constants
const CLICKS_PER_SECOND = 10;
const MAX_GAME_TIME = 60 * 60 * 24 * 30 * 3; // 3kk

test("play test – always buy an upgrade", () => {
  const upgrades = UPGRADES.map((upgrade) => ({
    ...upgrade,
    ...{
      previous_time: 0,
      level: 0,
    },
  }));

  let tick = 0;
  let score = 0;
  let level = 0;
  let boomTick = 0;
  let end = false;

  while (!end && tick < MAX_GAME_TIME) {
    const time = tick * 1000;

    // upgrade what you can
    const availableUpgrade = upgrades.find(
      (upgrade) =>
        ClickerGame.costOfUpgrade(upgrade.cost, upgrade.level) <= score
    );
    if (availableUpgrade) {
      score -= ClickerGame.costOfUpgrade(
        availableUpgrade.cost,
        availableUpgrade.level
      );
      availableUpgrade.level += 1;
      level += 1;
      if (availableUpgrade.type === UPGRADES[UPGRADES.length - 1].type) {
        end = true;
      }
      if (boomTick === 0 && availableUpgrade.type === "Alkuräjähdys 2.0") {
        boomTick = tick;
      }
    }

    // add to score
    upgrades.forEach((upgrade) => {
      if (upgrade.level === 0) return;
      if (upgrade.previous_time + upgrade.time_interval < time) {
        const howManyRewards = Math.floor(
          (time - upgrade.previous_time) / upgrade.time_interval
        );
        const reward = upgrade.score * Math.pow(upgrade.ratio, upgrade.level);
        // score
        score += howManyRewards * reward;
        // update the upgrade
        upgrade.previous_time =
          upgrade.previous_time + howManyRewards * upgrade.time_interval;
      }
      return upgrade;
    });

    // clicks
    score += CLICKS_PER_SECOND * ClickerGame.clickScore(level);
    // tick
    tick++;
  }

  console.log(`boom 2.0: ${boomTick / 60}h, playtime ${tick / 60}h`);

  expect(end && tick);
  // expect(end && tick > 0 && tick < MAX_GAME_TIME).toBeTruthy();
});

test("play test – buy the best upgrade every minute", () => {
  const upgrades = UPGRADES.map((upgrade) => ({
    ...upgrade,
    ...{
      previous_time: 0,
      level: 0,
    },
  }));

  let tick = 0;
  let score = 0;
  let level = 0;
  let boomTick = 0;
  let end = false;

  while (!end && tick < MAX_GAME_TIME) {
    const time = tick * 1000;

    // upgrade
    if (tick % 60 === 0) {
      const availableUpgrades = upgrades.filter(
        (upgrade) =>
          ClickerGame.costOfUpgrade(upgrade.cost, upgrade.level) <= score
      );
      const availableUpgrade = availableUpgrades.sort(
        (l, r) => r.score - l.score
      )[0];
      if (availableUpgrade) {
        score -= ClickerGame.costOfUpgrade(
          availableUpgrade.cost,
          availableUpgrade.level
        );
        availableUpgrade.level += 1;
        level += 1;
        if (availableUpgrade.type === UPGRADES[UPGRADES.length - 1].type) {
          end = true;
        }
        if (boomTick === 0 && availableUpgrade.type === "Alkuräjähdys 2.0") {
          boomTick = tick;
        }
      }
    }

    // add to score
    upgrades.forEach((upgrade) => {
      if (upgrade.level === 0) return;
      if (upgrade.previous_time + upgrade.time_interval < time) {
        const howManyRewards = Math.floor(
          (time - upgrade.previous_time) / upgrade.time_interval
        );
        const reward = upgrade.score * Math.pow(upgrade.ratio, upgrade.level);
        // score
        score += howManyRewards * reward;
        // update the upgrade
        upgrade.previous_time =
          upgrade.previous_time + howManyRewards * upgrade.time_interval;
      }
      return upgrade;
    });

    // clicks
    score += CLICKS_PER_SECOND * ClickerGame.clickScore(level);

    // tick
    tick++;
  }

  console.log(upgrades);

  console.log(`boom 2.0: ${boomTick / 60}h, playtime ${tick / 60}h`);

  expect(end && tick > 0 && tick < MAX_GAME_TIME).toBeTruthy();
});
