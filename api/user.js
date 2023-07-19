const express = require("express");
const router = express.Router();
const { User } = require("../db/models");

// Get recently played songs - https://developer.spotify.com/documentation/web-api/reference/get-recently-played

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

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

const generateRandomString = function (length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

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

// Login - https://developer.spotify.com/documentation/web-api/tutorials/code-flow
router.get("/login", async (req, res) => {
  var state = generateRandomString(16);
  var scope = "user-read-private user-read-email user-read-playback-state user-read-recently-played";


  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      })
  );
});

module.exports = router;
