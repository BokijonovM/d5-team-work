import { DataTypes } from "sequelize";

import sequelize from "../../../utils/db/connect.js";
import Product from "../ProductsDB/model.js";
import Sequelize from "sequelize";

const Users = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { underscored: true }
);

Users.hasMany(Product, {
  onDelete: "CASCADE",
});

Product.belongsTo(Users);

export default Users;
