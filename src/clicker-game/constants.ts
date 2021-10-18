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
    ratio: 1.8,
    score: 0.001,
    time_interval: 5000,
  },
  {
    cost: 0.15,
    type: "Lannoitus",
    description:
      "Pelkällä rakkaudella ja vedellä pääsee pitkälle, mutta jos suuri kasvu on tärkeää, klikkaa tästä.",
    ratio: 1.5,
    score: 0.005,
    time_interval: 4000,
  },
  {
    cost: 0.24,
    type: "Kasvilamppu",
    description: "Voimista photosynteesiä keinoauringolla.",
    ratio: 1.9,
    score: 0.0008,
    time_interval: 500,
  },
  {
    cost: 0.999,
    type: "Phuksien laulukoeharjoitukset",
    description: "Hiilidioksidi auttaa kukkaa kasvamaan.",
    ratio: 1.6,
    score: 0.02,
    time_interval: 8000,
  },
  {
    cost: 2.8,
    type: "Puutarhuri",
    description:
      "Puutarhuri rakastaa kukkaa puolestasi automaattisesti ja tehokkaasti.",
    ratio: 1.6,
    score: 0.03,
    time_interval: 3000,
  },
  {
    cost: 8,
    type: "Kake",
    description:
      "Yksi Kake vastaa kymmentä puutarhuria! (disclaimer: ainakin kuvaannollisesti)",
    ratio: 1.95,
    score: 0.1,
    time_interval: 10000,
  },
  {
    cost: 15,
    type: "OLOhuone",
    description: "Lahjo OTMK pitämään huolta kukasta.",
    ratio: 1.4,
    score: 0.1,
    time_interval: 5000,
  },
  {
    cost: 60,
    type: "T-talon kurkkukasvimaa",
    description: "Kun olkkari ei enää riitä, on laajennettava reviiriä.",
    ratio: 1.8,
    score: 0.5,
    time_interval: 4500,
  },
  {
    cost: 400,
    type: "Kunnallinen kasvatuslaitos",
    description:
      "Lannoitus, kastelu ja valaistus antavat kukkaselle optimaaliset kasvuolosuhteet.",
    ratio: 1.5,
    score: 1.5,
    time_interval: 4500,
  },
  {
    cost: 1200,
    type: "Kukkavallankumous",
    description:
      "Eikö olisikin näppärää, jos presidentin tärkein tehtävä olisi turvata kasvua?",
    ratio: 1.4,
    score: 500,
    time_interval: 3500,
  },
  {
    cost: 6371000,
    type: "Kukkaplaneetta",
    description: "Koko planeetta tukee nyt kukkasi kasvua.",
    ratio: 1.8,
    score: 36000,
    time_interval: 4400,
  },
  {
    cost: 1.5e8,
    type: "Aurinkokunta",
    description:
      "Kukka tarvitsee yhteyttääkseen Auringon koko säteilyenergian.",
    ratio: 1.2,
    score: 5.5e8,
    time_interval: 9800,
  },
  {
    cost: 4 * Math.pow(10, 16),
    type: "Tähtiryhmä",
    description:
      "Pakollinen askel matkallasi kohti maailmankaikkeuden upeinta kukkaistutusta.",
    ratio: 1.6,
    score: 2.5 * Math.pow(10, 14),
    time_interval: 6000,
  },
  {
    cost: 1.2e18,
    type: "Linnunradan kukankasvattajat ry",
    description: "Järjestötoiminta kannattaa aina",
    ratio: 1.6,
    score: 1.26e16,
    time_interval: 4000,
  },
  {
    cost: 4.2e21,
    type:
      "Jyri Possu Galactic Order Enforcement and Plant Operations Management",
    description:
      "Boostaa galaksisi tuotantokapasiteettia palkkaamalla armeija Jyri Possuja.",
    ratio: 1.7,
    score: 1.26e19,
    time_interval: 3200,
  },
  {
    cost: 9.46e23,
    type: "Galaksiryhmien viljelyliittouma",
    description: "Monta galaksia on parempi kuin yksi galaksi.",
    ratio: 2.1,
    score: 7.82e22,
    time_interval: 9000,
  },
  {
    cost: 5e28,
    type: "Kukkauniversumi",
    description: "Jos avaruus on ääretön, mitä sen reunalta löytyy?",
    ratio: 1.7,
    score: 1.35e28,
    time_interval: 10000,
  },
  {
    cost: 1e32,
    type: "Alkuräjähdys 2.0",
    description: "Uskallatko?",
    ratio: 1.5,
    score: 3.1e29,
    time_interval: 500,
  },
  {
    cost: 4.0e33,
    type: "Web 3.0",
    description: "Minä projektiryhmästä wanhin...",
    ratio: 1.9,
    score: 2.7746722222222222e31,
    time_interval: 20000,
  },
  {
    cost: 9.98882e34,
    type: "4D-lasit",
    description: "Katso syvälle multiversumin sammakkoon.",
    ratio: 1.6,
    score: 1.0249999999999997e33,
    time_interval: 9000,
  },
  {
    cost: 8.2 * Math.pow(10, 36),
    type: "Industry 5.0",
    description: "6G-galaksit kiihdyttävät datan keruuta entisestään.",
    ratio: 2.0,
    score: 9.58e34,
    time_interval: 14000,
  },
  {
    cost: 6.9e38,
    type: "HTML6",
    description: "Modernit ongelmat vaativat moderneja ratkaisuja.",
    ratio: 1.8,
    score: 4.1666666666666666e35,
    time_interval: 15000,
  },
  {
    cost: 2e39,
    type: "7-tahkoinen kuutio",
    description:
      "Kasvata kukkaasi uusiin ulottuvuuksiin vaihtoehtoisen geometrian keinoin.",
    ratio: 2.0,
    score: 1.3875e38,
    time_interval: 15000,
  },
  {
    cost: 6.66e40,
    type: "Kahdeksas kuolemansynti",
    description: "Kasvua kyseenalaisin menetelmin.",
    ratio: 1.98,
    score: 2e39,
    time_interval: 18500,
  },
  {
    cost: 2e41,
    type: "Jyrki Porsas ja yhdeksän veljestä",
    description: "Jyri Possu tekee paluun Jyri Bossin muodossa.",
    ratio: 1.9,
    score: 6.6e39,
    time_interval: 17000,
  },
  {
    cost: 1.23e42,
    type: "???",
    description: "????? ????? ????? ?????",
    ratio: 2.5,
    score: 7.2e40,
    time_interval: 200,
  },
];
