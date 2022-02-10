import Sequelize from "sequelize";
const { POSTGRES_URI } = process.env;

const sequelize = new Sequelize(POSTGRES_URI, {
  dialect: "postgres",
});

export const authenticateDatabase = async () => {
  try {
    await sequelize.authenticate({ logging: false });
    await sequelize.sync({ alter: true, logging: false });
    console.log("✅ Connection has been established successfully.");
  } catch (error) {
    console.log(error);
    console.error("❌ Unable to connect to the database:", error);
  }
};

export default sequelize;
