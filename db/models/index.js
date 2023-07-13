const User = require("./user");
const Song = require("./song");
const Playback = require("./playback");
const PlaybackDetails = require("./playback_details");

User.hasMany(Playback, { foreignKey: "user_id" });
Playback.belongsTo(User, { foreignKey: "user_id" });

Song.hasMany(Playback, { foreignKey: "song_id" });
Playback.belongsTo(Song, { foreignKey: "song_id" });

Playback.hasMany(PlaybackDetails, { foreignKey: "playback_id" });
PlaybackDetails.belongsTo(Playback, { foreignKey: "playback_id" });

module.exports = {
  User,
  Song,
  Playback,
  PlaybackDetails,
};
