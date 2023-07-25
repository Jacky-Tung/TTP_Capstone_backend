const { DataTypes } = require("sequelize");
const db = require("../db");
const Playback = require("./playback");
const User = require("./user");

const ActivePlaybackDetails = db.define("ActivePlaybackDetails", {
  playback_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Playback,
      key: "playback_id",
    },
  },
  user_id: {
    type: DataTypes.STRING,
    references: {
      model: User,
      key: "user_id",
    },
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

module.exports = ActivePlaybackDetails;
