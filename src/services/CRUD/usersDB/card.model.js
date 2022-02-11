import { DataTypes } from "sequelize";

import sequelize from "../../../utils/db/connect.js";

import Sequelize from "sequelize";

import Users from "./model.js";

const Cards = sequelize.define(
  "cards",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { underscored: true }
);

Cards.belongsToMany(Users, { through: "review_cards" });
Users.belongsToMany(Cards, { through: "review_cards" });

export default Cards;
