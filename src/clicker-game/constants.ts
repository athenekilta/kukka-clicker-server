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
    score: 30,
    time_interval: 10000,
  },
  {
    cost: 330,
    type: "OLOhuone",
    description: "Lahjo OTMK pitämään huolta kukasta.",
    ratio: 1.2,
    score: 30,
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
    cost: 5000,
    type: "Kunnallinen kasvatuslaitos",
    description:
      "Lannoitus, kastelu ja valaistus antavat kukkaselle optimaaliset kasvuolosuhteet.",
    ratio: 1.05,
    score: 200,
    time_interval: 8500,
  },
  {
    cost: 30000,
    type: "Kukkavallankumous",
    description:
      "Eikö olisikin näppärää, jos presidentin tärkein tehtävä olisi turvata kasvua?",
    ratio: 1.05,
    score: 200,
    time_interval: 8500,
  },
  {
    cost: 1.0 * Math.pow(10, 5),
    type: "Kukkaplaneetta",
    description: "Koko planeetta tukee nyt kukkasi kasvua.",
    ratio: 1.05,
    score: 10000,
    time_interval: 9500,
  },
  {
    cost: 1.0 * Math.pow(10, 6),
    type: "Aurinkokunta",
    description:
      "Kukka tarvitsee yhteyttääkseen Auringon koko säteilyenergian.",
    ratio: 1.05,
    score: 100000,
    time_interval: 9800,
  },
  {
    cost: 5 * Math.pow(10, 6),
    type: "Tähtiryhmä",
    description:
      "Pakollinen askel matkallasi maailmankaikkeuden upeinta kukkaistutusta.",
    ratio: 1.05,
    score: 800000,
    time_interval: 9900,
  },
  {
    cost: 7.5 * Math.pow(10, 6),
    type: "Jyri Possu Galactic Order and Plant Operations Management",
    description:
      "Boostaa galaksisi tuotantokapasiteettia palkkaamalla armeija Jyri Possuja.",
    ratio: 1.05,
    score: 500000,
    time_interval: 200,
  },
  {
    cost: 1.0 * Math.pow(10, 7),
    type: "Galaksiryhmien viljelyliittouma",
    description: "Monta galaksia on parempi kuin yksi galaksi.",
    ratio: 1.05,
    score: 1000000,
    time_interval: 9000,
  },
  {
    cost: 5 * Math.pow(10, 8),
    type: "Kukkauniversumi",
    description: "Jos avaruus on ääretön, mitä sen reunalta löytyy?",
    ratio: 1.1,
    score: 10000000,
    time_interval: 10000,
  },
  {
    cost: 10.0 * Math.pow(10, 9),
    type: "Alkuräjähdys 2.0",
    description: "Uskallatko?",
    ratio: 1.02,
    score: 300000000,
    time_interval: 20000,
  },
  {
    cost: 400.0 * Math.pow(10, 9),
    type: "Web 3.0",
    description: "Minä projektiryhmästä nuorin...",
    ratio: 1.2,
    score: 3 * Math.pow(10, 9),
    time_interval: 20000,
  },
  {
    cost: 998.882 * Math.pow(10, 9),
    type: "4D-lasit",
    description: "Katso syvälle multiversumin sammakkoon.",
    ratio: 1.08,
    score: 30 * Math.pow(10, 9),
    time_interval: 9000,
  },
  {
    cost: 8.2 * Math.pow(10, 12),
    type: "Industry 5.0",
    description: "6G-galaksit kiihdyttävät datan keruuta entisestään.",
    ratio: 1.2,
    score: 300 * Math.pow(10, 9),
    time_interval: 14000,
  },
  {
    cost: 69 * Math.pow(10, 12),
    type: "HTML6",
    description: "Modernit ongelmat vaativat moderneja ratkaisuja.",
    ratio: 1.2,
    score: 4.2 * Math.pow(10, 12),
    time_interval: 15000,
  },
  {
    cost: 2 * Math.pow(10, 15),
    type: "7-tahkoinen kuutio",
    description:
      "Kasvata kukkaasi uusiin ulottuvuuksiin vaihtoehtoisen geometrian keinoin.",
    ratio: 1.2,
    score: 290 * Math.pow(10, 12),
    time_interval: 15000,
  },
  {
    cost: 666 * Math.pow(10, 15),
    type: "Kahdeksas kuolemansynti",
    description: "Kasvua kyseenalaisin menetelmin.",
    ratio: 1.2,
    score: 20 * Math.pow(10, 15),
    time_interval: 18500,
  },
  {
    cost: 2 * Math.pow(10, 21),
    type: "Jyrki Porsas ja yhdeksän veljestä",
    description: "Jyri Possu tekee paluun Jyri Bossin muodossa.",
    ratio: 1.18,
    score: 2.2 * Math.pow(10, 18),
    time_interval: 17000,
  },
  {
    cost: 1.23 * Math.pow(10, 24),
    type: "???",
    description: "????? ????? ????? ?????",
    ratio: 1.18,
    score: 2.2 * Math.pow(10, 18),
    time_interval: 17000,
  },
];
