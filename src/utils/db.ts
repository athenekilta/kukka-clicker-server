import { Sequelize } from "sequelize";
import { logger } from "./logger";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "db/database.sqlite",
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    return sequelize;
  } catch (error) {
    logger({ error });
  }
  return null;
};

export { connectDB };
