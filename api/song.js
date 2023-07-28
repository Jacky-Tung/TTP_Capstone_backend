const express = require("express");
const router = express.Router();
const request = require("request");
const axios = require("axios");
const { User } = require("../db/models");
const { Song } = require("../db/models");
const {ActivePlaybackDetails} = require("../db/models");
router.use(express.json());

// https://developer.spotify.com/documentation/web-api/tutorials/implicit-flow

// fetches currently playing song
router.get("/currently-playing", async (req, res) => {
  const userId = req.query.user_id; 
  try {
    // Fetch the user from the database based on the provided user ID
    const user = await User.findOne({ where: { user_id: userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const fetch = {
      url: "https://api.spotify.com/v1/me/player/currently-playing",
      headers: {
        Authorization: `Bearer ` + user.access_token, // Use the user's accessToken for Spotify API request
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

      if (body && body.item && body.is_playing) {
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
            const latestSong = await Song.findOne({
              order: [['song_id', 'DESC']], // Order the result in descending order based on user_id
            });
       
            // If there are no users yet, start from user_id = 1
            const lastSongId = latestSong ? parseInt(latestSong.song_id) : 0;
            const nextSongId = (lastSongId + 1);
            const newSong = await Song.create({
              song_id: nextSongId, 
              title: song.name,
              artist: song.artists[0].name,
              image_url: song.album.images[0].url,
              external_url: song.external_urls.spotify,
              preview_url: song.preview_url || null,
              isCurrentlyPlaying: body.is_playing
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
        const playbackToDelete = await ActivePlaybackDetails.findAll({
          where: { user_id: userId },
        });
        
        if (playbackToDelete.length > 0) {
          await ActivePlaybackDetails.destroy({
            where: { user_id: userId },
          });
        }
        return res.status(404).json({ error: "No song currently playing." });
      }
    });
  } catch (error) {
    console.error("Error fetching user or currently playing song:", error);
    // call /active-playback/:userId to delete the user's ActivePlaybackDetails
    return res.status(500).json({
      error: "Something went wrong while fetching currently playing song.",
    });
  }
});

// fetches playback state and timestamp
router.get("/playback-state", async (req, res) => {
  const userId = req.query.user_id;
  const user = await User.findOne({ where: { user_id: userId } });
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }
  if (!user.access_token) {
    return res.status(404).json({ error: "User not connected to spotify." });
  }
  const fetch = {
    url: "https://api.spotify.com/v1/me/player",
    headers: {
      Authorization: `Bearer ` + user.access_token,
    },
    json: true,
  };
  request.get(fetch, async function (error, response, body) {
    if (error) {
      console.error(error);
      return res.status(500).json({
        error: "Something went wrong while fetching playback state.",
      });
    }
    console.log(body);
    if(body)
      res.json({ is_playing: body.is_playing, timestamp: body.timestamp });
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
