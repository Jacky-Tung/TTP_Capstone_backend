const { DataTypes } = require("sequelize");
const db = require("../db");
const User = require("./user");
const Song = require("./song");

const Playback = db.define("Playback", {
  playback_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true, 
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.STRING,
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
  // isCurrentlyPlaying: {
  //   type: DataTypes.BOOLEAN,
  //   defaultValue: true,
  // },
});

module.exports = Playback;
