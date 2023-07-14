const { DataTypes } = require("sequelize");
const db = require("../db");
const User = require("./user");
const Song = require("./song");

const Playback = db.define("Playback", {
  playback_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: "user_id",
    },
  },
  song_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Song,
      key: "song_id",
    },
  },
});

module.exports = Playback;
