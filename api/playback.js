const express = require("express");
const axios = require("axios");
const router = express.Router();
const { Playback, PlaybackDetails, User, Song } = require("../db/models");
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
            "latitude": "-24.299200",
            "longitude": "101.344500",
            "user_id": 4
        },]
 */
router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(`
        SELECT "Songs".song_id,
               "Songs".title,
               "Songs".artist,
               "Songs".image_url,
               "Songs".external_url,
               "Songs".preview_url,
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

router.get("/currently-playing", async (req, res) => {
  try {
    // const accessToken = req.cookies.access_token; // Get the user's access token from the cookie
    const userId = 11; 
    const user = await User.findByPk(userId);

    if (!user || !user.access_token) {
      return res.status(404).json({ error: "User not found or missing access token" });
    }

    const accessToken = user.access_token;
    const response = await axios.get(`https://api.spotify.com/v1/me/player/currently-playing`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }); 
    console.log(response.data.item)
    const currentlyPlayingTrack = response.data.item;
    const progress = response.data.progress_ms;

    res.json({
      accessToken, 
      trackName: currentlyPlayingTrack.name,
      artistName: currentlyPlayingTrack.artists[0].name,
      progress,
      trackUrl: currentlyPlayingTrack.external_urls.spotify, 
      previewUrl: currentlyPlayingTrack.preview_url
    });
  } catch (error) {
    console.log("Error retrieving currently playing track:");
    res.status(500).json({ error: "An error occurred" });
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
    const playbackDetails = await PlaybackDetails.findOne({
      where: { playback_id: playback.playback_id },
    });
    const song = await Song.findOne({
      where: { song_id: song_id },
    });

    const result = {
      song_id: song.song_id,
      title: song.title,
      artist: song.artist,
      image_url: song.image_url,
      external_url: song.external_url,
      latitude: playbackDetails.latitude,
      longitude: playbackDetails.longitude,
      user_id: user_id,
    };
    playback && playbackDetails
      ? res.status(200).json(result)
      : res.status(404).send("Playback Not Found");
  } catch (error) {
    next(error);
  }
});

// fetch personal playbacks by user id
router.get("/:userId", async (req, res, next) => {
  try {
    const user_id = parseInt(req.params.userId);
    const result = await db.query(`
        SELECT "Songs".song_id,
               "Songs".title,
               "Songs".artist,
               "Songs".image_url,
               "Songs".external_url,
               "Songs".preview_url,
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
        WHERE "Users".user_id = ${user_id}
    `);
    return res.status(200).json({ content: result[0] });
  } catch (error) {
    next(error);
  }
});

router.use(express.json());

/* post playback with userid and songid in req.body and post related coordinates in playbackDetails table
 * req.body: { user_id: int, song_id: int, latitude: number, longitude: number }
 * response: {
    "song_id": 5,
    "title": "Every Little Thing She Does is Magic",
    "arist": "Lyle Zboncak",
    "image_url": "https://avatars.githubusercontent.com/u/24090970",
    "external_url": "https://avatars.githubusercontent.com/u/90759936",
    "latitude": "55.130000",
    "longitude": "-13.440000",
    "user_id": 2
} 
*/
router.post("/", async (req, res) => {
  let playback = await Playback.findOne({
    where: { user_id: req.body.user_id, song_id: req.body.song_id },
  });
  console.log(playback);
  if (!playback) {
    try {
      const { user_id, song_id } = req.body;
      console.log(req.body);

      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const query =
        'INSERT INTO "Playbacks" (user_id, song_id, "createdAt", "updatedAt") VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *';
      const values = [user_id, song_id];

      const newPlayback = await db.query(query, {
        bind: values,
        type: db.QueryTypes.INSERT,
      });
      playback = newPlayback[0][0];
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  try {
    const { latitude, longitude } = req.body;
    const query =
      'INSERT INTO "PlaybackDetails" (playback_id, latitude, longitude, "createdAt", "updatedAt") VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *';
    const values = [playback.playback_id, latitude, longitude];

    // const res = await PlaybackDetails.findOne({
    //   // where: { user_id: req.body.user_id, song_id: req.body.song_id },
    //   where: {
    //     playback_id: playback.playback_id,
    //     latitude: latitude,
    //     longitude: longitude,
    //   },
    // });

    const newPlaybackDetails = await db.query(query, {
      bind: values,
      type: db.QueryTypes.INSERT,
    });
    const song = await Song.findByPk(playback.song_id);
    const user = await User.findByPk(playback.user_id);
    const newPlayback = {
      song_id: song.song_id,
      title: song.title,
      arist: song.artist,
      image_url: song.image_url,
      external_url: song.external_url,
      preview_url: song.preview_url,
      latitude: newPlaybackDetails[0][0].latitude,
      longitude: newPlaybackDetails[0][0].longitude,
      user_id: user.user_id,
    };
    res.status(201).json(newPlayback);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
