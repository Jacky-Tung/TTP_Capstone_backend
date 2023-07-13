const express = require("express");
const router = express.Router();
const {Playback, PlaybackDetails} = require("../db/models");
 
/**
 * Fetch all playbacks and playbackDetails
 */
router.get("/", async (req, res, next) => {
  try {
    const allPlaybacks = await Playback.findAll();
    const allPlaybackDetails = await PlaybackDetails.findAll();
    const result = {
        allPlaybacks: allPlaybacks,
        allPlaybackDetails: allPlaybackDetails,
    }
    allPlaybacks && allPlaybackDetails
      ? res.status(200).json(result)
      : res.status(404).send("Playback Listing Not Found");
  } catch (error) {
    next(error);
  }
});

/**
 * Fetch playback and playbackDetails by id
 */
router.get("/:id", async (req, res, next) => {
  try {
    const playback = await Playback.findAll({where: {playback_id: req.params.id}});
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

module.exports = router