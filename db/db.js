const { Sequelize } = require("sequelize");
require("dotenv").config();

const db = new Sequelize(process.env.POSTGRES_URL, {
  logging: true,
  dialectModule: require("pg"),
});

// console.log(process.env.POSTGRES_URL);

module.exports = db;
