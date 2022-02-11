import { DataTypes } from "sequelize";

import sequelize from "../../../utils/db/connect.js";

import Sequelize from "sequelize";

import Product from "./model.js";
const Category = sequelize.define(
  "categories",
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

Category.belongsToMany(Product, { through: "product_category" });
Product.belongsToMany(Category, { through: "product_category" });

export default Category;
