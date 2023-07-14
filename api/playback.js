const express = require("express");
const router = express.Router();
const { Playback, PlaybackDetails } = require("../db/models");
const db = require("../db");
const { sequelize, col } = require("sequelize/lib/model");

/**
 * Fetch all playbacks and playbackDetails
 * response: 
     [ {
            "song_id": 7,
            "title": "Need You Tonight",
            "artist": "Mr. Gabriel Stokes",
            "image_url": "https://avatars.githubusercontent.com/u/52638733",
            "external_url": "https://avatars.githubusercontent.com/u/71600639",
            "createdAt": "2023-07-14T04:43:12.764Z",
            "updatedAt": "2023-07-14T04:43:12.764Z",
            "latitude": "-24.299200",
            "longitude": "101.344500",
            "user_id": 4
        },]
 */
router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(`
        SELECT "Songs".*,
               "PlaybackDetails".latitude,
               "PlaybackDetails".longitude,
               "Users".user_id
        FROM "PlaybackDetails"
        INNER JOIN "Playbacks"
            ON "Playbacks".playback_id = "PlaybackDetails".playback_id
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

/**
 * Fetch playback and playbackDetails by id
 */
router.get("/:id", async (req, res, next) => {
  try {
    const playback = await Playback.findAll({
      where: { playback_id: req.params.id },
    });
    const playbackDetails = await PlaybackDetails.findAll({
      where: { playback_id: req.params.id },
    });
    const result = {
      playback: playback,
      playbackDetails: playbackDetails,
    };
    playback && playbackDetails
      ? res.status(200).json(result)
      : res.status(404).send("Playback Not Found");
  } catch (error) {
    next(error);
  }
});

// fetch playback and playbackDetails by user id and song id
router.get("/:userId/:songId", async (req, res, next) => {
  try {
    const user_id = parseInt(req.params.userId);
    const song_id = parseInt(req.params.songId);
    console.log(user_id, song_id);
    const playback = await Playback.findOne({
      where: { user_id: user_id, song_id: song_id },
    });
    const playbackDetails = await PlaybackDetails.findAll({
      where: { playback_id: playback.playback_id },
    });

    const result = {
      playback: playback,
      playbackDetails: playbackDetails,
    };
    playback && playbackDetails
      ? res.status(200).json(result)
      : res.status(404).send("Playback Not Found");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
