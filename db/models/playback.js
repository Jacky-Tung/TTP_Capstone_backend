const { DataTypes } = require("sequelize");
const db = require("db");

const Playback = db.define("Playback", {
  playback_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  latitude: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
});

module.exports = Playback;
