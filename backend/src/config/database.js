const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load environment variables

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);

module.exports = sequelize;
