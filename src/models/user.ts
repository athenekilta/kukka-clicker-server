import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db";

export class UserModel extends Model {
  public username: string;
  public password: string;
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
  },
  {
    tableName: "users",
    sequelize, // passing the `sequelize` instance is required
  }
);
