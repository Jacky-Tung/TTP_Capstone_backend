const express = require("express");
const axios = require("axios");
const router = express.Router();
const { Playback, ActivePlaybackDetails, User, Song } = require("../db/models");
const db = require("../db");

router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(`
          SELECT "Songs".song_id,
                 "Songs".title,
                 "Songs".artist,
                 "Songs".image_url,
                 "Songs".external_url,
                 "Songs".preview_url,
                 "ActivePlaybackDetails".latitude,
                 "ActivePlaybackDetails".longitude,
                 "Users".user_id
          FROM "ActivePlaybackDetails"
          INNER JOIN "Playbacks"
              ON "Playbacks".playback_id = "ActivePlaybackDetails".playback_id
          INNER JOIN "Songs"
              ON "Playbacks".song_id = "Songs".song_id
          INNER JOIN "Users"
              ON "Playbacks".user_id = "Users".user_id
      `);

    return res.status(200).json({ content: result[0] });
  } catch (error) {
    next(error);
  }
});

router.use(express.json());

// router.post("/", async (req, res) => {
//   let playback = await Playback.findOne({
//     where: { playback_id: req.body.playback_id },
//   });

//   if (playback) {
//     try {
//       const { latitude, longitude } = req.body;

//       const newActivePlaybackDetails = await ActivePlaybackDetails.create({
//         playback_id: playback.playback_id,
//         latitude,
//         longitude,
//       });

//       const song = await Song.findByPk(playback.song_id);
//       const user = await User.findByPk(playback.user_id);
//       const newPlayback = {
//         song_id: song.song_id,
//         title: song.title,
//         artist: song.artist,
//         image_url: song.image_url,
//         external_url: song.external_url,
//         preview_url: song.preview_url,
//         latitude: newActivePlaybackDetails.latitude,
//         longitude: newActivePlaybackDetails.longitude,
//         user_id: user.user_id,
//       };
//       res.status(201).json(newPlayback);
//     } catch (error) {
//       console.error("Error:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   } else {
//     res.status(500).json({ error: "No such playback registered in database." });
//   }
// });

router.delete("/", async (req, res) => {
  const playbackIdToDelete = req.body.playback_id;

  try {
    const playbackToDelete = await ActivePlaybackDetails.findOne({
      where: { playback_id: playbackIdToDelete },
    });

    if (playbackToDelete) {
      await playbackToDelete.destroy();
      res.status(200).json({ message: "Playback deleted successfully." });
    } else {
      res.status(404).json({ error: "Playback not found." });
    }
  } catch (error) {
    console.error("Error while deleting playback:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
