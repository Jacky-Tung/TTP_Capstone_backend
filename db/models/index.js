const User = require("./user");
const Song = require("./song");
const Playback = require("./playback");

User.belongsToMany(Song, {
  through: Playback,
  foreignKey: "userId",
  otherKey: "songId",
});
Song.belongsToMany(User, {
  through: Playback,
  foreignKey: "songId",
  otherKey: "userId",
});

module.exports = {
  User,
  Song,
  Playback,
};
