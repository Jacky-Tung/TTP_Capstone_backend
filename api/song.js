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

  request.get(fetch, async function (error, response, body) {
    if (error) {
      console.error("Error fetching currently playing song:", error);
      return res.status(500).json({
        error: "Something went wrong while fetching currently playing song.",
      });
    }

    if (body && body.item) {
      const song = body.item;

      // checks if song is already in db
      const existingSong = await Song.findOne({
        where: {
          title: song.name,
          artist: song.artists[0].name,
        },
      });

      if (!existingSong) {
        try {
          const newSong = await Song.create({
            title: song.name,
            artist: song.artists[0].name,
            image_url: song.album.images[0].url,
            external_url: song.external_urls.spotify,
            preview_url: song.preview_url || null,
          });

          res.status(201).json(newSong);
        } catch (error) {
          console.error("Error creating new song:", error);
          return res.status(500).json({ error: "Something went wrong." });
        }
      } else {
        console.log("Song already exists in the database:");
        res.json(existingSong);
      }
    } else {
      return res.status(404).json({ error: "No song currently playing." });
    }
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
