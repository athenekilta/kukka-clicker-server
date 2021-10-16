import { Model, DataTypes } from "sequelize";
import { IClickerGameState } from "../clicker-game/clickerGame";
import { sequelize } from "../utils/db";

export class UserModel extends Model {
  public username: string;
  public password: string;
  public score: number;
  public state: string | IClickerGameState;
}

UserModel.init(
  {
    username: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      primaryKey: true,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    score: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    state: {
      type: DataTypes.STRING(100000),
      defaultValue: '{ "score": 0, "upgrades": [] }',
    },
  },
  {
    tableName: "users",
    sequelize, // passing the `sequelize` instance is required
  }
);

UserModel.sync();
