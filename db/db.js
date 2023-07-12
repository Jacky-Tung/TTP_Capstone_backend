const { Sequelize } = require("sequelize");
require("dotenv").config();

const db = new Sequelize(process.env.POSTGRES_URL, {
  logging: false,
  dialectModule: require("pg"),
});

module.exports = db;
