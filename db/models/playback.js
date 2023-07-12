const { DataTypes } = require("sequelize");
const db = require("../db");

const Playback = db.define("Playback", {
  playback_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: false,
  },
  longitude: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: false,
  },
});

module.exports = Playback;
