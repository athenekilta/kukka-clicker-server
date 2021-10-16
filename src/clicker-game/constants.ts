export interface IClickerGameUpgradeDefinition {
  /**
   * This is the name of the upgrade
   */
  type: string;

  /**
   * How much an upgrade imroves the initial score, should be over 1 but under 2
   */
  ratio: number;

  /**
   * initial score
   */
  score: number;

  /**
   * how often the rewards appear
   */
  time_interval: number;

  /**
   * How much does the upgrade intially cost, the cost for upgrades is 2^level * cost
   */
  cost: number;
}

export const UPGRADES: IClickerGameUpgradeDefinition[] = [
  {
    cost: 5,
    type: "gardener",
    ratio: 1.2,
    score: 1,
    time_interval: 1000,
  },
  {
    cost: 50,
    type: "kake",
    ratio: 1.2,
    score: 25,
    time_interval: 12000,
  },
  {
    cost: 1000,
    type: "cs-building",
    ratio: 1.5,
    score: 50,
    time_interval: 10000,
  },
  {
    cost: 10000,
    type: "factory",
    ratio: 1.05,
    score: 1000,
    time_interval: 500,
  },
];
