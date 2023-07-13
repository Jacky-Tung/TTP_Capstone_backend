const express = require("express");
const router = express.Router();
const Song = require("../db/models");

// https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow

// fetches info about a song
router.get("/:id/info", async (req, res) => {
  try {
    const songId = req.params.id;
    const songInfo = await fetch(
      `https://api.spotify.com/v1/tracks/${songId}`,
      {
        method: "GET",
        // headers: {
        //     'Authorization': Bearer '' // insert access token here
        // }
      }
    ).json();
    // songInfo ? res.status(200);
  } catch {
    next(err);
  }
});

module.exports = router;
