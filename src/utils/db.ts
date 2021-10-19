import { Sequelize } from "sequelize";
import { logger } from "./logger";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  logging: false,
  storage: (process.env.NODE_ENV = "test"
    ? "db/test.sqlite"
    : "db/database.sqlite"),
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
