const seasonStart = new Date(
  process.env.KUKKACLICKER_SEASON_START
  || Date.now() + 1000 * 60 * 5
);
const seasonEnd = new Date(
  process.env.KUKKACLICKER_SEASON_END
  || +seasonStart + 1000 * 60 * 60 * 24 * 7 * 4
);

const config = {
  seasonStart,
  seasonEnd,
}

export default config;
