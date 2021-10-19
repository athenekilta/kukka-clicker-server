import { UPGRADES } from "../src/clicker-game/constants";

// balance constants
const MIN_PROCEEDING_TIME_PER_LEVEL = 5 * 60; // 2min
const MAX_PROCEEDING_TIME_PER_LEVEL = 6 * 60 * 60; // 6h
const MAX_COST_TO_REWARD_RATIO = 1;
const MIN_COST_TO_REWARD_RATIO = 1 / 1000;

test("check balance", () => {
  const mapped = UPGRADES.filter((x, i) => i !== UPGRADES.length - 1).map(
    (upgrade, i) => {
      if (i === UPGRADES.length - 1) return { type: upgrade.type };
      const next = UPGRADES[i + 1];

      const scorePerSec = (upgrade.score / upgrade.time_interval) * 1000;
      const proceeding_time = Math.ceil(next.cost / scorePerSec);
      const min_acceptable_reward =
        ((next.cost / MAX_PROCEEDING_TIME_PER_LEVEL) * upgrade.time_interval) /
        1000;
      const max_acceptable_reward =
        ((next.cost / MIN_PROCEEDING_TIME_PER_LEVEL) * upgrade.time_interval) /
        1000;

      const cost_to_revard_ratio =
        ((upgrade.score / upgrade.time_interval) * 1000) / upgrade.cost;

      return {
        type: upgrade.type,
        proceeding_time,
        cost_to_revard_ratio,
        min_acceptable_reward,
        max_acceptable_reward,
        acceptable:
          upgrade.score >= min_acceptable_reward &&
          upgrade.score <= max_acceptable_reward &&
          cost_to_revard_ratio <= MAX_COST_TO_REWARD_RATIO &&
          cost_to_revard_ratio >= MIN_COST_TO_REWARD_RATIO,
      };
    }
  );

  console.log(mapped);

  expect(mapped.every((m) => m.acceptable)).toBeTruthy();
});

// playtest constants
const CLICKS_PER_SECOND = 10;
const MAX_GAME_TIME = 60 * 60 * 24 * 30; // kuukausi

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
        (upgrade.level === 0
          ? upgrade.cost
          : upgrade.cost * Math.pow(2, upgrade.level)) <= score
    );
    if (availableUpgrade) {
      score -=
        availableUpgrade.level === 0
          ? availableUpgrade.cost
          : availableUpgrade.cost * Math.pow(2, availableUpgrade.level);
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
    score +=
      CLICKS_PER_SECOND * 0.001 * (level + 1) + Math.pow(level, 3) / 100000;

    // tick
    tick++;
  }

  console.log(`boom 2.0: ${boomTick / 60}h, playtime ${tick / 60}h`);

  expect(end && tick > 0 && tick < MAX_GAME_TIME).toBeTruthy();
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

  while (!end && tick < 100000) {
    const time = tick * 1000;

    // upgrade
    if (tick % 60 === 0) {
      const availableUpgrades = upgrades.filter(
        (upgrade) =>
          (upgrade.level === 0
            ? upgrade.cost
            : upgrade.cost * Math.pow(2, upgrade.level)) <= score
      );
      const availableUpgrade = availableUpgrades.sort(
        (l, r) => r.score - l.score
      )[0];
      if (availableUpgrade) {
        score -=
          availableUpgrade.level === 0
            ? availableUpgrade.cost
            : availableUpgrade.cost * Math.pow(2, availableUpgrade.level);
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
    score +=
      CLICKS_PER_SECOND * 0.001 * (level + 1) + Math.pow(level, 3) / 100000;

    // tick
    tick++;
  }

  console.log(`boom 2.0: ${boomTick / 60}h, playtime ${tick / 60}h`);

  expect(end && tick > 0 && tick < MAX_GAME_TIME).toBeTruthy();
});
