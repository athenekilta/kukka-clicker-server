import { UPGRADES } from "../src/clicker-game/constants";

// balance constants
const MIN_PROCEEDING_TIME_PER_LEVEL = 10 * 60; // 10min
const MAX_PROCEEDING_TIME_PER_LEVEL = 6 * 60 * 60; // 6h
const MAX_PROCEEDING_TIME_PER_LEVEL_ENDGAME = 16 * 60 * 60; // 6h
const MAX_COST_TO_REWARD_RATIO = 1;
const MIN_COST_TO_REWARD_RATIO = 1 / 1000;

test("check balance", () => {
  const endgameIdx =
    UPGRADES.findIndex((obj) => obj.type === "Alkuräjähdys 2.0") + 1;

  const mapped = UPGRADES.filter((x, i) => i !== UPGRADES.length - 1).map(
    (upgrade, i) => {
      if (i === UPGRADES.length - 1) return { type: upgrade.type };
      const isEndgame = i >= endgameIdx;
      const next = UPGRADES[i + 1];

      const MAX_TIME = isEndgame
        ? MAX_PROCEEDING_TIME_PER_LEVEL_ENDGAME
        : MAX_PROCEEDING_TIME_PER_LEVEL;

      const scorePerSec = (upgrade.score / upgrade.time_interval) * 1000;
      const proceeding_time = Math.ceil(next.cost / scorePerSec);
      const min_acceptable_reward =
        ((next.cost / MAX_TIME) * upgrade.time_interval) / 1000;
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
          (isEndgame ||
            (cost_to_revard_ratio <= MAX_COST_TO_REWARD_RATIO &&
              cost_to_revard_ratio >= MIN_COST_TO_REWARD_RATIO)),
      };
    }
  );

  console.log(mapped);

  expect(!!mapped.every((m) => m.acceptable)).toBeTruthy();
});
