import { DataTypes } from "sequelize";

import sequelize from "../../../utils/db/connect.js";

import Sequelize from "sequelize";

import Review from "./model.js";

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "https://i.pravatar.cc/300",
      validate: {
        isURL: true,
      },
    },
  },
  { underscored: true }
);

Review.belongsTo(User);
User.hasMany(Review, {
  omDelate: "CASCADE",
});

export default User;
