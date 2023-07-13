const { DataTypes } = require("sequelize");
const db = require("../db");
const Playback = require("./playback");

const PlaybackDetails = db.define("PlaybackDetails", {
  playback_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Playback,
      key: "playback_id",
    },
  },
  latitude: {
    primaryKey: true,
    type: DataTypes.DECIMAL(9, 6),
    allowNull: false,
  },
  longitude: {
    primaryKey: true,
    type: DataTypes.DECIMAL(9, 6),
    allowNull: false,
  },
});

module.exports = PlaybackDetails;
