import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db";

export interface IClickerUpgrade {
  type: string;
  level: number;
  previous_time: number;
}

export interface IClickerGameState {
  score: number;
  upgrades: IClickerUpgrade[];
}
export class UserModel extends Model {
  public username: string;
  public password: string;
  public score: number;
  public level: number;
  public state: string | IClickerGameState;
  public time_played: number;
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
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    state: {
      type: DataTypes.STRING(100000),
      defaultValue: '{ "score": 0, "upgrades": [] }',
    },
    time_played: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
  },
  {
    tableName: "users",
    sequelize, // passing the `sequelize` instance is required
  }
);

UserModel.sync();
