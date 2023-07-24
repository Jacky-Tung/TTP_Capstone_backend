const { DataTypes } = require("sequelize");
const db = require("../db");

const User = db.define("User", {
  userId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  access_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = User;
