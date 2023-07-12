const User = require("./user");
const Song = require("./song");
const Playback = require("./playback");

User.belongsToMany(Song, { through: Playback });
Song.belongsToMany(User, { through: Playback });
// User.hasMany(Song);
// Song.belongsTo(User, { as: "userSongs", constraints: false });

module.exports = {
  User,
  Song,
  Playback,
};
