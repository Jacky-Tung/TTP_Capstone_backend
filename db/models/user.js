const { DataTypes } = require("sequelize");
const db = require("../db");

const User = db.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  display_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
