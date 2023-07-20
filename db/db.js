const { Sequelize } = require("sequelize");
require("dotenv").config();

const db = new Sequelize("postgres://localhost:5432/template1", {
  logging: false,
  dialectModule: require("pg"),
});

// console.log(process.env.POSTGRES_URL);

module.exports = db;
