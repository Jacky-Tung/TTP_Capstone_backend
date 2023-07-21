const express = require("express");
const router = express.Router();
const request = require("request");
const { Song } = require("../db/models");
router.use(express.json());

// https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow


// fetches currently playing song
router.get("/currently-playing", async (req, res) => {
  const fetch = {
    url: "https://api.spotify.com/v1/me/player/currently-playing",
    headers: {
      Authorization: `Bearer ` + req.query.access_token,
    },
    json: true,
  };

  request.get(fetch, function (error, response, body) {
    console.log(req.query.access_token);
    res.json(body);
  });
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

// post a song
router.post("/", async (req, res) => {
  const song = await Song.findOne({
    where: {
      title: req.body.title,
      artist: req.body.artist,
    },
  });

  if (!song) {
    try {
      const { title, artist, image_url, external_url, preview_url } = req.body;
      console.log(req.body);

      const newSong = await Song.create({
        title,
        artist,
        image_url,
        external_url,
        preview_url,
      });

      res.status(201).json(newSong);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(409).json({ error: "Song already exists in database" });
  }
});

module.exports = router;
