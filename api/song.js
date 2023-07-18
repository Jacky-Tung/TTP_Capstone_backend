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

router.use(express.json());
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
      const { title, artist, image_url, external_url } = req.body;
      console.log(req.body);

      const newSong = await Song.create({
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
  } else {
    res.status(409).json({ error: "Song already exists in database" });
  }
});

module.exports = router;
