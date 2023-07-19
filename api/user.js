const express = require("express");
const router = express.Router();
const { User } = require("../db/models");

// Get recently played songs - https://developer.spotify.com/documentation/web-api/reference/get-recently-played

/**
 * Fetch all users
 */
router.get("/", async (req, res, next) => {
  try {
    const allUsers = await User.findAll();
    allUsers
      ? res.status(200).json(allUsers)
      : res.status(404).send("User Listing Not Found");
  } catch (error) {
    next(error);
  }
});

/**
 * Fetch user by id
 */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    user
      ? res.status(200).json(user)
      : res.status(404).send("404 - User Not Found");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
