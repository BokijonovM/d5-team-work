import { DataTypes } from "sequelize";

import sequelize from "../../../utils/db/connect.js";
import Product from "./model.js";
import Sequelize from "sequelize";

const Review = sequelize.define(
  "review",
  {
    review_id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { underscored: true }
);

Review.belongsToMany(Product, { through: "product_review" });
Product.belongsToMany(Review, { through: "product_review" });

// Product.hasMany(Review, {
//   onDelete: "CASCADE",
// });

// Review.belongsTo(Product);

export default Review;
