const User = require("./user");
const Song = require("./song");
const Playback = require("./playback");

User.belongsToMany(Song, { through: Playback });
Song.belongsToMany(User, { through: Playback });

module.exports = {
  User,
  Song,
  Playback,
};
