const { Sequelize } = require("sequelize");
require("dotenv").config();

const db = new Sequelize(
  "postgres://liuke:220701528@98.116.214.14:5432/ttpteam5backend",
  {
    logging: false,
    dialectModule: require("pg"),
  }
);

// console.log(process.env.POSTGRES_URL);

module.exports = db;
