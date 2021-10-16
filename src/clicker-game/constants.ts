export interface IClickerGameUpgradeDefinition {
  /**
   * This is the name of the upgrade
   */
  type: string;

  /**
   * Longer description of the upgrade
   */
  description: string;

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
    cost: 0.02,
    type: "Kastelu",
    description:
      "Kasvit rakastavat vettä. Niin rakastat sinäkin. Muista juoda vettä.",
    ratio: 1.2,
    score: 0.01,
    time_interval: 1000,
  },
  {
    cost: 0.1,
    type: "Lannoitus",
    description:
      "Pelkällä rakkaudella ja vedellä pääsee pitkälle, mutta jos suuri kasvu on tärkeää, klikkaa tästä.",
    ratio: 1.2,
    score: 0.05,
    time_interval: 1200,
  },
  {
    cost: 0.2,
    type: "Kasvilamppu",
    description: "Boostaa photosynteesiä keinoauringolla.",
    ratio: 1.5,
    score: 0.06,
    time_interval: 1100,
  },
  {
    cost: 0.5,
    type: "Phuksien laulukoeharjoitukset",
    description: "Hiilidioksidi auttaa kukkaa kasvamaan.",
    ratio: 1.1,
    score: 0.1,
    time_interval: 1400,
  },
  {
    cost: 5,
    type: "Puutarhuri",
    description: "Puutarhuri rakastaa kukkaa puolestasi automaattisesti.",
    ratio: 1.2,
    score: 1,
    time_interval: 1000,
  },
  {
    cost: 50,
    type: "Kake",
    description: "Yksi Kake vastaa kymmentä puutarhuria!",
    ratio: 1.2,
    score: 45,
    time_interval: 10000,
  },
  {
    cost: 330,
    type: "OLOhuone",
    description: "Lahjo OTMK pitämään huolta kukasta.",
    ratio: 1.2,
    score: 35,
    time_interval: 5000,
  },
  {
    cost: 1000,
    type: "T-talon kurkkukasvimaa",
    description: "Kun olkkari ei enää riitä, on laajennettava reviiriä.",
    ratio: 1.5,
    score: 60,
    time_interval: 8000,
  },
  {
    cost: 10000,
    type: "Kasvatuslaitos",
    description:
      "Lannoitus, kastelu ja valaistus antavat kukkaselle optimaaliset kasvuolosuhteet.",
    ratio: 1.05,
    score: 200,
    time_interval: 8500,
  },
  {
    cost: 100000,
    type: "Kukkaplaneetta",
    description: "Koko planeetta tukee nyt kukkasi kasvua.",
    ratio: 1.05,
    score: 10000,
    time_interval: 9500,
  },
  {
    cost: 1000000,
    type: "Aurinkokunta",
    description:
      "Kukka tarvitsee yhteyttääkseen Auringon koko säteilyenergian.",
    ratio: 1.05,
    score: 100000,
    time_interval: 9800,
  },
  {
    cost: 5000000,
    type: "Tähtiryhmä",
    description:
      "Pakollinen askel matkallasi maailmankaikkeuden upeinta kukkaistutusta.",
    ratio: 1.05,
    score: 800000,
    time_interval: 9900,
  },
  {
    cost: 7500000,
    type: "Jyri Possu Galactic Order and Plant Operations Management",
    description:
      "Boostaa galaksisi tuotantokapasiteettia palkkaamalla armeija Jyri Possuja.",
    ratio: 1.05,
    score: 500000,
    time_interval: 200,
  },
  {
    cost: 10000000,
    type: "Galaksiryhmien viljelyliittouma",
    description: "Monta galaksia on parempi kuin yksi galaksi.",
    ratio: 1.05,
    score: 1000000,
    time_interval: 9000,
  },
  {
    cost: 500000000,
    type: "Kukkauniversumi",
    description: "Jos avaruus on ääretön, mitä sen reunalta löytyy?",
    ratio: 1.1,
    score: 10000000,
    time_interval: 10000,
  },
  {
    cost: 1000000000,
    type: "Alkuräjähdys 2.0",
    description: "Uskallatko?",
    ratio: 1.02,
    score: 300000000,
    time_interval: 20000,
  },
];
