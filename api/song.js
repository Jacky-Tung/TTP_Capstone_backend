const express = require("express");
const router = express.Router();
const { Song } = require("../db/models");

// https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow

// fetches info about a song
router.get("/:id/info", async (req, res) => {
  try {
    const songId = req.params.id;
    const songInfo = await fetch(
      `https://api.spotify.com/v1/tracks/${songId}`,
      {
        method: "GET",
        headers: {
          Authorization: Bearer`${req.params.accessToken}`, // insert access token here
        },
      }
    ).json();
    // songInfo ? res.status(200);
  } catch {
    next(err);
  }
});

/**
 * Fetches all songs
 */
router.get("/", async (req, res, next) => {
  try {
    const allSongs = await Song.findAll();
    allSongs
      ? res.status(200).json(allSongs)
      : res.status(404).send("Song Listing Not Found");
  } catch (error) {
    next(error);
  }
});

router.use(express.json());
/* post a song by id */
router.post("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title, artist, image_url, external_url } = req.body;
    console.log(req.body);

    const newSong = await Song.create({
      song_id: id,
      title,
      artist,
      image_url,
      external_url,
    });

    res.status(201).json(newSong);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// fetches current playing song
router.get("/currently-playing", async (req, res) => {
  try {
    const songInfo = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${req.query.accessToken}`,
        },
      }
    );

    if (songInfo.ok) {
      const songData = await songInfo.json();
      res.status(200).json(songData);
    } else {
      throw new Error("Failed to fetch current playing song.");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
