import { DataTypes } from "sequelize";

import sequelize from "../../../utils/db/connect.js";

import Sequelize from "sequelize";

const Product = sequelize.define(
  "product",
  {
    product_id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "https://i.pravatar.cc/300",
      validate: {
        isURL: true,
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  { underscored: true }
);
export default Product;
